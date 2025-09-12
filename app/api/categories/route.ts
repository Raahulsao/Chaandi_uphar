import { NextRequest, NextResponse } from 'next/server';
import { db, isSupabaseAvailable, generateSlug } from '@/lib/supabase';

// GET /api/categories - List all categories
export async function GET(request: NextRequest) {
  if (!isSupabaseAvailable) {
    // Return default categories when database is not configured
    return NextResponse.json([
      { id: '550e8400-e29b-41d4-a716-446655440001', name: 'Jewellery', slug: 'jewellery', status: 'active', sort_order: 1 },
      { id: '550e8400-e29b-41d4-a716-446655440002', name: 'Silver', slug: 'silver', status: 'active', sort_order: 2 },
      { id: '550e8400-e29b-41d4-a716-446655440003', name: 'Chains', slug: 'chains', status: 'active', sort_order: 3 },
      { id: '550e8400-e29b-41d4-a716-446655440004', name: 'Pendants', slug: 'pendants', status: 'active', sort_order: 4 },
      { id: '550e8400-e29b-41d4-a716-446655440005', name: 'Earrings', slug: 'earrings', status: 'active', sort_order: 5 },
      { id: '550e8400-e29b-41d4-a716-446655440006', name: 'Rings', slug: 'rings', status: 'active', sort_order: 6 },
      { id: '550e8400-e29b-41d4-a716-446655440007', name: 'Bracelet', slug: 'bracelet', status: 'active', sort_order: 7 },
      { id: '550e8400-e29b-41d4-a716-446655440008', name: 'Couple Goals', slug: 'couple-goals', status: 'active', sort_order: 8 },
      { id: '550e8400-e29b-41d4-a716-446655440009', name: 'Gifts', slug: 'gifts', status: 'active', sort_order: 9 }
    ]);
  }

  const { searchParams } = new URL(request.url);
  const includeInactive = searchParams.get('include_inactive') === 'true';

  try {
    let categories = await db.categories.findAll();
    
    // Filter out inactive categories unless specifically requested
    if (!includeInactive) {
      categories = categories?.filter(cat => cat.status === 'active') || [];
    }

    // Build hierarchical structure
    const categoryMap = new Map();
    const rootCategories: any[] = [];

    // First pass: create map of all categories
    categories?.forEach(category => {
      categoryMap.set(category.id, { ...category, children: [] });
    });

    // Second pass: build hierarchy
    categories?.forEach(category => {
      const categoryWithChildren = categoryMap.get(category.id);
      if (category.parent_id) {
        const parent = categoryMap.get(category.parent_id);
        if (parent) {
          parent.children.push(categoryWithChildren);
        }
      } else {
        rootCategories.push(categoryWithChildren);
      }
    });

    return NextResponse.json(rootCategories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST /api/categories - Create new category
export async function POST(request: NextRequest) {
  if (!isSupabaseAvailable) {
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 503 }
    );
  }

  try {
    const categoryData = await request.json();
    
    // Validate required fields
    if (!categoryData.name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    // Generate slug if not provided
    if (!categoryData.slug) {
      categoryData.slug = generateSlug(categoryData.name);
    }

    // Set default sort order if not provided
    if (categoryData.sort_order === undefined) {
      categoryData.sort_order = 0;
    }

    const newCategory = await db.categories.create(categoryData);
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    
    // Handle unique constraint violations
    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Category with this slug already exists' },
          { status: 409 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}