import { NextRequest, NextResponse } from 'next/server';
import { db, isSupabaseAvailable, generateSlug, generateSKU, supabase } from '@/lib/supabase';

// GET /api/products - List products with pagination and filters
export async function GET(request: NextRequest) {
  if (!isSupabaseAvailable) {
    // Return empty array when database is not configured
    console.log('Supabase not available, returning empty products array')
    return NextResponse.json([]);
  }

  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const status = searchParams.get('status');
  const featured = searchParams.get('featured');
  const search = searchParams.get('search');
  const slug = searchParams.get('slug');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '12');
  const offset = (page - 1) * limit;

  try {
    const params = {
      category: category || undefined,
      status: status || undefined,
      featured: featured === 'true' ? true : featured === 'false' ? false : undefined,
      search: search || undefined,
      slug: slug || undefined,
      limit,
      offset
    };

    const products = await db.products.findAll(params);

    // Get total count for pagination
    if (!supabase) {
      return NextResponse.json(products || []);
    }

    let totalQuery = supabase
      .from('products')
      .select('id', { count: 'exact', head: true });

    if (params.category) {
      totalQuery = totalQuery.eq('category_id', params.category);
    }
    if (params.status) {
      totalQuery = totalQuery.eq('status', params.status);
    } else {
      totalQuery = totalQuery.eq('status', 'active');
    }
    if (params.featured !== undefined) {
      totalQuery = totalQuery.eq('featured', params.featured);
    }
    if (params.search) {
      totalQuery = totalQuery.or(`name.ilike.%${params.search}%,description.ilike.%${params.search}%`);
    }

    const { count } = await totalQuery;
    const total = count || 0;
    const totalPages = Math.ceil(total / limit);

    // Return products array directly for compatibility with existing frontend
    return NextResponse.json(products || []);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST /api/products - Create new product
export async function POST(request: NextRequest) {
  if (!isSupabaseAvailable) {
    // For demo purposes, return a mock success response when database is not configured
    const productData = await request.json();
    const mockProduct = {
      id: `mock-${Date.now()}`,
      ...productData,
      slug: productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log('Database not configured, returning mock product:', mockProduct.name);
    return NextResponse.json(mockProduct, { status: 201 });
  }

  try {
    const productData = await request.json();

    // Validate required fields
    if (!productData.name || !productData.price) {
      return NextResponse.json(
        { error: 'Name and price are required' },
        { status: 400 }
      );
    }

    // Generate slug if not provided
    if (!productData.slug) {
      productData.slug = generateSlug(productData.name);
    }

    // Generate SKU if not provided
    if (!productData.sku) {
      productData.sku = generateSKU(productData.category?.name, productData.name);
    }

    // Ensure price is a number
    productData.price = parseFloat(productData.price);
    if (productData.compare_price) {
      productData.compare_price = parseFloat(productData.compare_price);
    }
    if (productData.cost_price) {
      productData.cost_price = parseFloat(productData.cost_price);
    }

    // Extract images and inventory data before creating product (they go in separate tables)
    const images = productData.images || [];
    const inventoryData = productData.inventory || {};
    delete productData.images; // Remove from product data
    delete productData.inventory; // Remove from product data

    // Create the product
    const newProduct = await db.products.create(productData);

    // Create product images if provided
    if (images && images.length > 0) {
      try {
        const imageInserts = images.map((image: any, index: number) => ({
          product_id: newProduct.id,
          cloudinary_public_id: image.cloudinary_public_id || image.public_id || '',
          url: image.url || image.secure_url || '',
          alt_text: image.alt_text || newProduct.name,
          sort_order: index,
          is_primary: index === 0,
          created_at: new Date().toISOString()
        }));

        if (supabase) {
          await supabase
            .from('product_images')
            .insert(imageInserts);
        }
      } catch (imageError) {
        console.error('Failed to create product images:', imageError);
        // Don't fail product creation if image creation fails
      }
    }

    // Always create inventory record for new products
    if (supabase) {
      try {
        await supabase
          .from('inventory')
          .insert({
            product_id: newProduct.id,
            quantity: inventoryData.quantity || 0,
            reserved_quantity: 0,
            low_stock_threshold: inventoryData.low_stock_threshold || 10,
            track_inventory: inventoryData.track_inventory !== false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
      } catch (inventoryError) {
        console.error('Failed to create inventory record:', inventoryError);
        // Don't fail product creation if inventory creation fails
      }
    }

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);

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
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}