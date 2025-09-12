import { NextRequest, NextResponse } from 'next/server';
import { db, isSupabaseAvailable } from '@/lib/supabase';

/**
 * POST /api/referrals/apply
 * Apply a referral code to an existing user
 * 
 * Body:
 * {
 *   userId: string,
 *   referralCode: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const { userId, referralCode } = await request.json();

    if (!userId || !referralCode) {
      return NextResponse.json(
        { error: 'User ID and referral code are required' },
        { status: 400 }
      );
    }

    // Clean referral code
    const cleanReferralCode = referralCode.trim().toUpperCase();

    // If database is not configured, return mock success
    if (!isSupabaseAvailable) {
      return NextResponse.json({
        success: true,
        referral: {
          id: 'mock-referral-' + Date.now(),
          referrer_id: 'mock-referrer',
          referred_id: userId,
          referral_code: cleanReferralCode,
          status: 'pending',
          reward_amount: 500,
          created_at: new Date().toISOString()
        },
        rewards: [
          {
            id: 'mock-reward-' + Date.now(),
            user_id: userId,
            type: 'order_discount',
            amount: 200,
            description: 'First order discount for using referral code',
            expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          }
        ],
        message: 'Referral code applied! You got ₹200 discount on your first order.',
        mockMode: true
      });
    }

    // Find referrer by referral code
    const referrer = await db.users.findByReferralCode(cleanReferralCode);
    
    if (!referrer) {
      return NextResponse.json(
        { error: 'Invalid referral code' },
        { status: 400 }
      );
    }

    if (referrer.id === userId) {
      return NextResponse.json(
        { error: 'Cannot use your own referral code' },
        { status: 400 }
      );
    }

    // Check if referral already exists
    const existingReferrals = await db.referrals.findByUserId(userId);
    const existingReferral = existingReferrals?.find(r => 
      r.referrer_id === referrer.id || r.referred_id === userId
    );

    if (existingReferral) {
      return NextResponse.json(
        { error: 'Referral code already used' },
        { status: 400 }
      );
    }

    // Create referral record
    const referral = await db.referrals.create({
      referrer_id: referrer.id,
      referred_id: userId,
      referral_code: cleanReferralCode,
      status: 'pending',
      reward_amount: 500,
    });

    // Create discount for referred user
    const orderDiscount = await db.rewards.create({
      user_id: userId,
      referral_id: referral.id,
      type: 'order_discount',
      amount: 200, // ₹200 discount on first order
      description: 'First order discount for using referral code',
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    });

    // Create signup bonus if user just registered
    const signupBonus = await db.rewards.create({
      user_id: userId,
      referral_id: referral.id,
      type: 'signup_bonus',
      amount: 100, // ₹100 signup bonus
      description: 'Welcome bonus for using referral code',
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    });

    return NextResponse.json({
      success: true,
      referral,
      rewards: [orderDiscount, signupBonus],
      message: 'Referral code applied! You got ₹100 welcome bonus and ₹200 discount on your first order.',
    });

  } catch (error) {
    console.error('Apply referral API error:', error);
    
    // Handle specific database errors
    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === '23505') { // Unique violation
        return NextResponse.json(
          { error: 'Referral already exists for this user' },
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
      { error: 'Internal server error while applying referral' },
      { status: 500 }
    );
  }
}