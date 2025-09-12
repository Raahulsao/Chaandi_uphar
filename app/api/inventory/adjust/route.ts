import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  try {
    const body = await request.json()
    const { product_id, quantity_change, adjustment_type = 'manual', reason } = body

    if (!product_id || quantity_change === undefined) {
      return NextResponse.json({ error: 'Product ID and quantity change are required' }, { status: 400 })
    }

    // Get current inventory
    const { data: inventory, error: inventoryError } = await supabase
      .from('inventory')
      .select('*')
      .eq('product_id', product_id)
      .single()

    if (inventoryError || !inventory) {
      return NextResponse.json({ error: 'Inventory record not found' }, { status: 404 })
    }

    const newQuantity = Math.max(0, inventory.quantity + quantity_change)

    // Update inventory
    const { data: updatedInventory, error: updateError } = await supabase
      .from('inventory')
      .update({
        quantity: newQuantity,
        updated_at: new Date().toISOString()
      })
      .eq('product_id', product_id)
      .select()
      .single()

    if (updateError) {
      console.error('Database error:', updateError)
      return NextResponse.json({ error: 'Failed to update inventory' }, { status: 500 })
    }

    // Log the adjustment
    const { error: logError } = await supabase
      .from('inventory_adjustments')
      .insert({
        inventory_id: inventory.id,
        adjustment_type,
        quantity_change,
        reason: reason || `${adjustment_type} adjustment`,
        created_at: new Date().toISOString()
      })

    if (logError) {
      console.error('Failed to log adjustment:', logError)
      // Don't fail the request if logging fails
    }

    return NextResponse.json({
      ...updatedInventory,
      previous_quantity: inventory.quantity,
      quantity_change
    })
  } catch (error) {
    console.error('Inventory adjustment error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}