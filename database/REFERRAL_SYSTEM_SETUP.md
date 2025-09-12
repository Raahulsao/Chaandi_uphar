# Complete Referral System Setup Guide

## Overview
This guide will help you set up a fully functional, real referral system that removes all fake/dummy data and works with actual database operations.

## What Was Fixed

### ❌ Removed Fake/Dummy Data
- **API Mock Responses**: Removed hardcoded mock referral data from all API endpoints
- **Fake Statistics**: Removed fake referral counts and earnings
- **Mock User Data**: Removed mock user profiles and referral codes
- **Dummy Rewards**: Removed fake reward data and balances

### ✅ Implemented Real Database Integration
- **Real Referral Validation**: Referral codes are now validated against actual database records
- **Actual Statistics**: All statistics are calculated from real database data
- **Genuine User Profiles**: User profiles are created and managed in the database
- **Real Rewards System**: Rewards are tracked and managed in the database

## Database Setup

### 1. Run the Database Schema
```bash
# Connect to your Supabase database and run:
psql -d your_database_name -f database/schema.sql
```

### 2. Run Enhanced Referral Migrations
```bash
# Run the enhanced referral system migration:
psql -d your_database_name -f database/migrations/003_enhanced_referrals.sql
```

### 3. Verify Tables Created
Check that these tables exist in your database:
- `users` - User profiles with referral codes
- `referrals` - Referral relationships and status
- `referral_rewards` - Reward tracking and usage
- `referral_analytics` - Analytics and performance tracking
- `referral_campaigns` - Campaign management
- `referral_shares` - Social sharing tracking

## Environment Configuration

### 1. Supabase Configuration
Ensure your `.env.local` has proper Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 2. Verify Database Connection
Test the connection by visiting: `/api/auth/user-stats?userId=test`
- Should return error if database not configured
- Should return real stats if properly configured

## How the Real System Works

### 1. User Registration with Referral
```typescript
// When user signs up with referral code
const result = await registerUser(firebaseUser, {
  email: 'user@example.com',
  name: 'John Doe',
  referralCodeUsed: 'JANE1234' // Real referral code
});

// System automatically:
// 1. Validates referral code against database
// 2. Creates user profile with unique referral code
// 3. Creates referral relationship
// 4. Awards signup bonus and first order discount
// 5. Sets up referrer reward (pending until first purchase)
```

### 2. Referral Code Validation
```typescript
// Real validation against database
const validation = await validateReferralCode('JANE1234');
// Returns:
// - valid: true/false
// - referrer: { name, email }
// - rewards: { signupBonus: 100, firstOrderDiscount: 200, referrerReward: 500 }
```

### 3. Real Statistics Calculation
```typescript
// All statistics calculated from actual database data
const stats = await fetch('/api/auth/user-stats?userId=user123');
// Returns real data:
// - completedReferrals: actual count from database
// - totalEarnings: sum of actual rewards given
// - activeRewards: count of unused, non-expired rewards
```

### 4. Referral Completion Process
```typescript
// When referred user makes first purchase
await fetch('/api/referrals/complete', {
  method: 'POST',
  body: JSON.stringify({
    referralId: 'real-referral-id',
    orderId: 'real-order-id',
    orderAmount: 2999
  })
});

// System automatically:
// 1. Marks referral as completed
// 2. Creates ₹500 reward for referrer
// 3. Updates analytics and statistics
```

## API Endpoints (All Real Data)

### User Statistics
- `GET /api/auth/user-stats?userId={id}` - Real user statistics
- Returns actual counts from database

### Referral Management
- `GET /api/referrals?userId={id}` - Real referral history
- `POST /api/referrals/apply` - Apply real referral code
- `POST /api/referrals/complete` - Complete real referral

### Referral Analytics
- `GET /api/referrals/stats?userId={id}` - Real analytics data
- Includes conversion rates, earnings, activity

### Validation
- `POST /api/auth/validate-referral` - Validate against database
- Returns real referrer information

## Testing the Real System

### 1. Create Test Users
```sql
-- Create test users with referral codes
INSERT INTO users (email, name, referral_code) VALUES 
  ('alice@test.com', 'Alice Smith', 'ALIC1234'),
  ('bob@test.com', 'Bob Johnson', 'BOBJ5678');
```

### 2. Test Referral Flow
1. **Validate Code**: POST to `/api/auth/validate-referral` with `ALIC1234`
2. **Register User**: Use Alice's code during registration
3. **Check Statistics**: GET `/api/auth/user-stats?userId=alice-id`
4. **Complete Referral**: POST to `/api/referrals/complete`

### 3. Verify Real Data
- Check `referrals` table for actual records
- Verify `referral_rewards` table for real rewards
- Confirm statistics match database counts

## Error Handling

### Database Not Configured
- All endpoints return proper error messages
- No fake data is returned
- Clear instructions for setup

### Invalid Referral Codes
- Real validation against database
- Proper error messages for invalid codes
- No mock "valid" codes

### User Not Found
- Proper handling of non-existent users
- Real database lookups
- Appropriate error responses

## Benefits of Real System

### ✅ Authentic Data
- All referral codes are real and unique
- Statistics reflect actual user behavior
- Rewards are tracked and redeemable

### ✅ Scalable Architecture
- Database-driven design
- Analytics and reporting capabilities
- Campaign management features

### ✅ Security & Integrity
- Proper validation and error handling
- No hardcoded or predictable data
- Audit trail for all referral activities

### ✅ User Experience
- Real-time statistics updates
- Accurate reward tracking
- Genuine referral relationships

## Monitoring & Analytics

### Database Queries for Insights
```sql
-- Top referrers
SELECT u.name, u.email, COUNT(r.id) as referral_count, SUM(r.reward_amount) as total_earned
FROM users u
LEFT JOIN referrals r ON u.id = r.referrer_id AND r.status = 'completed'
GROUP BY u.id, u.name, u.email
ORDER BY referral_count DESC;

-- Referral conversion rates
SELECT 
  COUNT(*) as total_referrals,
  COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_referrals,
  ROUND(
    (COUNT(CASE WHEN status = 'completed' THEN 1 END)::decimal / COUNT(*)) * 100, 
    2
  ) as conversion_rate
FROM referrals;

-- Active rewards by type
SELECT type, COUNT(*) as count, SUM(amount) as total_value
FROM referral_rewards 
WHERE used = false AND (expires_at IS NULL OR expires_at > NOW())
GROUP BY type;
```

## Next Steps

1. **Set up database** using the provided schema and migrations
2. **Configure environment** variables for Supabase
3. **Test the system** with real user registration and referral flows
4. **Monitor analytics** using the provided database queries
5. **Customize rewards** and campaigns as needed

The referral system is now completely real and production-ready! 🎉