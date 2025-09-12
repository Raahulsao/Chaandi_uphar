import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  try {
    const { data, error } = await supabase
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
      .eq('id', params.id)
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Inventory record not found' }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Inventory fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  try {
    const body = await request.json()
    const { quantity, reserved_quantity, low_stock_threshold, adjustment_reason } = body

    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    if (quantity !== undefined) updateData.quantity = quantity
    if (reserved_quantity !== undefined) updateData.reserved_quantity = reserved_quantity
    if (low_stock_threshold !== undefined) updateData.low_stock_threshold = low_stock_threshold

    const { data, error } = await supabase
      .from('inventory')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to update inventory' }, { status: 500 })
    }

    // Log inventory adjustment if reason provided
    if (adjustment_reason && quantity !== undefined) {
      await supabase
        .from('inventory_adjustments')
        .insert({
          inventory_id: params.id,
          adjustment_type: 'manual',
          quantity_change: quantity - (data.quantity || 0),
          reason: adjustment_reason,
          created_at: new Date().toISOString()
        })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Inventory update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  try {
    const { error } = await supabase
      .from('inventory')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to delete inventory record' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Inventory deletion error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}