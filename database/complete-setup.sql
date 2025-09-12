-- Complete Database Setup for Luxury Jewelry App
-- Copy and paste this entire script into your Supabase SQL Editor and run it

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

-- Inventory adjustments table (for tracking changes)
CREATE TABLE IF NOT EXISTS inventory_adjustments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  inventory_id UUID REFERENCES inventory(id) ON DELETE CASCADE,
  adjustment_type VARCHAR(50) NOT NULL,
  quantity_change INTEGER NOT NULL,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table (for future user management)
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  mobile_number VARCHAR(20),
  referral_code VARCHAR(20) UNIQUE NOT NULL,
  referred_by VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table (for future order management)
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  total_amount DECIMAL(10,2) NOT NULL,
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_method VARCHAR(50),
  shipping_address JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_status ON categories(status);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_is_primary ON product_images(is_primary);
CREATE INDEX IF NOT EXISTS idx_inventory_product_id ON inventory(product_id);

-- Functions for auto-updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for auto-updating timestamps (with IF NOT EXISTS equivalent)
DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_inventory_updated_at ON inventory;
CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON inventory
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Public read access for categories
CREATE POLICY "Anyone can view active categories" ON categories
  FOR SELECT USING (status = 'active');

-- Public read access for products
CREATE POLICY "Anyone can view active products" ON products
  FOR SELECT USING (status = 'active');

-- Public read access for product images
CREATE POLICY "Anyone can view product images" ON product_images
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM products 
      WHERE products.id = product_images.product_id 
      AND products.status = 'active'
    )
  );

-- Public read access for inventory
CREATE POLICY "Anyone can view inventory" ON inventory
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM products 
      WHERE products.id = inventory.product_id 
      AND products.status = 'active'
    )
  );

-- Admin policies (allow all operations for service role)
CREATE POLICY "Service role can manage categories" ON categories
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage products" ON products
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage product images" ON product_images
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage inventory" ON inventory
  FOR ALL USING (auth.role() = 'service_role');

-- Insert default categories
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

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

-- Success message
SELECT 'Database setup completed successfully! You can now create products.' as message;