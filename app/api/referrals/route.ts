import { NextRequest, NextResponse } from 'next/server';
import { db, generateReferralCode, isSupabaseAvailable } from '@/lib/supabase';

// GET /api/referrals?userId=user123
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json(
      { error: 'UserId parameter is required' },
      { status: 400 }
    );
  }

  if (!isSupabaseAvailable) {
    return NextResponse.json(
      { error: 'Database not configured. Please set up Supabase to use the referral system.' },
      { status: 503 }
    );
  }

  try {
    // Check if userId is a valid UUID format
    const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(userId);
    
    if (!isValidUUID) {
      // For non-UUID user IDs (like Firebase), we need to find the user first
      try {
        const user = await db.users.findByEmail(userId); // Assuming userId might be email for Firebase users
        if (!user) {
          return NextResponse.json([]);
        }
        const referrals = await db.referrals.findByUserId(user.id);
        return NextResponse.json(referrals || []);
      } catch (error) {
        console.error('Error fetching referrals for non-UUID user:', error);
        return NextResponse.json([]);
      }
    }

    const referrals = await db.referrals.findByUserId(userId);
    return NextResponse.json(referrals || []);
  } catch (error) {
    console.error('Error fetching referrals:', error);
    
    // If it's a UUID error, return empty array instead of error
    if (error && typeof error === 'object' && 'code' in error && error.code === '22P02') {
      console.warn(`UUID format error for userId: ${userId}. Returning empty referrals.`);
      return NextResponse.json([]);
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch referrals' },
      { status: 500 }
    );
  }
}

// POST /api/referrals - Create referral
export async function POST(request: NextRequest) {
  if (!isSupabaseAvailable) {
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 503 }
    );
  }

  try {
    const { action, ...data } = await request.json();

    switch (action) {
      case 'create_user_with_referral':
        return await createUserWithReferral(data);
      
      case 'apply_referral':
        return await applyReferral(data);
      
      case 'complete_referral':
        return await completeReferral(data);
      
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Referral API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function createUserWithReferral(data: {
  email: string;
  name: string;
  mobile_number?: string;
  referral_code?: string;
}) {
  const { email, name, mobile_number, referral_code: usedReferralCode } = data;
  
  try {
    // Check if user already exists
    const existingUser = await db.users.findByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Generate unique referral code for new user
    const userReferralCode = generateReferralCode(name);
    
    // Create user
    const newUser = await db.users.create({
      email,
      name,
      mobile_number,
      referral_code: userReferralCode,
      referred_by: usedReferralCode || undefined,
    });

    // If user used a referral code, create referral record
    if (usedReferralCode) {
      const referrer = await db.users.findByReferralCode(usedReferralCode);
      
      if (referrer) {
        const referral = await db.referrals.create({
          referrer_id: referrer.id,
          referred_id: newUser.id,
          referral_code: usedReferralCode,
          status: 'pending',
          reward_amount: 500, // ₹500 reward
        });

        // Create signup bonus for new user
        await db.rewards.create({
          user_id: newUser.id,
          referral_id: referral.id,
          type: 'signup_bonus',
          amount: 100, // ₹100 signup bonus
          description: 'Welcome bonus for signing up with referral code',
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        });
      }
    }

    return NextResponse.json({
      success: true,
      user: newUser,
      message: usedReferralCode ? 
        'Account created successfully! You received a ₹100 welcome bonus.' :
        'Account created successfully!',
    });
  } catch (error) {
    console.error('User creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

async function applyReferral(data: {
  userId: string;
  referralCode: string;
}) {
  const { userId, referralCode } = data;
  
  try {
    // Find referrer by referral code
    const referrer = await db.users.findByReferralCode(referralCode);
    
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
      referral_code: referralCode,
      status: 'pending',
      reward_amount: 500,
    });

    // Create discount for referred user
    await db.rewards.create({
      user_id: userId,
      referral_id: referral.id,
      type: 'order_discount',
      amount: 200, // ₹200 discount on first order
      description: 'First order discount for using referral code',
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    });

    return NextResponse.json({
      success: true,
      referral,
      message: 'Referral code applied! You got ₹200 discount on your first order.',
    });
  } catch (error) {
    console.error('Apply referral error:', error);
    return NextResponse.json(
      { error: 'Failed to apply referral code' },
      { status: 500 }
    );
  }
}

async function completeReferral(data: {
  referralId: string;
  orderId: string;
}) {
  const { referralId, orderId } = data;
  
  try {
    // Get referral details
    const referrals = await db.referrals.findByUserId(''); // We'll need to modify this
    const referral = referrals?.find(r => r.id === referralId);
    
    if (!referral) {
      return NextResponse.json(
        { error: 'Referral not found' },
        { status: 404 }
      );
    }

    if (referral.status === 'completed') {
      return NextResponse.json(
        { error: 'Referral already completed' },
        { status: 400 }
      );
    }

    // Complete the referral
    await db.referrals.complete(referralId);

    // Create reward for referrer
    await db.rewards.create({
      user_id: referral.referrer_id,
      referral_id: referralId,
      type: 'referral_bonus',
      amount: referral.reward_amount,
      description: `Referral bonus for successful referral completion`,
    });

    // Mark referral as rewarded
    // This would typically be done with a database update
    
    return NextResponse.json({
      success: true,
      message: 'Referral completed and rewards distributed',
    });
  } catch (error) {
    console.error('Complete referral error:', error);
    return NextResponse.json(
      { error: 'Failed to complete referral' },
      { status: 500 }
    );
  }
}

