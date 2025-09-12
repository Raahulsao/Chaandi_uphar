# Database Setup Instructions

## Quick Setup (Required for Full Functionality)

Your app is currently working in **demo mode** with mock data. To enable full functionality with real database storage, follow these steps:

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for the project to be ready (2-3 minutes)

### 2. Get Your Credentials
1. Go to **Settings** → **API**
2. Copy your:
   - Project URL
   - `anon` public key

### 3. Update Environment Variables
Create/update your `.env.local` file:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Cloudinary (for image uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 4. Run Database Scripts

**IMPORTANT: Use the Simple Setup Script**

1. Go to your Supabase project dashboard
2. Click **SQL Editor** in the sidebar
3. Create a **New Query**
4. Copy and paste the content from `database/simple-setup.sql` (NOT complete-setup.sql)
5. Click **Run** to execute the script

**Expected Result:**
```
Database setup completed successfully! You can now create products.
categories_created: 9
Tables created: categories, products, product_images, inventory, inventory_adjustments
```

**If you get errors about existing objects:**
- This is normal if you've run the script before
- The script is safe to run multiple times
- Just ignore the errors and check the success message at the end

### 5. Restart Your App
```bash
npm run dev
```

## What This Enables

✅ **Before Setup (Current - Demo Mode):**
- Image uploads work (Cloudinary)
- Admin interface works
- Mock product creation
- Category pages show empty states

✅ **After Setup (Full Functionality):**
- Real product storage in database
- Products appear on category pages
- Inventory tracking
- Product search and filtering
- Data persistence across sessions

## Troubleshooting

**Error: "Could not find the table 'public.products'"**
- This means you haven't run the database setup script yet
- Follow steps 4-5 above

**Error: "Database not configured"**
- Check your `.env.local` file has the correct Supabase credentials
- Restart your development server after updating environment variables

**Images upload but products don't save**
- This is expected in demo mode
- Run the database setup to enable full functionality