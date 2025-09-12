import { NextRequest, NextResponse } from 'next/server';
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/cloudinary';
import { db, isSupabaseAvailable, supabase } from '@/lib/supabase';

// POST /api/upload/images - Upload product images
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const productId = formData.get('product_id') as string;
    const altText = formData.get('alt_text') as string;
    const isPrimary = formData.get('is_primary') === 'true';
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const uploadOptions = {
      folder: 'jewelry-products',
      tags: ['product', 'jewelry'],
      transformation: [
        { quality: 'auto', fetch_format: 'auto' },
        { width: 1200, height: 1200, crop: 'limit' }
      ]
    };

    const result = await uploadToCloudinary(buffer, uploadOptions);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Upload failed' },
        { status: 500 }
      );
    }

    // Save image record to database if product ID provided and database available
    let imageRecord = null;
    if (productId && isSupabaseAvailable) {
      try {
        // If this is set as primary, unset other primary images for this product
        if (isPrimary && supabase) {
          await supabase
            .from('product_images')
            .update({ is_primary: false })
            .eq('product_id', productId);
        }

        // Get the next sort order
        const { data: existingImages } = supabase ? await supabase
          .from('product_images')
          .select('sort_order')
          .eq('product_id', productId)
          .order('sort_order', { ascending: false })
          .limit(1) : { data: null };

        const nextSortOrder = existingImages && existingImages.length > 0 
          ? existingImages[0].sort_order + 1 
          : 0;

        imageRecord = await db.productImages.create({
          product_id: productId,
          cloudinary_public_id: result.publicId!,
          url: result.url!,
          alt_text: altText || '',
          sort_order: nextSortOrder,
          is_primary: isPrimary
        });
      } catch (dbError) {
        console.error('Database error while saving image:', dbError);
        // Continue without failing the upload
      }
    }

    return NextResponse.json({
      success: true,
      publicId: result.publicId,
      url: result.url,
      width: result.width,
      height: result.height,
      format: result.format,
      imageRecord
    });
  } catch (error) {
    console.error('Image upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}

// DELETE /api/upload/images - Delete product image
export async function DELETE(request: NextRequest) {
  try {
    const { publicId, imageId } = await request.json();
    
    if (!publicId) {
      return NextResponse.json(
        { error: 'No public ID provided' },
        { status: 400 }
      );
    }

    // Delete from Cloudinary
    const cloudinaryResult = await deleteFromCloudinary(publicId);

    // Delete from database if image ID provided and database available
    if (imageId && isSupabaseAvailable) {
      try {
        await db.productImages.delete(imageId);
      } catch (dbError) {
        console.error('Database error while deleting image:', dbError);
        // Continue without failing the deletion
      }
    }

    return NextResponse.json({
      success: cloudinaryResult.success,
      result: cloudinaryResult.result,
    });
  } catch (error) {
    console.error('Image delete error:', error);
    return NextResponse.json(
      { error: 'Delete failed' },
      { status: 500 }
    );
  }
}