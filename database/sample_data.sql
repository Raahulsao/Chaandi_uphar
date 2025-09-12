-- Sample data for testing the Luxury Jewelry App
-- Run this after the main schema.sql has been executed

-- Insert sample users
INSERT INTO users (id, email, name, mobile_number, referral_code, referred_by) VALUES 
  ('550e8400-e29b-41d4-a716-446655440001', 'alice@example.com', 'Alice Johnson', '+1234567890', 'ALIC1234', NULL),
  ('550e8400-e29b-41d4-a716-446655440002', 'bob@example.com', 'Bob Smith', '+1234567891', 'BOBS5678', 'ALIC1234'),
  ('550e8400-e29b-41d4-a716-446655440003', 'carol@example.com', 'Carol Wilson', '+1234567892', 'CARO9012', 'ALIC1234'),
  ('550e8400-e29b-41d4-a716-446655440004', 'david@example.com', 'David Brown', '+1234567893', 'DAVI3456', NULL),
  ('550e8400-e29b-41d4-a716-446655440005', 'emma@example.com', 'Emma Davis', '+1234567894', 'EMMA7890', 'BOBS5678')
ON CONFLICT (email) DO NOTHING;

-- Insert sample orders
INSERT INTO orders (id, user_id, order_number, status, total_amount, payment_status, payment_method, shipping_address) VALUES 
  (
    '660e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440001',
    'ORD001',
    'delivered',
    25999.00,
    'paid',
    'credit_card',
    '{"name": "Alice Johnson", "mobile": "+1234567890", "address_line_1": "123 Main St", "address_line_2": "Apt 4B", "city": "Mumbai", "state": "Maharashtra", "pincode": "400001", "country": "India"}'
  ),
  (
    '660e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440002',
    'ORD002',
    'shipped',
    15999.00,
    'paid',
    'upi',
    '{"name": "Bob Smith", "mobile": "+1234567891", "address_line_1": "456 Oak Ave", "city": "Delhi", "state": "Delhi", "pincode": "110001", "country": "India"}'
  ),
  (
    '660e8400-e29b-41d4-a716-446655440003',
    '550e8400-e29b-41d4-a716-446655440003',
    'ORD003',
    'processing',
    8999.00,
    'paid',
    'netbanking',
    '{"name": "Carol Wilson", "mobile": "+1234567892", "address_line_1": "789 Pine St", "city": "Bangalore", "state": "Karnataka", "pincode": "560001", "country": "India"}'
  )
ON CONFLICT (order_number) DO NOTHING;

-- Insert sample order items
INSERT INTO order_items (order_id, product_id, product_name, product_image, quantity, price, total) VALUES 
  ('660e8400-e29b-41d4-a716-446655440001', 'prod_001', 'Diamond Rose Gold Necklace', '/images/necklace-1.jpg', 1, 25999.00, 25999.00),
  ('660e8400-e29b-41d4-a716-446655440002', 'prod_002', 'Silver Temple Earrings', '/images/earrings-1.jpg', 1, 15999.00, 15999.00),
  ('660e8400-e29b-41d4-a716-446655440003', 'prod_003', 'Gold Bangles Set', '/images/bangles-1.jpg', 2, 4499.50, 8999.00);

-- Insert sample referrals
INSERT INTO referrals (id, referrer_id, referred_id, referral_code, status, reward_amount, reward_given, completed_at) VALUES 
  (
    '770e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440002',
    'ALIC1234',
    'completed',
    500.00,
    true,
    NOW() - INTERVAL '5 days'
  ),
  (
    '770e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440003',
    'ALIC1234',
    'completed',
    500.00,
    true,
    NOW() - INTERVAL '3 days'
  ),
  (
    '770e8400-e29b-41d4-a716-446655440003',
    '550e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440005',
    'BOBS5678',
    'pending',
    500.00,
    false,
    NULL
  );

-- Insert sample referral rewards
INSERT INTO referral_rewards (user_id, referral_id, type, amount, description, used, expires_at) VALUES 
  (
    '550e8400-e29b-41d4-a716-446655440002',
    '770e8400-e29b-41d4-a716-446655440001',
    'signup_bonus',
    100.00,
    'Welcome bonus for signing up with referral code ALIC1234',
    true,
    NOW() + INTERVAL '25 days'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440001',
    '770e8400-e29b-41d4-a716-446655440001',
    'referral_bonus',
    500.00,
    'Referral bonus for successful referral of Bob Smith',
    false,
    NULL
  ),
  (
    '550e8400-e29b-41d4-a716-446655440003',
    '770e8400-e29b-41d4-a716-446655440002',
    'signup_bonus',
    100.00,
    'Welcome bonus for signing up with referral code ALIC1234',
    false,
    NOW() + INTERVAL '27 days'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440001',
    '770e8400-e29b-41d4-a716-446655440002',
    'referral_bonus',
    500.00,
    'Referral bonus for successful referral of Carol Wilson',
    false,
    NULL
  ),
  (
    '550e8400-e29b-41d4-a716-446655440005',
    '770e8400-e29b-41d4-a716-446655440003',
    'order_discount',
    200.00,
    'First order discount for using referral code BOBS5678',
    false,
    NOW() + INTERVAL '28 days'
  );

-- Verify the sample data
SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Orders' as table_name, COUNT(*) as count FROM orders
UNION ALL
SELECT 'Order Items' as table_name, COUNT(*) as count FROM order_items
UNION ALL
SELECT 'Referrals' as table_name, COUNT(*) as count FROM referrals
UNION ALL
SELECT 'Referral Rewards' as table_name, COUNT(*) as count FROM referral_rewards;

-- Show referral statistics
SELECT 
  u.name as referrer_name,
  u.referral_code,
  COUNT(r.id) as total_referrals,
  COUNT(CASE WHEN r.status = 'completed' THEN 1 END) as completed_referrals,
  SUM(CASE WHEN r.reward_given THEN r.reward_amount ELSE 0 END) as total_earned
FROM users u
LEFT JOIN referrals r ON u.id = r.referrer_id
GROUP BY u.id, u.name, u.referral_code
ORDER BY total_referrals DESC;