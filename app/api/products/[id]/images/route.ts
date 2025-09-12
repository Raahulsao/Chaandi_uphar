import { NextRequest, NextResponse } from 'next/server';
import { db, isSupabaseAvailable, supabase } from '@/lib/supabase';

// GET /api/products/[id]/images - Get all images for a product
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isSupabaseAvailable) {
    return NextResponse.json([]);
  }

  const { id } = params;

  try {
    const images = await db.productImages.findByProductId(id);
    return NextResponse.json(images || []);
  } catch (error) {
    console.error('Error fetching product images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product images' },
      { status: 500 }
    );
  }
}

// POST /api/products/[id]/images - Add image to product
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isSupabaseAvailable) {
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 503 }
    );
  }

  const { id: productId } = params;

  try {
    const imageData = await request.json();
    
    // Validate required fields
    if (!imageData.cloudinary_public_id || !imageData.url) {
      return NextResponse.json(
        { error: 'Cloudinary public ID and URL are required' },
        { status: 400 }
      );
    }

    // If this is set as primary, unset other primary images for this product
    if (imageData.is_primary) {
      await supabase!
        .from('product_images')
        .update({ is_primary: false })
        .eq('product_id', productId);
    }

    // Get the next sort order
    const { data: existingImages } = await supabase!
      .from('product_images')
      .select('sort_order')
      .eq('product_id', productId)
      .order('sort_order', { ascending: false })
      .limit(1);

    const nextSortOrder = existingImages && existingImages.length > 0 
      ? existingImages[0].sort_order + 1 
      : 0;

    const newImage = await db.productImages.create({
      product_id: productId,
      cloudinary_public_id: imageData.cloudinary_public_id,
      url: imageData.url,
      alt_text: imageData.alt_text || '',
      sort_order: imageData.sort_order !== undefined ? imageData.sort_order : nextSortOrder,
      is_primary: imageData.is_primary || false
    });

    return NextResponse.json(newImage, { status: 201 });
  } catch (error) {
    console.error('Error adding product image:', error);
    return NextResponse.json(
      { error: 'Failed to add product image' },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id]/images - Update image order or properties
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

  const { id: productId } = params;

  try {
    const { images } = await request.json();
    
    if (!Array.isArray(images)) {
      return NextResponse.json(
        { error: 'Images array is required' },
        { status: 400 }
      );
    }

    // Update each image
    const updatePromises = images.map(async (image: any) => {
      if (!image.id) return null;
      
      // If this image is being set as primary, unset others first
      if (image.is_primary) {
        await supabase!
          .from('product_images')
          .update({ is_primary: false })
          .eq('product_id', productId)
          .neq('id', image.id);
      }
      
      const { data, error } = await supabase!
        .from('product_images')
        .update({
          alt_text: image.alt_text,
          sort_order: image.sort_order,
          is_primary: image.is_primary
        })
        .eq('id', image.id)
        .eq('product_id', productId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    });

    const updatedImages = await Promise.all(updatePromises);
    return NextResponse.json(updatedImages.filter(Boolean));
  } catch (error) {
    console.error('Error updating product images:', error);
    return NextResponse.json(
      { error: 'Failed to update product images' },
      { status: 500 }
    );
  }
}