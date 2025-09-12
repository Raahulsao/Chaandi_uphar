-- Database maintenance and utility queries for Luxury Jewelry App

-- ===== CLEANUP QUERIES =====

-- Remove all test data (USE WITH CAUTION!)
-- DELETE FROM referral_rewards;
-- DELETE FROM referrals;
-- DELETE FROM order_items;
-- DELETE FROM orders;
-- DELETE FROM users WHERE email LIKE '%@example.com';

-- Reset auto-increment sequences
-- ALTER SEQUENCE users_id_seq RESTART WITH 1;
-- ALTER SEQUENCE orders_id_seq RESTART WITH 1;

-- ===== ANALYTICS QUERIES =====

-- User statistics
SELECT 
  COUNT(*) as total_users,
  COUNT(CASE WHEN referred_by IS NOT NULL THEN 1 END) as referred_users,
  COUNT(CASE WHEN created_at > NOW() - INTERVAL '30 days' THEN 1 END) as new_users_30d,
  COUNT(CASE WHEN created_at > NOW() - INTERVAL '7 days' THEN 1 END) as new_users_7d
FROM users;

-- Referral performance
SELECT 
  u.name,
  u.email,
  u.referral_code,
  COUNT(r.id) as total_referrals,
  COUNT(CASE WHEN r.status = 'completed' THEN 1 END) as completed_referrals,
  COUNT(CASE WHEN r.status = 'pending' THEN 1 END) as pending_referrals,
  SUM(CASE WHEN r.reward_given THEN r.reward_amount ELSE 0 END) as total_earned,
  SUM(CASE WHEN NOT r.reward_given AND r.status = 'completed' THEN r.reward_amount ELSE 0 END) as pending_rewards
FROM users u
LEFT JOIN referrals r ON u.id = r.referrer_id
GROUP BY u.id, u.name, u.email, u.referral_code
HAVING COUNT(r.id) > 0
ORDER BY total_referrals DESC, total_earned DESC;

-- Order statistics by status
SELECT 
  status,
  COUNT(*) as order_count,
  SUM(total_amount) as total_revenue,
  AVG(total_amount) as avg_order_value
FROM orders
GROUP BY status
ORDER BY order_count DESC;

-- Monthly revenue trend
SELECT 
  DATE_TRUNC('month', created_at) as month,
  COUNT(*) as orders,
  SUM(total_amount) as revenue,
  AVG(total_amount) as avg_order_value
FROM orders
WHERE payment_status = 'paid'
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;

-- Top selling products
SELECT 
  product_name,
  SUM(quantity) as total_sold,
  SUM(total) as total_revenue,
  COUNT(DISTINCT order_id) as orders_count,
  AVG(price) as avg_price
FROM order_items oi
JOIN orders o ON oi.order_id = o.id
WHERE o.payment_status = 'paid'
GROUP BY product_name
ORDER BY total_sold DESC
LIMIT 10;

-- Referral reward utilization
SELECT 
  type,
  COUNT(*) as total_rewards,
  COUNT(CASE WHEN used THEN 1 END) as used_rewards,
  COUNT(CASE WHEN NOT used AND (expires_at IS NULL OR expires_at > NOW()) THEN 1 END) as active_rewards,
  COUNT(CASE WHEN NOT used AND expires_at IS NOT NULL AND expires_at <= NOW() THEN 1 END) as expired_rewards,
  SUM(amount) as total_value,
  SUM(CASE WHEN used THEN amount ELSE 0 END) as used_value
FROM referral_rewards
GROUP BY type
ORDER BY total_rewards DESC;

-- ===== MAINTENANCE QUERIES =====

-- Find expired unused rewards
SELECT 
  rr.*,
  u.name,
  u.email
FROM referral_rewards rr
JOIN users u ON rr.user_id = u.id
WHERE NOT rr.used 
  AND rr.expires_at IS NOT NULL 
  AND rr.expires_at <= NOW();

-- Find pending referrals older than 30 days
SELECT 
  r.*,
  referrer.name as referrer_name,
  referrer.email as referrer_email,
  referred.name as referred_name,
  referred.email as referred_email
FROM referrals r
JOIN users referrer ON r.referrer_id = referrer.id
JOIN users referred ON r.referred_id = referred.id
WHERE r.status = 'pending' 
  AND r.created_at < NOW() - INTERVAL '30 days';

-- Find users with duplicate referral codes (should not exist)
SELECT referral_code, COUNT(*) as count
FROM users
GROUP BY referral_code
HAVING COUNT(*) > 1;

-- Find orders without items (data integrity check)
SELECT o.*
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
WHERE oi.order_id IS NULL;

-- ===== PERFORMANCE QUERIES =====

-- Check index usage
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_tup_read DESC;

-- Table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- ===== BACKUP QUERIES =====

-- Export user data (for backup)
SELECT 
  id,
  email,
  name,
  mobile_number,
  referral_code,
  referred_by,
  created_at
FROM users
ORDER BY created_at;

-- Export referral data (for backup)
SELECT 
  r.*,
  referrer.email as referrer_email,
  referred.email as referred_email
FROM referrals r
JOIN users referrer ON r.referrer_id = referrer.id
JOIN users referred ON r.referred_id = referred.id
ORDER BY r.created_at;

-- ===== SECURITY AUDIT =====

-- Check RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE schemaname = 'public';

-- Check table permissions
SELECT 
  table_schema,
  table_name,
  privilege_type,
  grantee
FROM information_schema.table_privileges
WHERE table_schema = 'public'
ORDER BY table_name, privilege_type;