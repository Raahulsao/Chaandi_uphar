# 🚀 Supabase Database Setup - Step by Step

## ⚠️ Error Fix for Referral System

You got this error because the migration file expects a migration tracking system. Here's the **corrected SQL** to run instead.

## 📋 **Step-by-Step Setup**

### **Step 1: Run Main Database Setup**
Create a new SQL query in Supabase and paste this:

```sql
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

-- Users table
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

-- Orders table
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

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id VARCHAR(100) NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  product_image TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  price DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Referrals table
CREATE TABLE IF NOT EXISTS referrals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  referrer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  referred_id UUID REFERENCES users(id) ON DELETE CASCADE,
  referral_code VARCHAR(20) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  reward_amount DECIMAL(10,2) DEFAULT 0,
  reward_given BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Referral rewards table
CREATE TABLE IF NOT EXISTS referral_rewards (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  referral_id UUID REFERENCES referrals(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('signup_bonus', 'referral_bonus', 'order_discount')),
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  used BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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
  ('550e8400-e29b-41d4-a716-446655440009', 'Gifts', 'gifts', 'Perfect gift items', 9, 'active'),
  ('550e8400-e29b-41d4-a716-446655440010', 'Anklets', 'anklets', 'Beautiful anklets and ankle jewelry', 10, 'active'),
  ('550e8400-e29b-41d4-a716-446655440011', 'Ladoo Gopal Shringaar', 'ladoo-gopal-shringaar', 'Traditional Ladoo Gopal decoration items', 11, 'active')
ON CONFLICT (id) DO NOTHING;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_status ON categories(status);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_product_id ON inventory(product_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_referral_code ON users(referral_code);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_id ON referrals(referred_id);
CREATE INDEX IF NOT EXISTS idx_referral_rewards_user_id ON referral_rewards(user_id);

-- Enable RLS (Row Level Security)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_rewards ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Anyone can view active categories" ON categories FOR SELECT USING (status = 'active');
CREATE POLICY "Anyone can view active products" ON products FOR SELECT USING (status = 'active');
CREATE POLICY "Anyone can view product images" ON product_images FOR SELECT USING (true);
CREATE POLICY "Anyone can view inventory" ON inventory FOR SELECT USING (true);

-- Grant permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

SELECT 'Database setup completed successfully!' as message;
```

### **Step 2: Run Enhanced Referral Features (Optional)**
Create another SQL query and paste this:

```sql
-- Add referral analytics table
CREATE TABLE IF NOT EXISTS referral_analytics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  referral_code VARCHAR(20) NOT NULL,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  conversion_rate DECIMAL(5,2) DEFAULT 0,
  total_earnings DECIMAL(10,2) DEFAULT 0,
  last_click_at TIMESTAMP WITH TIME ZONE,
  last_conversion_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add referral campaign tracking
CREATE TABLE IF NOT EXISTS referral_campaigns (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  reward_amount DECIMAL(10,2) NOT NULL,
  bonus_multiplier DECIMAL(3,2) DEFAULT 1.0,
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add social sharing tracking
CREATE TABLE IF NOT EXISTS referral_shares (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  referral_code VARCHAR(20) NOT NULL,
  platform VARCHAR(50) NOT NULL,
  shared_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  clicked BOOLEAN DEFAULT FALSE,
  converted BOOLEAN DEFAULT FALSE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_referral_analytics_user_id ON referral_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_referral_analytics_referral_code ON referral_analytics(referral_code);
CREATE INDEX IF NOT EXISTS idx_referral_campaigns_active ON referral_campaigns(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_referral_shares_user_id ON referral_shares(user_id);

-- Enable RLS
ALTER TABLE referral_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_shares ENABLE ROW LEVEL SECURITY;

-- Insert default campaign
INSERT INTO referral_campaigns (name, description, reward_amount, bonus_multiplier, is_active) VALUES 
  ('Launch Campaign', 'Default referral campaign for app launch', 500.00, 1.0, TRUE)
ON CONFLICT DO NOTHING;

-- Grant permissions
GRANT ALL ON referral_analytics TO anon, authenticated, service_role;
GRANT ALL ON referral_campaigns TO anon, authenticated, service_role;
GRANT ALL ON referral_shares TO anon, authenticated, service_role;

SELECT 'Enhanced referral features added successfully!' as message;
```

## ✅ **That's It!**

After running these two SQL queries:

1. ✅ All tables will be created
2. ✅ Categories (including Anklets & Ladoo Gopal Shringaar) will be added
3. ✅ Referral system will be fully functional
4. ✅ No more migration errors

## 🔍 **Verify Setup**

Check your Supabase **Table Editor** - you should see:
- `categories` (11 categories including new ones)
- `products`
- `inventory`
- `users`
- `referrals`
- `referral_rewards`
- `referral_analytics`
- `referral_campaigns`

**The error is now fixed!** 🎉