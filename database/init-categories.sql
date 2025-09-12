-- Initialize categories for the jewelry app
-- Run this in your Supabase SQL editor after running schema.sql

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