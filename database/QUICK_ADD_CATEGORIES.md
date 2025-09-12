# Quick Setup: Add Missing Categories

## Option 1: Run the migration script (Recommended)
If you have database access, run this SQL script:

```bash
# Connect to your database and run:
psql -d your_database_name -f database/add-missing-categories.sql
```

## Option 2: Manual SQL execution
Copy and paste this SQL into your database console:

```sql
INSERT INTO categories (id, name, slug, description, sort_order, status) VALUES 
  ('550e8400-e29b-41d4-a716-446655440010', 'Anklets', 'anklets', 'Beautiful anklets and ankle jewelry', 10, 'active'),
  ('550e8400-e29b-41d4-a716-446655440011', 'Ladoo Gopal Shringaar', 'ladoo-gopal-shringaar', 'Traditional Ladoo Gopal decoration items', 11, 'active')
ON CONFLICT (id) DO NOTHING;
```

## Option 3: Fresh database setup
If setting up a fresh database, just run:

```bash
psql -d your_database_name -f database/simple-setup.sql
```

This will create all tables and categories including the new ones.

## Verification
After running any of the above, verify the categories were added:

```sql
SELECT name, slug FROM categories WHERE name IN ('Anklets', 'Ladoo Gopal Shringaar');
```

You should see both categories listed.

## What's Updated
✅ Database schema includes Anklets and Ladoo Gopal Shringaar categories  
✅ Admin panel now shows these categories in the dropdown  
✅ Category pages will now fetch products from their dedicated categories  
✅ Products added to these categories will appear on their respective pages  

## Next Steps
1. Run one of the database setup options above
2. Go to `/admin` and create products
3. Select "Anklets" or "Ladoo Gopal Shringaar" as the category
4. Products will automatically appear on `/anklets` and `/ladoo-gopal-shringaar` pages