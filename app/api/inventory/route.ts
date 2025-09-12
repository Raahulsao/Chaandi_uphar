import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('product_id')
    const lowStock = searchParams.get('low_stock')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('inventory')
      .select(`
        *,
        products (
          id,
          name,
          sku,
          price
        )
      `)
      .order('updated_at', { ascending: false })

    if (productId) {
      query = query.eq('product_id', productId)
    }

    if (lowStock === 'true') {
      query = query.lt('quantity', 10) // Low stock threshold
    }

    query = query.range(offset, offset + limit - 1)

    const { data, error } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to fetch inventory' }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Inventory fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  try {
    const body = await request.json()
    const { product_id, quantity, reserved_quantity = 0, low_stock_threshold = 10 } = body

    if (!product_id || quantity === undefined) {
      return NextResponse.json({ error: 'Product ID and quantity are required' }, { status: 400 })
    }

    // Check if inventory record already exists
    const { data: existing } = await supabase
      .from('inventory')
      .select('id')
      .eq('product_id', product_id)
      .single()

    if (existing) {
      return NextResponse.json({ error: 'Inventory record already exists for this product' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('inventory')
      .insert({
        product_id,
        quantity,
        reserved_quantity,
        low_stock_threshold,
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to create inventory record' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Inventory creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}