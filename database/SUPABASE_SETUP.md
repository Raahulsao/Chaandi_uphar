# Supabase Database Setup Guide

This guide will help you set up the Supabase database for the Luxury Jewelry App with all necessary tables, policies, and configurations.

## Prerequisites

1. **Supabase Account**: Create a free account at [supabase.com](https://supabase.com)
2. **Project Creation**: Create a new Supabase project
3. **Environment Variables**: Have your project URL and anon key ready

## Step 1: Create Supabase Project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Choose your organization
4. Fill in project details:
   - **Name**: `luxury-jewelry-app`
   - **Database Password**: Choose a strong password (save it securely)
   - **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait for the project to be ready (2-3 minutes)

## Step 2: Configure Environment Variables

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL**
   - **anon/public key**

3. Update your `.env.local` file:
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 3: Run Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy the entire content of `database/schema.sql`
4. Paste it into the SQL editor
5. Click **Run** to execute the schema

This will create:
- ✅ **users** table with referral system
- ✅ **orders** table with order management
- ✅ **order_items** table for order details
- ✅ **referrals** table for tracking referrals
- ✅ **referral_rewards** table for bonuses and discounts
- ✅ **Indexes** for optimal performance
- ✅ **Row Level Security** policies
- ✅ **Triggers** for automatic timestamp updates

## Step 4: Enable Authentication

1. Go to **Authentication** → **Settings**
2. Configure the following:

### Email Settings
- **Enable email confirmations**: `true`
- **Email confirmation redirect URL**: `http://localhost:3000/auth/callback`

### Provider Settings
- **Enable email/password**: `true`
- **Enable Google** (optional): Configure OAuth if needed
- **Enable Facebook** (optional): Configure OAuth if needed

### Security Settings
- **JWT expiry**: `3600` (1 hour)
- **Refresh token expiry**: `2592000` (30 days)

## Step 5: Configure Storage (Optional)

If you plan to store product images in Supabase:

1. Go to **Storage**
2. Create a new bucket: `product-images`
3. Set bucket to **Public** if images should be publicly accessible
4. Configure upload policies as needed

## Step 6: Test Database Connection

1. Start your Next.js development server:
```bash
npm run dev
```

2. Navigate to `/account` page
3. Check browser console for any database connection errors
4. Verify that referral codes are being generated properly

## Step 7: Verify Database Tables

Run these queries in the SQL Editor to verify setup:

```sql
-- Check users table
SELECT COUNT(*) as user_count FROM users;

-- Check referrals table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'referrals';

-- Check all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE';
```

## Database Schema Overview

### Tables Structure

#### users
- `id` (UUID, Primary Key)
- `email` (Unique, Not Null)
- `name` (Not Null)
- `mobile_number` (Optional)
- `referral_code` (Unique, Not Null)
- `referred_by` (Optional referral code)
- `created_at`, `updated_at`

#### orders
- `id` (UUID, Primary Key)
- `user_id` (Foreign Key → users)
- `order_number` (Unique)
- `status` (pending/confirmed/processing/shipped/delivered/cancelled)
- `total_amount` (Decimal)
- `payment_status` (pending/paid/failed/refunded)
- `shipping_address` (JSONB)
- `created_at`, `updated_at`

#### order_items
- `id` (UUID, Primary Key)
- `order_id` (Foreign Key → orders)
- `product_id`, `product_name`, `product_image`
- `quantity`, `price`, `total`
- `created_at`

#### referrals
- `id` (UUID, Primary Key)
- `referrer_id` (Foreign Key → users)
- `referred_id` (Foreign Key → users)
- `referral_code` (The code used)
- `status` (pending/completed/cancelled)
- `reward_amount`, `reward_given`
- `created_at`, `completed_at`

#### referral_rewards
- `id` (UUID, Primary Key)
- `user_id` (Foreign Key → users)
- `referral_id` (Foreign Key → referrals)
- `type` (signup_bonus/referral_bonus/order_discount)
- `amount`, `description`
- `used`, `expires_at`
- `created_at`

## Security Features

### Row Level Security (RLS)
- **Enabled** on all tables
- Users can only access their own data
- Automatic filtering based on authenticated user

### Policies
- Users can view/update their own profile
- Users can view their own orders and order items
- Users can view referrals where they're involved
- Users can view their own rewards

## Troubleshooting

### Common Issues

1. **"Invalid supabaseUrl" Error**
   - Check `.env.local` file exists and has correct values
   - Ensure URL starts with `https://`
   - Restart development server after changes

2. **Database Connection Failed**
   - Verify project is active in Supabase dashboard
   - Check API keys are correct
   - Ensure database schema has been run

3. **Permission Denied Errors**
   - Verify RLS policies are set up correctly
   - Check user authentication status
   - Ensure proper table permissions

4. **UUID Format Errors**
   - The app handles Firebase UIDs automatically
   - UUID validation is built into the API routes
   - Non-UUID user IDs fallback to mock data

### Support

- **Supabase Docs**: [docs.supabase.com](https://docs.supabase.com)
- **Discord Community**: [discord.supabase.com](https://discord.supabase.com)
- **GitHub Issues**: Report bugs in project repository

## Next Steps

After successful setup:
1. ✅ Test user registration flow
2. ✅ Verify referral code generation
3. ✅ Test order creation and management
4. ✅ Validate reward distribution system
5. ✅ Test all API endpoints

Your Supabase database is now ready for the Luxury Jewelry App! 🚀