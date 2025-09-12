import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Test the complete flow by creating a sample product and checking if it appears in categories
    
    // 1. Create a test product
    const testProduct = {
      name: 'Test Diamond Ring',
      description: 'A beautiful test diamond ring for testing the flow',
      short_description: 'Test diamond ring',
      price: 2999,
      compare_price: 3999,
      category_id: '6', // Rings category
      tags: ['diamond', 'ring', 'test'],
      status: 'active',
      featured: true,
      inventory: {
        quantity: 10,
        low_stock_threshold: 5,
        track_inventory: true
      }
    }

    const createResponse = await fetch(`${request.nextUrl.origin}/api/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testProduct),
    })

    if (!createResponse.ok) {
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to create test product',
        details: await createResponse.text()
      })
    }

    const createdProduct = await createResponse.json()

    // 2. Check if the product appears in the rings category
    const categoryResponse = await fetch(`${request.nextUrl.origin}/api/products?category=6&status=active`)
    
    if (!categoryResponse.ok) {
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to fetch category products',
        productCreated: createdProduct
      })
    }

    const categoryProducts = await categoryResponse.json()
    const productInCategory = categoryProducts.find((p: any) => p.id === createdProduct.id)

    // 3. Check if the product appears in featured products
    const featuredResponse = await fetch(`${request.nextUrl.origin}/api/products?featured=true`)
    const featuredProducts = await featuredResponse.json()
    const productInFeatured = featuredProducts.find((p: any) => p.id === createdProduct.id)

    return NextResponse.json({
      success: true,
      message: 'Backend flow test completed successfully',
      results: {
        productCreated: !!createdProduct.id,
        productInCategory: !!productInCategory,
        productInFeatured: !!productInFeatured,
        categoryProductsCount: categoryProducts.length,
        featuredProductsCount: featuredProducts.length
      },
      createdProduct,
      testNote: 'You can delete this test product from the admin panel'
    })

  } catch (error) {
    console.error('Test flow error:', error)
    return NextResponse.json({
      success: false,
      error: 'Test flow failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}