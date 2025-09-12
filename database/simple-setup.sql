-- Simple Database Setup for Luxury Jewelry App
-- This script is safe to run multiple times

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES categories(id),
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  short_description VARCHAR(500),
  price DECIMAL(10,2) NOT NULL,
  compare_price DECIMAL(10,2),
  cost_price DECIMAL(10,2),
  sku VARCHAR(100) UNIQUE,
  category_id UUID REFERENCES categories(id),
  tags TEXT[],
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
  featured BOOLEAN DEFAULT FALSE,
  weight DECIMAL(8,2),
  dimensions JSONB,
  seo_title VARCHAR(255),
  seo_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product images table
CREATE TABLE IF NOT EXISTS product_images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  cloudinary_public_id VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  alt_text VARCHAR(255),
  sort_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inventory table
CREATE TABLE IF NOT EXISTS inventory (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 0,
  reserved_quantity INTEGER DEFAULT 0,
  low_stock_threshold INTEGER DEFAULT 5,
  track_inventory BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inventory adjustments table
CREATE TABLE IF NOT EXISTS inventory_adjustments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  inventory_id UUID REFERENCES inventory(id) ON DELETE CASCADE,
  adjustment_type VARCHAR(50) NOT NULL,
  quantity_change INTEGER NOT NULL,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_status ON categories(status);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_product_id ON inventory(product_id);

-- Insert default categories (safe to run multiple times)
INSERT INTO categories (id, name, slug, description, sort_order, status) VALUES 
  ('550e8400-e29b-41d4-a716-446655440001', 'Jewellery', 'jewellery', 'Beautiful jewelry collection', 1, 'active'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Silver', 'silver', 'Premium silver jewelry', 2, 'active'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Chains', 'chains', 'Elegant chains and necklaces', 3, 'active'),
  ('550e8400-e29b-41d4-a716-446655440004', 'Pendants', 'pendants', 'Beautiful pendants', 4, 'active'),
  ('550e8400-e29b-41d4-a716-446655440005', 'Earrings', 'earrings', 'Stunning earrings', 5, 'active'),
  ('550e8400-e29b-41d4-a716-446655440006', 'Rings', 'rings', 'Exquisite rings', 6, 'active'),
  ('550e8400-e29b-41d4-a716-446655440007', 'Bracelet', 'bracelet', 'Stylish bracelets', 7, 'active'),
  ('550e8400-e29b-41d4-a716-446655440008', 'Couple Goals', 'couple-goals', 'Perfect for couples', 8, 'active'),
  ('550e8400-e29b-41d4-a716-446655440009', 'Gifts', 'gifts', 'Perfect gift items', 9, 'active')
ON CONFLICT (id) DO NOTHING;

-- Disable RLS for now to make it work immediately
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE product_images DISABLE ROW LEVEL SECURITY;
ALTER TABLE inventory DISABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_adjustments DISABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

-- Success message
SELECT 'Database setup completed successfully! You can now create products.' as message;
SELECT COUNT(*) as categories_created FROM categories;
SELECT 'Tables created: categories, products, product_images, inventory, inventory_adjustments' as tables_info;