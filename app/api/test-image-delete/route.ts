import { NextRequest, NextResponse } from 'next/server';

// Simple test endpoint to verify image deletion API works
export async function GET(request: NextRequest) {
  try {
    // Test the image deletion endpoint
    const testImageId = 'test-image-id';
    
    const response = await fetch(`${request.nextUrl.origin}/api/products/images/${testImageId}`, {
      method: 'DELETE'
    });
    
    return NextResponse.json({
      message: 'Image deletion API test',
      status: response.status,
      available: response.status !== 404 // 404 is expected for non-existent image
    });
  } catch (error) {
    return NextResponse.json({
      message: 'Image deletion API test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}