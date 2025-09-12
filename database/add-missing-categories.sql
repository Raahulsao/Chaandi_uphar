-- Add missing categories: Anklets and Ladoo Gopal Shringaar
-- This script is safe to run multiple times

INSERT INTO categories (id, name, slug, description, sort_order, status) VALUES 
  ('550e8400-e29b-41d4-a716-446655440010', 'Anklets', 'anklets', 'Beautiful anklets and ankle jewelry', 10, 'active'),
  ('550e8400-e29b-41d4-a716-446655440011', 'Ladoo Gopal Shringaar', 'ladoo-gopal-shringaar', 'Traditional Ladoo Gopal decoration items', 11, 'active')
ON CONFLICT (id) DO NOTHING;

-- Success message
SELECT 'Missing categories added successfully!' as message;
SELECT name, slug FROM categories WHERE id IN ('550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440011');