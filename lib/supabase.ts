import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check if Supabase is properly configured
const isSupabaseConfigured = supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'your_supabase_project_url' && 
  supabaseAnonKey !== 'your_supabase_anon_key' &&
  supabaseUrl.startsWith('http');

// Create Supabase client only if properly configured
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

export const isSupabaseAvailable = !!supabase;

// Database Types
export interface User {
  id: string;
  email: string;
  name: string;
  mobile_number?: string;
  referral_code: string;
  referred_by?: string;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_method?: string;
  shipping_address: ShippingAddress;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  quantity: number;
  price: number;
  total: number;
}

export interface ShippingAddress {
  name: string;
  mobile: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface Referral {
  id: string;
  referrer_id: string;
  referred_id: string;
  referral_code: string;
  status: 'pending' | 'completed' | 'cancelled';
  reward_amount: number;
  reward_given: boolean;
  created_at: string;
  completed_at?: string;
}

export interface ReferralReward {
  id: string;
  user_id: string;
  referral_id: string;
  type: 'signup_bonus' | 'referral_bonus' | 'order_discount';
  amount: number;
  description: string;
  used: boolean;
  expires_at?: string;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parent_id?: string;
  parent?: Category;
  children?: Category[];
  image_url?: string;
  sort_order: number;
  status: 'active' | 'inactive';
  product_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  short_description?: string;
  price: number;
  compare_price?: number;
  cost_price?: number;
  sku?: string;
  category_id?: string;
  category?: Category;
  tags: string[];
  status: 'draft' | 'active' | 'archived';
  featured: boolean;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  seo_title?: string;
  seo_description?: string;
  images: ProductImage[];
  inventory?: Inventory;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  cloudinary_public_id: string;
  url: string;
  alt_text?: string;
  sort_order: number;
  is_primary: boolean;
  created_at: string;
}

export interface Inventory {
  id: string;
  product_id: string;
  quantity: number;
  reserved_quantity: number;
  low_stock_threshold: number;
  track_inventory: boolean;
  updated_at: string;
}

// Database helper functions
export const db = {
  // User operations
  users: {
    async create(userData: Partial<User>) {
      if (!supabase) throw new Error('Supabase not configured');
      
      const { data, error } = await supabase
        .from('users')
        .insert([userData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },

    async findByEmail(email: string) {
      if (!supabase) throw new Error('Supabase not configured');
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },

    async findByReferralCode(referralCode: string) {
      if (!supabase) throw new Error('Supabase not configured');
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('referral_code', referralCode)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },

    async update(id: string, updates: Partial<User>) {
      if (!supabase) throw new Error('Supabase not configured');
      
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  },

  // Order operations
  orders: {
    async create(orderData: Partial<Order>) {
      if (!supabase) throw new Error('Supabase not configured');
      
      const { data, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },

    async findByUserId(userId: string) {
      if (!supabase) throw new Error('Supabase not configured');
      
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },

    async findById(orderId: string) {
      if (!supabase) throw new Error('Supabase not configured');
      
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*),
          user:users(name, email, mobile_number)
        `)
        .eq('id', orderId)
        .single();
      
      if (error) throw error;
      return data;
    },

    async updateStatus(orderId: string, status: Order['status']) {
      if (!supabase) throw new Error('Supabase not configured');
      
      const { data, error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', orderId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  },

  // Order items operations
  orderItems: {
    async create(items: Partial<OrderItem>[]) {
      if (!supabase) throw new Error('Supabase not configured');
      
      const { data, error } = await supabase
        .from('order_items')
        .insert(items)
        .select();
      
      if (error) throw error;
      return data;
    }
  },

  // Referral operations
  referrals: {
    async create(referralData: Partial<Referral>) {
      if (!supabase) throw new Error('Supabase not configured');
      
      const { data, error } = await supabase
        .from('referrals')
        .insert([referralData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },

    async findByUserId(userId: string) {
      if (!supabase) throw new Error('Supabase not configured');
      
      const { data, error } = await supabase
        .from('referrals')
        .select(`
          *,
          referrer:referrer_id(name, email),
          referred:referred_id(name, email)
        `)
        .or(`referrer_id.eq.${userId},referred_id.eq.${userId}`)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },

    async complete(referralId: string) {
      if (!supabase) throw new Error('Supabase not configured');
      
      const { data, error } = await supabase
        .from('referrals')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', referralId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  },

  // Referral rewards operations
  rewards: {
    async create(rewardData: Partial<ReferralReward>) {
      if (!supabase) throw new Error('Supabase not configured');
      
      const { data, error } = await supabase
        .from('referral_rewards')
        .insert([rewardData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },

    async findByUserId(userId: string) {
      if (!supabase) throw new Error('Supabase not configured');
      
      const { data, error } = await supabase
        .from('referral_rewards')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },

    async markAsUsed(rewardId: string) {
      if (!supabase) throw new Error('Supabase not configured');
      
      const { data, error } = await supabase
        .from('referral_rewards')
        .update({ used: true })
        .eq('id', rewardId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  },

  // Category operations
  categories: {
    async create(categoryData: Partial<Category>) {
      if (!supabase) throw new Error('Supabase not configured');
      
      const { data, error } = await supabase
        .from('categories')
        .insert([categoryData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },

    async findAll() {
      if (!supabase) throw new Error('Supabase not configured');
      
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('status', 'active')
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      return data;
    },

    async findBySlug(slug: string) {
      if (!supabase) throw new Error('Supabase not configured');
      
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'active')
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },

    async update(id: string, updates: Partial<Category>) {
      if (!supabase) throw new Error('Supabase not configured');
      
      const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },

    async delete(id: string) {
      if (!supabase) throw new Error('Supabase not configured');
      
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    }
  },

  // Product operations
  products: {
    async create(productData: Partial<Product>) {
      if (!supabase) throw new Error('Supabase not configured');
      
      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select(`
          *,
          category:categories(*),
          images:product_images(*),
          inventory:inventory(*)
        `)
        .single();
      
      if (error) throw error;
      return data;
    },

    async findAll(params?: {
      category?: string;
      status?: string;
      featured?: boolean;
      limit?: number;
      offset?: number;
      search?: string;
      slug?: string;
    }) {
      if (!supabase) throw new Error('Supabase not configured');
      
      let query = supabase
        .from('products')
        .select(`
          *,
          category:categories(*),
          images:product_images(*),
          inventory:inventory(*)
        `);

      if (params?.category) {
        query = query.eq('category_id', params.category);
      }
      
      if (params?.status) {
        query = query.eq('status', params.status);
      } else {
        query = query.eq('status', 'active');
      }
      
      if (params?.featured !== undefined) {
        query = query.eq('featured', params.featured);
      }
      
      if (params?.search) {
        query = query.or(`name.ilike.%${params.search}%,description.ilike.%${params.search}%`);
      }
      
      if (params?.slug) {
        query = query.eq('slug', params.slug);
      }
      
      query = query.order('created_at', { ascending: false });
      
      if (params?.limit) {
        query = query.limit(params.limit);
      }
      
      if (params?.offset) {
        query = query.range(params.offset, params.offset + (params.limit || 10) - 1);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    },

    async findBySlug(slug: string) {
      if (!supabase) throw new Error('Supabase not configured');
      
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(*),
          images:product_images(*),
          inventory:inventory(*)
        `)
        .eq('slug', slug)
        .eq('status', 'active')
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },

    async findById(id: string) {
      if (!supabase) throw new Error('Supabase not configured');
      
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(*),
          images:product_images(*),
          inventory:inventory(*)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },

    async update(id: string, updates: Partial<Product>) {
      if (!supabase) throw new Error('Supabase not configured');
      
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          category:categories(*),
          images:product_images(*),
          inventory:inventory(*)
        `)
        .single();
      
      if (error) throw error;
      return data;
    },

    async delete(id: string) {
      if (!supabase) throw new Error('Supabase not configured');
      
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    }
  },

  // Product images operations
  productImages: {
    async create(imageData: Partial<ProductImage>) {
      if (!supabase) throw new Error('Supabase not configured');
      
      const { data, error } = await supabase
        .from('product_images')
        .insert([imageData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },

    async findByProductId(productId: string) {
      if (!supabase) throw new Error('Supabase not configured');
      
      const { data, error } = await supabase
        .from('product_images')
        .select('*')
        .eq('product_id', productId)
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      return data;
    },

    async delete(id: string) {
      if (!supabase) throw new Error('Supabase not configured');
      
      const { error } = await supabase
        .from('product_images')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    }
  },

  // Inventory operations
  inventory: {
    async create(inventoryData: Partial<Inventory>) {
      if (!supabase) throw new Error('Supabase not configured');
      
      const { data, error } = await supabase
        .from('inventory')
        .insert([inventoryData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },

    async updateQuantity(productId: string, quantity: number) {
      if (!supabase) throw new Error('Supabase not configured');
      
      const { data, error } = await supabase
        .from('inventory')
        .update({ quantity })
        .eq('product_id', productId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },

    async findByProductId(productId: string) {
      if (!supabase) throw new Error('Supabase not configured');
      
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .eq('product_id', productId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    }
  }
};

// Utility functions
export const generateReferralCode = (name: string, email?: string): string => {
  const cleanName = name.replace(/[^a-zA-Z]/g, '').toUpperCase();
  // Create deterministic number based on name and email
  const seed = (email || name).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const deterministicNum = (seed * 37) % 10000; // Use modulo to keep it 4 digits
  return `${cleanName.slice(0, 4)}${deterministicNum.toString().padStart(4, '0')}`;
};

export const generateOrderNumber = (): string => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 999).toString().padStart(3, '0');
  return `ORD${timestamp}${random}`;
};

export const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

export const generateSKU = (categoryName?: string, productName?: string): string => {
  const category = categoryName ? categoryName.substring(0, 3).toUpperCase() : 'PRD';
  const timestamp = Date.now().toString().slice(-4);
  const random = Math.floor(Math.random() * 99).toString().padStart(2, '0');
  return `${category}${timestamp}${random}`;
};