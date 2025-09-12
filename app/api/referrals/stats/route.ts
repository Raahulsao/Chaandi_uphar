import { NextRequest, NextResponse } from 'next/server';
import { db, isSupabaseAvailable } from '@/lib/supabase';

/**
 * GET /api/referrals/stats?userId=user123
 * Get referral statistics for a user
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

  // If database is not configured, return error
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
      // For non-UUID user IDs (like Firebase), find user first
      try {
        const user = await db.users.findByEmail(userId);
        if (!user) {
          return NextResponse.json({
            stats: {
              totalReferrals: 0,
              completedReferrals: 0,
              pendingReferrals: 0,
              totalEarnings: 0,
              pendingEarnings: 0,
              activeRewards: 0,
              expiredRewards: 0,
              clicksThisMonth: 0,
              conversionsThisMonth: 0,
              conversionRate: 0
            },
            recentActivity: []
          });
        }
        // Continue with the real user ID
        userId = user.id;
      } catch (error) {
        console.error('Error finding user for stats:', error);
        return NextResponse.json({
          stats: {
            totalReferrals: 0,
            completedReferrals: 0,
            pendingReferrals: 0,
            totalEarnings: 0,
            pendingEarnings: 0,
            activeRewards: 0,
            expiredRewards: 0,
            clicksThisMonth: 0,
            conversionsThisMonth: 0,
            conversionRate: 0
          },
          recentActivity: []
        });
      }
    }

    // Get referrals for the user
    const referrals = await db.referrals.findByUserId(userId);
    const rewards = await db.rewards.findByUserId(userId);

    // Calculate statistics
    const totalReferrals = referrals?.length || 0;
    const completedReferrals = referrals?.filter(r => r.status === 'completed').length || 0;
    const pendingReferrals = referrals?.filter(r => r.status === 'pending').length || 0;
    
    const totalEarnings = referrals?.reduce((sum, r) => 
      sum + (r.reward_given ? r.reward_amount : 0), 0) || 0;
    const pendingEarnings = referrals?.reduce((sum, r) => 
      sum + (!r.reward_given && r.status === 'completed' ? r.reward_amount : 0), 0) || 0;

    const activeRewards = rewards?.filter(r => 
      !r.used && (r.expires_at === null || new Date(r.expires_at) > new Date())).length || 0;
    const expiredRewards = rewards?.filter(r => 
      !r.used && r.expires_at !== null && new Date(r.expires_at) <= new Date()).length || 0;

    // Mock click and conversion data (would come from analytics table in real implementation)
    const clicksThisMonth = Math.floor(totalReferrals * 3.5); // Estimated
    const conversionsThisMonth = completedReferrals;
    const conversionRate = clicksThisMonth > 0 ? (conversionsThisMonth / clicksThisMonth) * 100 : 0;

    // Recent activity (last 10 referral-related events)
    const recentActivity: Array<{
      type: string;
      description: string;
      amount: number;
      date: string;
    }> = [];
    
    if (referrals) {
      referrals
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5)
        .forEach(referral => {
          if (referral.status === 'completed') {
            recentActivity.push({
              type: 'referral_completed',
              description: 'A friend completed their first purchase',
              amount: referral.reward_amount,
              date: referral.completed_at || referral.created_at
            });
          } else {
            recentActivity.push({
              type: 'referral_applied',
              description: 'New user applied your referral code',
              amount: 0,
              date: referral.created_at
            });
          }
        });
    }

    return NextResponse.json({
      stats: {
        totalReferrals,
        completedReferrals,
        pendingReferrals,
        totalEarnings,
        pendingEarnings,
        activeRewards,
        expiredRewards,
        clicksThisMonth,
        conversionsThisMonth,
        conversionRate: Math.round(conversionRate * 100) / 100
      },
      recentActivity: recentActivity.slice(0, 10)
    });

  } catch (error) {
    console.error('Error fetching referral stats:', error);
    
    // If it's a UUID error, return empty stats
    if (error && typeof error === 'object' && 'code' in error && error.code === '22P02') {
      return NextResponse.json({
        stats: {
          totalReferrals: 0,
          completedReferrals: 0,
          pendingReferrals: 0,
          totalEarnings: 0,
          pendingEarnings: 0,
          activeRewards: 0,
          expiredRewards: 0,
          clicksThisMonth: 0,
          conversionsThisMonth: 0,
          conversionRate: 0
        },
        recentActivity: []
      });
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch referral statistics' },
      { status: 500 }
    );
  }
}