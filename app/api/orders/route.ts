import { NextRequest, NextResponse } from 'next/server';
import { db, isSupabaseAvailable } from '@/lib/supabase';

// GET /api/orders?userId=user123
export async function GET(request: NextRequest) {
  if (!isSupabaseAvailable) {
    // Return mock orders when database is not configured
    return NextResponse.json([
      {
        id: "demo-1",
        user_id: "demo-user",
        order_number: "ORD-001",
        status: "delivered",
        total_amount: 15999,
        payment_status: "paid",
        created_at: "2024-12-28T00:00:00Z",
        items: [{
          id: "item-1",
          product_name: "Rose Gold Diamond Necklace",
          price: 15999,
          quantity: 1
        }]
      },
      {
        id: "demo-2",
        user_id: "demo-user",
        order_number: "ORD-002",
        status: "shipped",
        total_amount: 4299,
        payment_status: "paid",
        created_at: "2024-12-20T00:00:00Z",
        items: [{
          id: "item-2",
          product_name: "Silver Temple Earrings",
          price: 4299,
          quantity: 1
        }]
      }
    ]);
  }

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json(
      { error: 'UserId parameter is required' },
      { status: 400 }
    );
  }

  try {
    // Check if userId is a valid UUID format
    const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(userId);
    
    if (!isValidUUID) {
      // For non-UUID user IDs (like Firebase), return empty array for now
      console.warn(`Non-UUID user ID detected: ${userId}. Returning empty orders.`);
      return NextResponse.json([]);
    }

    const orders = await db.orders.findByUserId(userId);
    return NextResponse.json(orders || []);
  } catch (error) {
    console.error('Error fetching orders:', error);
    
    // If it's a UUID error, return empty array instead of error
    if (error && typeof error === 'object' && 'code' in error && error.code === '22P02') {
      console.warn(`UUID format error for userId: ${userId}. Returning empty orders.`);
      return NextResponse.json([]);
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create new order
export async function POST(request: NextRequest) {
  if (!isSupabaseAvailable) {
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 503 }
    );
  }

  try {
    const orderData = await request.json();
    const newOrder = await db.orders.create(orderData);
    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}