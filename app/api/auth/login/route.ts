import { NextRequest, NextResponse } from 'next/server';
import { db, generateReferralCode, isSupabaseAvailable } from '@/lib/supabase';

/**
 * POST /api/auth/login
 * Handle user login and create/update user profile
 * 
 * Body:
 * {
 *   firebaseUid: string,
 *   email: string,
 *   name: string,
 *   photoURL?: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const { firebaseUid, email, name, photoURL } = await request.json();

    // Validate required fields
    if (!firebaseUid || !email || !name) {
      return NextResponse.json(
        { error: 'Firebase UID, email, and name are required' },
        { status: 400 }
      );
    }

    // Generate referral code for consistency
    const userReferralCode = generateReferralCode(name, email);

    // If database is not configured, return mock user data
    if (!isSupabaseAvailable) {
      return NextResponse.json({
        success: true,
        user: {
          id: firebaseUid,
          email,
          name,
          referral_code: userReferralCode,
          photo_url: photoURL,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        statistics: {
          completedReferrals: 2,
          totalEarnings: 1000,
          activeRewards: 1
        },
        isNewUser: false,
        message: 'Welcome back! (Demo mode)',
        mockMode: true
      });
    }

    // Check if userId is a valid UUID format first
    const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(firebaseUid);
    
    if (!isValidUUID) {
      // For Firebase UIDs that don't match UUID format, return mock data
      return NextResponse.json({
        success: true,
        user: {
          id: firebaseUid,
          email,
          name,
          referral_code: userReferralCode,
          photo_url: photoURL,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        statistics: {
          completedReferrals: 2,
          totalEarnings: 1000,
          activeRewards: 1
        },
        isNewUser: false,
        message: 'Welcome back! (Firebase mode)',
        mockMode: true
      });
    }

    // Check if user exists in database
    let user = await db.users.findByEmail(email);
    let isNewUser = false;

    if (!user) {
      // Create new user record for existing Firebase user
      isNewUser = true;
      user = await db.users.create({
        id: firebaseUid,
        email,
        name,
        referral_code: userReferralCode,
      });
    } else {
      // Update existing user with latest info from Firebase
      user = await db.users.update(user.id, {
        name, // Update name in case it changed in Firebase
        updated_at: new Date().toISOString()
      });
    }

    // Get user's referral statistics
    const referrals = await db.referrals.findByUserId(user.id);
    const completedReferrals = referrals?.filter(r => r.status === 'completed').length || 0;
    const totalEarnings = referrals?.reduce((sum, r) => sum + (r.reward_given ? r.reward_amount : 0), 0) || 0;

    // Get user's unused rewards
    const rewards = await db.rewards.findByUserId(user.id);
    const activeRewards = rewards?.filter(r => 
      !r.used && (r.expires_at === null || new Date(r.expires_at) > new Date())
    ).length || 0;

    return NextResponse.json({
      success: true,
      user,
      statistics: {
        completedReferrals,
        totalEarnings,
        activeRewards
      },
      isNewUser,
      message: isNewUser 
        ? 'Welcome to Chaandi Uphar! Your account has been set up.' 
        : 'Welcome back to Chaandi Uphar!',
    });

  } catch (error) {
    console.error('Login API error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error during login' },
      { status: 500 }
    );
  }
}