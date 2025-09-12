import { NextRequest, NextResponse } from 'next/server';
import { db, isSupabaseAvailable } from '@/lib/supabase';

// GET /api/products/[id] - Get single product details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isSupabaseAvailable) {
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 503 }
    );
  }

  const { id } = params;

  try {
    // Check if id is a UUID or slug
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
    
    let product;
    if (isUUID) {
      product = await db.products.findById(id);
    } else {
      product = await db.products.findBySlug(id);
    }

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Update product
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isSupabaseAvailable) {
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 503 }
    );
  }

  const { id } = params;

  try {
    const updates = await request.json();
    
    // Remove id from updates to prevent overwriting
    delete updates.id;
    delete updates.created_at;
    
    // Ensure numeric fields are properly typed
    if (updates.price) {
      updates.price = parseFloat(updates.price);
    }
    if (updates.compare_price) {
      updates.compare_price = parseFloat(updates.compare_price);
    }
    if (updates.cost_price) {
      updates.cost_price = parseFloat(updates.cost_price);
    }
    if (updates.weight) {
      updates.weight = parseFloat(updates.weight);
    }

    const updatedProduct = await db.products.update(id, updates);
    
    // Update inventory if provided
    if (updates.inventory) {
      const existingInventory = await db.inventory.findByProductId(id);
      if (existingInventory) {
        await db.inventory.updateQuantity(id, updates.inventory.quantity || existingInventory.quantity);
      } else {
        await db.inventory.create({
          product_id: id,
          quantity: updates.inventory.quantity || 0,
          low_stock_threshold: updates.inventory.low_stock_threshold || 5,
          track_inventory: updates.inventory.track_inventory !== false
        });
      }
    }

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    
    // Handle unique constraint violations
    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Product with this slug or SKU already exists' },
          { status: 409 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Delete product
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isSupabaseAvailable) {
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 503 }
    );
  }

  const { id } = params;

  try {
    // Check if product exists
    const product = await db.products.findById(id);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Delete the product (cascade will handle related records)
    await db.products.delete(id);

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}