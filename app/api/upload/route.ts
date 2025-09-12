import { NextRequest, NextResponse } from 'next/server';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Get upload options
    const folder = formData.get('folder') as string || 'jewelry-app';
    const tags = formData.get('tags') as string;
    const publicId = formData.get('public_id') as string;

    const uploadOptions = {
      folder,
      public_id: publicId,
      tags: tags ? tags.split(',') : ['jewelry', 'product'],
    };

    // Upload to Cloudinary
    const result = await uploadToCloudinary(buffer, uploadOptions);

    if (result.success) {
      return NextResponse.json({
        success: true,
        publicId: result.publicId,
        url: result.url,
        width: result.width,
        height: result.height,
        format: result.format,
      });
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { publicId } = await request.json();
    
    if (!publicId) {
      return NextResponse.json(
        { error: 'No public ID provided' },
        { status: 400 }
      );
    }

    const { deleteFromCloudinary } = await import('@/lib/cloudinary');
    const result = await deleteFromCloudinary(publicId);

    return NextResponse.json({
      success: result.success,
      result: result.result,
    });
  } catch (error) {
    console.error('Delete API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}