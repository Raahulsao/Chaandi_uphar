import { NextRequest, NextResponse } from 'next/server';
import { db, generateReferralCode, isSupabaseAvailable } from '@/lib/supabase';

/**
 * POST /api/auth/register
 * Register a new user with referral code generation
 * 
 * Body:
 * {
 *   firebaseUid: string,
 *   email: string,
 *   name: string,
 *   mobileNumber?: string,
 *   referralCodeUsed?: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const { firebaseUid, email, name, mobileNumber, referralCodeUsed } = await request.json();

    // Validate required fields
    if (!firebaseUid || !email || !name) {
      return NextResponse.json(
        { error: 'Firebase UID, email, and name are required' },
        { status: 400 }
      );
    }

    // Generate unique referral code for the new user
    const userReferralCode = generateReferralCode(name, email);

    // If database is not configured, return mock success response
    if (!isSupabaseAvailable) {
      return NextResponse.json({
        success: true,
        user: {
          id: firebaseUid,
          email,
          name,
          mobile_number: mobileNumber,
          referral_code: userReferralCode,
          referred_by: referralCodeUsed || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        message: referralCodeUsed 
          ? 'Account created successfully! You received a ₹100 welcome bonus.' 
          : 'Account created successfully!',
        mockMode: true
      });
    }

    // Check if user already exists in database
    const existingUser = await db.users.findByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists in database' },
        { status: 409 }
      );
    }

    // Create user in database
    const newUser = await db.users.create({
      id: firebaseUid,
      email,
      name,
      mobile_number: mobileNumber,
      referral_code: userReferralCode,
      referred_by: referralCodeUsed || undefined,
    });

    let referralBonus = null;
    let signupBonus = null;

    // If user used a referral code, process referral
    if (referralCodeUsed) {
      try {
        const referrer = await db.users.findByReferralCode(referralCodeUsed);
        
        if (referrer) {
          // Create referral record
          const referral = await db.referrals.create({
            referrer_id: referrer.id,
            referred_id: newUser.id,
            referral_code: referralCodeUsed,
            status: 'pending',
            reward_amount: 500, // ₹500 reward for referrer
          });

          // Create signup bonus for new user
          signupBonus = await db.rewards.create({
            user_id: newUser.id,
            referral_id: referral.id,
            type: 'signup_bonus',
            amount: 100, // ₹100 signup bonus
            description: 'Welcome bonus for signing up with referral code',
            expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
          });

          // Create first order discount for new user
          await db.rewards.create({
            user_id: newUser.id,
            referral_id: referral.id,
            type: 'order_discount',
            amount: 200, // ₹200 discount on first order
            description: 'First order discount for using referral code',
            expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
          });
        }
      } catch (referralError) {
        console.error('Error processing referral:', referralError);
        // Continue with user creation even if referral processing fails
      }
    }

    return NextResponse.json({
      success: true,
      user: newUser,
      referralBonus,
      signupBonus,
      message: referralCodeUsed 
        ? 'Account created successfully! You received a ₹100 welcome bonus and ₹200 first order discount.' 
        : 'Account created successfully! Your referral code is ready to share.',
    });

  } catch (error) {
    console.error('Registration API error:', error);
    
    // Handle specific database errors
    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === '23505') { // Unique violation
        return NextResponse.json(
          { error: 'User with this email or referral code already exists' },
          { status: 409 }
        );
      }
      if (error.code === '22P02') { // UUID format error
        return NextResponse.json(
          { error: 'Invalid user ID format' },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Internal server error during registration' },
      { status: 500 }
    );
  }
}