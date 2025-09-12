import { NextRequest, NextResponse } from 'next/server';
import { db, isSupabaseAvailable } from '@/lib/supabase';

/**
 * GET /api/auth/user-stats?userId=user123
 * Get comprehensive user statistics including referrals, orders, and rewards
 */
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
      { error: 'Database not configured. Please set up Supabase to access user statistics.' },
      { status: 503 }
    );
  }

  try {
    // Check if userId is a valid UUID format
    const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(userId);
    
    let actualUserId = userId;
    
    if (!isValidUUID) {
      // For non-UUID user IDs (like Firebase), find user first
      try {
        const user = await db.users.findByEmail(userId);
        if (!user) {
          return NextResponse.json({
            completedReferrals: 0,
            totalEarnings: 0,
            activeRewards: 0,
            totalOrders: 0,
            pendingOrders: 0
          });
        }
        actualUserId = user.id;
      } catch (error) {
        console.error('Error finding user for stats:', error);
        return NextResponse.json({
          completedReferrals: 0,
          totalEarnings: 0,
          activeRewards: 0,
          totalOrders: 0,
          pendingOrders: 0
        });
      }
    }

    // Fetch user data in parallel
    const [referrals, rewards, orders] = await Promise.all([
      db.referrals.findByUserId(actualUserId).catch(() => []),
      db.rewards.findByUserId(actualUserId).catch(() => []),
      db.orders.findByUserId(actualUserId).catch(() => [])
    ]);

    // Calculate referral statistics
    const completedReferrals = referrals?.filter(r => r.status === 'completed').length || 0;
    const totalEarnings = referrals?.reduce((sum, r) => 
      sum + (r.reward_given ? r.reward_amount : 0), 0) || 0;

    // Calculate reward statistics
    const activeRewards = rewards?.filter(r => 
      !r.used && (r.expires_at === null || new Date(r.expires_at) > new Date())).length || 0;

    // Calculate order statistics
    const totalOrders = orders?.length || 0;
    const pendingOrders = orders?.filter(o => 
      ['pending', 'confirmed', 'processing'].includes(o.status)).length || 0;

    return NextResponse.json({
      completedReferrals,
      totalEarnings,
      activeRewards,
      totalOrders,
      pendingOrders,
      // Additional stats
      pendingReferrals: referrals?.filter(r => r.status === 'pending').length || 0,
      totalRewards: rewards?.length || 0,
      usedRewards: rewards?.filter(r => r.used).length || 0,
      deliveredOrders: orders?.filter(o => o.status === 'delivered').length || 0
    });

  } catch (error) {
    console.error('Error fetching user statistics:', error);
    
    // Handle specific database errors
    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === '22P02') { // UUID format error
        return NextResponse.json({
          completedReferrals: 0,
          totalEarnings: 0,
          activeRewards: 0,
          totalOrders: 0,
          pendingOrders: 0
        });
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch user statistics' },
      { status: 500 }
    );
  }
}