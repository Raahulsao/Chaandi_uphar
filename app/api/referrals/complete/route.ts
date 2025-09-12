import { NextRequest, NextResponse } from 'next/server';
import { db, isSupabaseAvailable } from '@/lib/supabase';

/**
 * POST /api/referrals/complete
 * Complete a referral when the referred user makes their first purchase
 * 
 * Body:
 * {
 *   referralId: string,
 *   orderId: string,
 *   orderAmount: number
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const { referralId, orderId, orderAmount } = await request.json();

    if (!referralId || !orderId) {
      return NextResponse.json(
        { error: 'Referral ID and order ID are required' },
        { status: 400 }
      );
    }

    // If database is not configured, return mock success
    if (!isSupabaseAvailable) {
      return NextResponse.json({
        success: true,
        referral: {
          id: referralId,
          status: 'completed',
          completed_at: new Date().toISOString(),
          reward_given: true
        },
        referrerReward: {
          id: 'mock-referrer-reward-' + Date.now(),
          type: 'referral_bonus',
          amount: 500,
          description: 'Referral bonus for successful referral'
        },
        message: 'Referral completed! Referrer earned ₹500 bonus.',
        mockMode: true
      });
    }

    // Get referral details
    let referral;
    try {
      // Try to get referral by ID if method exists
      if ('findById' in db.referrals && typeof db.referrals.findById === 'function') {
        referral = await (db.referrals as any).findById(referralId);
      } else {
        // Fallback: try to find referral in referrals list
        const allReferrals = await db.referrals.findByUserId('temp');
        referral = allReferrals?.find(r => r.id === referralId);
      }
      
      if (!referral) {
        return NextResponse.json(
          { error: 'Referral not found' },
          { status: 404 }
        );
      }
    } catch (error) {
      return NextResponse.json(
        { error: 'Referral not found' },
        { status: 404 }
      );
    }

    // Complete the referral
    const completedReferral = await db.referrals.complete(referralId);

    // Create referrer reward
    const referrerReward = await db.rewards.create({
      user_id: completedReferral.referrer_id,
      referral_id: referralId,
      type: 'referral_bonus',
      amount: completedReferral.reward_amount,
      description: `Referral bonus for successful referral (Order: ${orderId})`,
    });

    // Mark referral as reward given (if update method exists)
    try {
      if ('update' in db.referrals && typeof (db.referrals as any).update === 'function') {
        await (db.referrals as any).update(referralId, { 
          reward_given: true,
          completed_at: new Date().toISOString()
        });
      }
    } catch (error) {
      console.warn('Could not update referral reward status:', error);
    }

    return NextResponse.json({
      success: true,
      referral: completedReferral,
      referrerReward,
      message: `Referral completed! Referrer earned ₹${completedReferral.reward_amount} bonus.`,
    });

  } catch (error) {
    console.error('Complete referral API error:', error);
    
    // Handle specific database errors
    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === '22P02') { // UUID format error
        return NextResponse.json(
          { error: 'Invalid referral ID format' },
          { status: 400 }
        );
      }
      if (error.code === '23503') { // Foreign key violation
        return NextResponse.json(
          { error: 'Referenced user or referral not found' },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Internal server error while completing referral' },
      { status: 500 }
    );
  }
}