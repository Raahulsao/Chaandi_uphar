import { NextRequest, NextResponse } from 'next/server';
import { db, isSupabaseAvailable } from '@/lib/supabase';

// GET /api/rewards?userId=user123
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
    // Return comprehensive mock rewards when database is not configured
    return NextResponse.json([
      {
        id: "reward-1",
        user_id: userId,
        referral_id: "ref-1",
        type: "signup_bonus",
        amount: 100,
        description: "Welcome bonus for signing up with referral code",
        used: false,
        expires_at: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "reward-2",
        user_id: userId,
        referral_id: "ref-1", 
        type: "order_discount",
        amount: 200,
        description: "First order discount for using referral code",
        used: false,
        expires_at: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "reward-3",
        user_id: userId,
        referral_id: "ref-2",
        type: "referral_bonus",
        amount: 500,
        description: "Referral bonus for successful referral",
        used: false,
        expires_at: null,
        created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "reward-4",
        user_id: userId,
        referral_id: "ref-3",
        type: "order_discount",
        amount: 150,
        description: "Special promotion discount",
        used: true,
        expires_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]);
  }

  try {
    // Check if userId is a valid UUID format
    const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(userId);
    
    if (!isValidUUID) {
      // For non-UUID user IDs (like Firebase), return mock data
      return NextResponse.json([
        {
          id: "firebase-reward-1",
          user_id: userId,
          referral_id: "firebase-ref-1",
          type: "signup_bonus",
          amount: 100,
          description: "Welcome bonus for Firebase user",
          used: false,
          expires_at: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date().toISOString()
        },
        {
          id: "firebase-reward-2",
          user_id: userId,
          referral_id: "firebase-ref-1",
          type: "referral_bonus",
          amount: 500,
          description: "Referral bonus earned",
          used: false,
          expires_at: null,
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]);
    }

    const rewards = await db.rewards.findByUserId(userId);
    return NextResponse.json(rewards || []);
  } catch (error) {
    console.error('Error fetching rewards:', error);
    
    // If it's a UUID error, return empty array instead of error
    if (error && typeof error === 'object' && 'code' in error && error.code === '22P02') {
      console.warn(`UUID format error for userId: ${userId}. Returning empty rewards.`);
      return NextResponse.json([]);
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch rewards' },
      { status: 500 }
    );
  }
}

// POST /api/rewards - Create new reward or use existing reward
export async function POST(request: NextRequest) {
  try {
    const { action, ...data } = await request.json();

    switch (action) {
      case 'create':
        return await createReward(data);
      
      case 'use':
        return await useReward(data);
      
      case 'get_available':
        return await getAvailableRewards(data);
      
      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: create, use, get_available' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Rewards API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Create a new reward
async function createReward(data: {
  userId: string;
  referralId?: string;
  type: 'signup_bonus' | 'referral_bonus' | 'order_discount';
  amount: number;
  description: string;
  expiresAt?: string;
}) {
  const { userId, referralId, type, amount, description, expiresAt } = data;

  if (!isSupabaseAvailable) {
    return NextResponse.json({
      success: true,
      reward: {
        id: 'mock-reward-' + Date.now(),
        user_id: userId,
        referral_id: referralId,
        type,
        amount,
        description,
        used: false,
        expires_at: expiresAt,
        created_at: new Date().toISOString()
      },
      message: `${type} reward created successfully`,
      mockMode: true
    });
  }

  try {
    const reward = await db.rewards.create({
      user_id: userId,
      referral_id: referralId,
      type,
      amount,
      description,
      expires_at: expiresAt,
    });

    return NextResponse.json({
      success: true,
      reward,
      message: `${type} reward created successfully`
    });
  } catch (error) {
    console.error('Create reward error:', error);
    return NextResponse.json(
      { error: 'Failed to create reward' },
      { status: 500 }
    );
  }
}

// Use/redeem a reward
async function useReward(data: {
  rewardId: string;
  orderId?: string;
}) {
  const { rewardId, orderId } = data;

  if (!isSupabaseAvailable) {
    return NextResponse.json({
      success: true,
      reward: {
        id: rewardId,
        used: true,
        used_at: new Date().toISOString(),
        order_id: orderId
      },
      message: 'Reward used successfully',
      mockMode: true
    });
  }

  try {
    const updatedReward = await db.rewards.markAsUsed(rewardId);
    
    return NextResponse.json({
      success: true,
      reward: updatedReward,
      message: 'Reward used successfully'
    });
  } catch (error) {
    console.error('Use reward error:', error);
    return NextResponse.json(
      { error: 'Failed to use reward' },
      { status: 500 }
    );
  }
}

// Get available rewards for a user (unused and not expired)
async function getAvailableRewards(data: {
  userId: string;
  type?: 'signup_bonus' | 'referral_bonus' | 'order_discount';
}) {
  const { userId, type } = data;

  if (!isSupabaseAvailable) {
    const mockRewards = [
      {
        id: "available-1",
        user_id: userId,
        type: "order_discount",
        amount: 200,
        description: "First order discount",
        expires_at: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "available-2",
        user_id: userId,
        type: "signup_bonus",
        amount: 100,
        description: "Welcome bonus",
        expires_at: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    const filteredRewards = type ? mockRewards.filter(r => r.type === type) : mockRewards;
    
    return NextResponse.json({
      success: true,
      rewards: filteredRewards,
      totalAmount: filteredRewards.reduce((sum, r) => sum + r.amount, 0),
      mockMode: true
    });
  }

  try {
    const allRewards = await db.rewards.findByUserId(userId);
    
    if (!allRewards) {
      return NextResponse.json({
        success: true,
        rewards: [],
        totalAmount: 0
      });
    }

    // Filter available rewards (unused and not expired)
    const availableRewards = allRewards.filter(reward => {
      const isNotUsed = !reward.used;
      const isNotExpired = reward.expires_at === null || new Date(reward.expires_at) > new Date();
      const matchesType = !type || reward.type === type;
      
      return isNotUsed && isNotExpired && matchesType;
    });

    const totalAmount = availableRewards.reduce((sum, reward) => sum + reward.amount, 0);

    return NextResponse.json({
      success: true,
      rewards: availableRewards,
      totalAmount
    });
  } catch (error) {
    console.error('Get available rewards error:', error);
    return NextResponse.json(
      { error: 'Failed to get available rewards' },
      { status: 500 }
    );
  }
}