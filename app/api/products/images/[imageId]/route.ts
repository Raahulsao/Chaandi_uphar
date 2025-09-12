import { NextRequest, NextResponse } from 'next/server';
import { db, isSupabaseAvailable, supabase } from '@/lib/supabase';

// GET /api/products/images/[imageId] - Get specific image
export async function GET(
  request: NextRequest,
  { params }: { params: { imageId: string } }
) {
  if (!isSupabaseAvailable) {
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 503 }
    );
  }

  try {
    const { data, error } = await supabase!
      .from('product_images')
      .select('*')
      .eq('id', params.imageId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Image not found' },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching image:', error);
    return NextResponse.json(
      { error: 'Failed to fetch image' },
      { status: 500 }
    );
  }
}

// PUT /api/products/images/[imageId] - Update specific image
export async function PUT(
  request: NextRequest,
  { params }: { params: { imageId: string } }
) {
  if (!isSupabaseAvailable) {
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 503 }
    );
  }

  try {
    const updates = await request.json();
    
    // Get current image to check product_id
    const { data: currentImage, error: fetchError } = await supabase!
      .from('product_images')
      .select('product_id')
      .eq('id', params.imageId)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Image not found' },
          { status: 404 }
        );
      }
      throw fetchError;
    }

    // If setting as primary, unset other primary images for this product
    if (updates.is_primary) {
      await supabase!
        .from('product_images')
        .update({ is_primary: false })
        .eq('product_id', currentImage.product_id)
        .neq('id', params.imageId);
    }

    const { data, error } = await supabase!
      .from('product_images')
      .update({
        alt_text: updates.alt_text,
        sort_order: updates.sort_order,
        is_primary: updates.is_primary
      })
      .eq('id', params.imageId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating image:', error);
    return NextResponse.json(
      { error: 'Failed to update image' },
      { status: 500 }
    );
  }
}

// DELETE /api/products/images/[imageId] - Delete specific image
export async function DELETE(
  request: NextRequest,
  { params }: { params: { imageId: string } }
) {
  if (!isSupabaseAvailable) {
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 503 }
    );
  }

  try {
    const { error } = await supabase!
      .from('product_images')
      .delete()
      .eq('id', params.imageId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}