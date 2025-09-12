import { NextRequest, NextResponse } from 'next/server';
import { db, isSupabaseAvailable, supabase } from '@/lib/supabase';

// GET /api/products/[id] - Get single product details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isSupabaseAvailable) {
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 503 }
    );
  }

  const { id } = await params;

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
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isSupabaseAvailable) {
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 503 }
    );
  }

  const { id } = await params;

  try {
    const updates = await request.json();
    
    // Remove id from updates to prevent overwriting
    delete updates.id;
    delete updates.created_at;
    
    // Extract images and inventory data before updating product (they go in separate tables)
    const images = updates.images || [];
    const inventoryData = updates.inventory || {};
    delete updates.images; // Remove from product data
    delete updates.inventory; // Remove from product data
    
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
    
    // Handle images if provided
    if (images && images.length > 0 && supabase) {
      try {
        // Get existing images to determine what's new
        const { data: existingImages } = await supabase
          .from('product_images')
          .select('id, cloudinary_public_id')
          .eq('product_id', id);
        
        const existingImageIds = new Set(existingImages?.map(img => img.id) || []);
        
        // Filter out images that already exist (have a real database ID)
        const newImages = images.filter((image: any) => 
          !image.id || !existingImageIds.has(image.id) || image.id.startsWith('temp-')
        );

        if (newImages.length > 0) {
          const imageInserts = newImages.map((image: any, index: number) => ({
            product_id: id,
            cloudinary_public_id: image.cloudinary_public_id || image.public_id || '',
            url: image.url || image.secure_url || '',
            alt_text: image.alt_text || updatedProduct.name,
            sort_order: (existingImages?.length || 0) + index,
            is_primary: (existingImages?.length || 0) === 0 && index === 0,
            created_at: new Date().toISOString()
          }));

          await supabase
            .from('product_images')
            .insert(imageInserts);
        }
      } catch (imageError) {
        console.error('Failed to update product images:', imageError);
        // Don't fail product update if image update fails
      }
    }
    
    // Update inventory if provided
    if (inventoryData && Object.keys(inventoryData).length > 0) {
      try {
        const existingInventory = await db.inventory.findByProductId(id);
        if (existingInventory && supabase) {
          await supabase
            .from('inventory')
            .update({
              quantity: inventoryData.quantity !== undefined ? inventoryData.quantity : existingInventory.quantity,
              low_stock_threshold: inventoryData.low_stock_threshold !== undefined ? inventoryData.low_stock_threshold : existingInventory.low_stock_threshold,
              track_inventory: inventoryData.track_inventory !== undefined ? inventoryData.track_inventory : existingInventory.track_inventory,
              updated_at: new Date().toISOString()
            })
            .eq('product_id', id);
        } else if (supabase) {
          await supabase
            .from('inventory')
            .insert({
              product_id: id,
              quantity: inventoryData.quantity || 0,
              low_stock_threshold: inventoryData.low_stock_threshold || 5,
              track_inventory: inventoryData.track_inventory !== false,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
        }
      } catch (inventoryError) {
        console.error('Failed to update inventory:', inventoryError);
        // Don't fail product update if inventory update fails
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
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isSupabaseAvailable) {
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 503 }
    );
  }

  const { id } = await params;

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