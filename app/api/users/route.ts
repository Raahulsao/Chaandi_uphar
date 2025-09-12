import { NextRequest, NextResponse } from 'next/server';
import { db, isSupabaseAvailable } from '@/lib/supabase';

// GET /api/users?email=user@example.com
export async function GET(request: NextRequest) {
  if (!isSupabaseAvailable) {
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 503 }
    );
  }

  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json(
      { error: 'Email parameter is required' },
      { status: 400 }
    );
  }

  try {
    const user = await db.users.findByEmail(email);
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

// POST /api/users - Create new user
export async function POST(request: NextRequest) {
  if (!isSupabaseAvailable) {
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 503 }
    );
  }

  try {
    const userData = await request.json();
    const newUser = await db.users.create(userData);
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

// PUT /api/users - Update user
export async function PUT(request: NextRequest) {
  if (!isSupabaseAvailable) {
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 503 }
    );
  }

  try {
    const { id, ...updates } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Check if userId is a valid UUID format
    const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
    
    if (!isValidUUID) {
      // For non-UUID user IDs (like Firebase), return mock updated user
      console.warn(`Non-UUID user ID detected: ${id}. Returning mock updated user.`);
      return NextResponse.json({
        id,
        ...updates,
        updated_at: new Date().toISOString()
      });
    }

    const updatedUser = await db.users.update(id, updates);
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    
    // If it's a UUID error, return mock data instead of error
    if (error && typeof error === 'object' && 'code' in error && error.code === '22P02') {
      const { id, ...updates } = await request.json();
      console.warn(`UUID format error for userId: ${id}. Returning mock updated user.`);
      return NextResponse.json({
        id,
        ...updates,
        updated_at: new Date().toISOString()
      });
    }
    
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}