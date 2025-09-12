import { NextRequest, NextResponse } from 'next/server';
import { db, isSupabaseAvailable } from '@/lib/supabase';

/**
 * POST /api/auth/validate-referral
 * Validate a referral code before user registration
 * 
 * Body:
 * {
 *   referralCode: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const { referralCode } = await request.json();

    if (!referralCode) {
      return NextResponse.json(
        { error: 'Referral code is required' },
        { status: 400 }
      );
    }

    // Clean and validate referral code format
    const cleanReferralCode = referralCode.trim().toUpperCase();
    
    // Basic format validation (e.g., JOHN1234)
    if (!/^[A-Z]{4}\d{4}$/.test(cleanReferralCode)) {
      return NextResponse.json({
        valid: false,
        error: 'Invalid referral code format. Code should be 4 letters followed by 4 numbers (e.g., JOHN1234)'
      }, { status: 400 });
    }

    // If database is not configured, return error
    if (!isSupabaseAvailable) {
      return NextResponse.json({
        valid: false,
        error: 'Database not configured. Please set up Supabase to use referral codes.',
        message: 'Referral validation is currently unavailable. You can still create an account.'
      }, { status: 503 });
    }

    // Find referrer by referral code
    const referrer = await db.users.findByReferralCode(cleanReferralCode);

    if (!referrer) {
      return NextResponse.json({
        valid: false,
        message: 'This referral code is not valid. You can still create an account without it.'
      });
    }

    // Return referrer info (without sensitive data)
    return NextResponse.json({
      valid: true,
      referrer: {
        name: referrer.name,
        email: referrer.email.replace(/(.{2}).*(@.*)/, '$1***$2') // Mask email for privacy
      },
      rewards: {
        signupBonus: 100,
        firstOrderDiscount: 200,
        referrerReward: 500
      },
      message: `Great! You'll get ₹100 welcome bonus and ₹200 first order discount. ${referrer.name} will earn ₹500 when you make your first purchase.`
    });

  } catch (error) {
    console.error('Referral validation API error:', error);

    // Handle database connection errors gracefully
    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
        return NextResponse.json({
          valid: false,
          message: 'Unable to validate referral code at the moment. You can still create an account.',
          error: 'Database connection error'
        }, { status: 503 });
      }
    }

    return NextResponse.json(
      { error: 'Internal server error during referral validation' },
      { status: 500 }
    );
  }
}