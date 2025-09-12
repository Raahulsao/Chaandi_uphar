# Database Setup for Luxury Jewelry App

This directory contains all the database setup files and utilities for the Luxury Jewelry App's Supabase backend.

## 📁 Directory Structure

```
database/
├── README.md                      # This file
├── SUPABASE_SETUP.md             # Complete setup guide
├── schema.sql                     # Main database schema
├── sample_data.sql               # Test data for development
├── maintenance.sql               # Maintenance and analytics queries
└── migrations/
    ├── 001_init_versioning.sql   # Database versioning system
    └── 003_enhanced_referrals.sql # Enhanced referral features
```

## 🚀 Quick Start

### 1. Basic Database Setup

```bash
# Install dependencies (if not already done)
npm install

# Set up database with basic schema
npm run db:setup

# Set up database with sample data for testing
npm run db:setup:sample
```

### 2. Environment Configuration

Make sure your `.env.local` file has the correct Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Run Migrations

```bash
# Run only pending migrations
npm run db:migrate
```

### 4. Reset Database (Development Only)

```bash
# WARNING: This will delete all data!
npm run db:reset
```

## 📋 Available Commands

| Command | Description |
|---------|-------------|
| `npm run db:setup` | Basic database setup with schema |
| `npm run db:setup:sample` | Setup with sample data for testing |
| `npm run db:reset` | Reset and recreate database ⚠️ |
| `npm run db:migrate` | Run only pending migrations |

## 🗄️ Database Schema

### Core Tables

#### `users`
User accounts with referral codes
- `id` (UUID) - Primary key
- `email` (VARCHAR) - Unique email address
- `name` (VARCHAR) - User display name
- `mobile_number` (VARCHAR) - Optional phone number
- `referral_code` (VARCHAR) - Unique referral code
- `referred_by` (VARCHAR) - Referral code used during signup

#### `orders`
Customer orders and transactions
- `id` (UUID) - Primary key
- `user_id` (UUID) - Reference to users table
- `order_number` (VARCHAR) - Unique order identifier
- `status` (ENUM) - Order status (pending, shipped, delivered, etc.)
- `total_amount` (DECIMAL) - Order total in INR
- `payment_status` (ENUM) - Payment status
- `shipping_address` (JSONB) - Delivery address

#### `referrals`
Referral tracking and rewards
- `id` (UUID) - Primary key
- `referrer_id` (UUID) - User who made the referral
- `referred_id` (UUID) - User who was referred
- `referral_code` (VARCHAR) - Code used for referral
- `status` (ENUM) - Referral status (pending, completed, cancelled)
- `reward_amount` (DECIMAL) - Reward amount in INR
- `reward_given` (BOOLEAN) - Whether reward has been distributed

#### `referral_rewards`
Individual rewards and bonuses
- `id` (UUID) - Primary key
- `user_id` (UUID) - Reward recipient
- `referral_id` (UUID) - Associated referral
- `type` (ENUM) - Reward type (signup_bonus, referral_bonus, order_discount)
- `amount` (DECIMAL) - Reward amount
- `used` (BOOLEAN) - Whether reward has been used
- `expires_at` (TIMESTAMP) - Expiration date

### Enhanced Features (Migration 003)

#### `referral_analytics`
Referral performance tracking
- Click tracking and conversion rates
- Earnings analytics per user
- Performance metrics

#### `referral_campaigns`
Campaign management for promotions
- Seasonal campaigns with different reward amounts
- Bonus multipliers for special periods
- Campaign duration tracking

#### `referral_shares`
Social sharing analytics
- Track shares across platforms (WhatsApp, Facebook, etc.)
- Conversion tracking from social shares
- Platform-specific performance metrics

## 🔒 Security Features

### Row Level Security (RLS)
- **Enabled** on all tables
- Users can only access their own data
- Automatic filtering based on authenticated user

### Policies
- Users can view/update their own profile
- Users can view their own orders and items
- Users can view referrals where they're involved
- Users can view their own rewards and analytics

## 📊 Analytics and Maintenance

### Built-in Analytics
The `maintenance.sql` file includes queries for:
- User registration statistics
- Referral performance metrics
- Revenue analysis by time period
- Top-selling products
- Reward utilization rates

### Sample Queries

```sql
-- Referral performance by user
SELECT 
  u.name,
  COUNT(r.id) as total_referrals,
  SUM(CASE WHEN r.reward_given THEN r.reward_amount ELSE 0 END) as total_earned
FROM users u
LEFT JOIN referrals r ON u.id = r.referrer_id
GROUP BY u.id, u.name
ORDER BY total_referrals DESC;

-- Monthly revenue trend
SELECT 
  DATE_TRUNC('month', created_at) as month,
  COUNT(*) as orders,
  SUM(total_amount) as revenue
FROM orders
WHERE payment_status = 'paid'
GROUP BY month
ORDER BY month DESC;
```

## 🔧 Advanced Usage

### Custom Migrations

1. Create a new migration file in `database/migrations/`:
```sql
-- Migration: Your feature description
-- Version: 004_your_feature.sql
-- Description: What this migration does

-- Check if migration should run
DO $$
BEGIN
  IF migration_exists('004') THEN
    RAISE NOTICE 'Migration 004 already executed, skipping...';
    RETURN;
  END IF;
END $$;

-- Your migration SQL here

-- Record this migration
SELECT record_migration('004', 'your_feature', 'Description of changes', 0);
```

2. Run the migration:
```bash
npm run db:migrate
```

### Manual Setup

If you prefer manual setup:

1. Copy content from `schema.sql`
2. Paste into Supabase SQL Editor
3. Run the query
4. Optionally run `sample_data.sql` for test data

## 🐛 Troubleshooting

### Common Issues

1. **Connection Failed**
   - Check `.env.local` file has correct Supabase URL and key
   - Verify Supabase project is active
   - Ensure URL starts with `https://`

2. **Permission Denied**
   - Verify RLS policies are set up correctly
   - Check user authentication status
   - Ensure service role key is used for setup scripts

3. **Migration Errors**
   - Check migration files are valid SQL
   - Ensure migrations are run in correct order
   - Verify no conflicting table/column names

### Getting Help

- **Supabase Documentation**: [docs.supabase.com](https://docs.supabase.com)
- **PostgreSQL Manual**: [postgresql.org/docs](https://www.postgresql.org/docs/)
- **Project Issues**: Create an issue in the project repository

## 📝 Notes

- The database uses UUID for all primary keys
- All timestamps include timezone information
- Referral codes are automatically generated and unique
- Row Level Security ensures data privacy
- The system handles both Firebase UIDs and standard UUIDs
- Sample data includes realistic Indian names and addresses
- Currency amounts are stored in INR (Indian Rupees)

## 🔄 Backup and Recovery

### Export Data
```sql
-- Export users (run in Supabase SQL Editor)
SELECT * FROM users ORDER BY created_at;

-- Export referrals with user details
SELECT r.*, referrer.email as referrer_email, referred.email as referred_email
FROM referrals r
JOIN users referrer ON r.referrer_id = referrer.id
JOIN users referred ON r.referred_id = referred.id;
```

### Restore Data
Use the setup scripts with custom data files or import via Supabase dashboard.

---

**Ready to start building your luxury jewelry e-commerce platform! 💎✨**