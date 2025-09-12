# Supabase Integration for Luxury Jewelry App

This document explains how to set up and use Supabase for referrals and order management in your luxury jewelry e-commerce application.

## 🚀 Supabase Setup Instructions

### 1. Create Supabase Project
1. Sign up at [Supabase](https://supabase.com/)
2. Create a new project
3. Wait for the project to be fully set up
4. Go to Settings > API to get your credentials:
   - Project URL
   - Anon Key
   - Service Role Key

### 2. Environment Variables
Update your `.env.local` file with your Supabase credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 3. Database Setup
1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Copy and run the schema from `database/schema.sql`
4. This will create all necessary tables and security policies

### 4. Row Level Security
The schema automatically sets up RLS policies that ensure:
- Users can only access their own data
- Secure referral and order management
- Proper authentication integration

## 📊 Database Schema

### Tables Created:
1. **users** - User profiles with referral codes
2. **orders** - Order information and status
3. **order_items** - Individual items in orders
4. **referrals** - Referral relationships
5. **referral_rewards** - Rewards and credits

### Key Features:
- Automatic referral code generation
- Order tracking and management
- Reward system with expiry dates
- Comprehensive user profiles

## 🛠 Components Usage

### UserProfile Component
```tsx
import { UserProfile } from '@/components/user/user-profile';

<UserProfile
  userId="user-uuid"
  userEmail="user@example.com"
  userName="User Name"
/>
```

### Checkout Component
```tsx
import { Checkout } from '@/components/checkout/checkout';

const cartItems = [
  { id: '1', name: 'Diamond Ring', price: 2500, quantity: 1 },
  // ... more items
];

<Checkout
  userId="user-uuid"
  cartItems={cartItems}
  onOrderSuccess={(order) => console.log('Order created:', order)}
/>
```

### Using Hooks
```tsx
import { useUser, useOrders, useReferrals } from '@/hooks/use-supabase';

const { user, createUser, updateUser } = useUser();
const { orders, createOrder } = useOrders(userId);
const { referrals, rewards, getTotalRewardValue } = useReferrals(userId);
```

## 🎯 Referral System Features

### Automatic Code Generation
- Unique referral codes for each user
- Based on user name + random numbers
- Example: JOHN1234, JANE5678

### Reward Structure
- **Signup Bonus**: ₹100 for new users with referral
- **First Order Discount**: ₹200 for referred users
- **Referral Bonus**: ₹500 for successful referrals

### Reward Types
1. `signup_bonus` - Welcome bonus for new users
2. `referral_bonus` - Reward for successful referrals
3. `order_discount` - Discount on orders

## 📦 Order Management

### Order Statuses
- `pending` - Order placed, awaiting confirmation
- `confirmed` - Order confirmed by admin
- `processing` - Order being prepared
- `shipped` - Order shipped to customer
- `delivered` - Order delivered successfully
- `cancelled` - Order cancelled

### Payment Statuses
- `pending` - Payment not yet processed
- `paid` - Payment successful
- `failed` - Payment failed
- `refunded` - Payment refunded

## 🔄 API Endpoints

### Referral Management
```typescript
// Create user with referral
POST /api/referrals
{
  "action": "create_user_with_referral",
  "email": "user@example.com",
  "name": "User Name",
  "referral_code": "FRIEND1234"
}

// Apply referral code
POST /api/referrals
{
  "action": "apply_referral",
  "userId": "user-uuid",
  "referralCode": "FRIEND1234"
}

// Get user stats
GET /api/referrals?userId=user-uuid&action=get_stats
```

## 🎨 UI Components Features

### UserProfile Component
- **Profile Tab**: Edit user information
- **Orders Tab**: View order history with status tracking
- **Referrals Tab**: Manage referral code and view statistics
- **Rewards Tab**: View and use available rewards

### Checkout Component
- **3-Step Process**: Shipping → Payment → Confirmation
- **Address Management**: Complete shipping address form
- **Payment Options**: Multiple payment methods
- **Order Summary**: Real-time cart calculation

## 🔐 Security Features

### Row Level Security
- Users can only access their own data
- Secure referral code validation
- Protected order information

### Data Validation
- Email uniqueness enforcement
- Referral code validation
- Prevent self-referrals
- Duplicate referral prevention

## 📱 Mobile Responsive

All components are fully responsive:
- Mobile-first design approach
- Touch-friendly interfaces
- Optimized for small screens
- Consistent with app design

## 🚀 Performance Optimizations

### Database Indexes
- Optimized queries for user lookups
- Fast referral code searches
- Efficient order filtering

### Caching Strategy
- Client-side state management
- Optimistic updates
- Real-time data synchronization

## 🛠 Development Workflow

### 1. Local Development
```bash
# Install dependencies
npm install @supabase/supabase-js

# Set up environment variables
# Run database migrations
# Start development server
npm run dev
```

### 2. Database Migrations
- Use Supabase migrations for schema changes
- Version control database changes
- Deploy safely to production

### 3. Testing
- Test referral flows
- Validate order creation
- Check reward calculations

## 📊 Analytics Integration

### Track Key Metrics
- Referral conversion rates
- Order completion rates
- Reward redemption rates
- User engagement metrics

### Custom Events
```typescript
// Track referral usage
analytics.track('referral_applied', {
  referralCode: 'FRIEND1234',
  userId: 'user-uuid'
});

// Track order completion
analytics.track('order_completed', {
  orderId: 'order-uuid',
  totalAmount: 2500
});
```

## 🆘 Troubleshooting

### Common Issues

1. **Connection Error**
   - Verify Supabase URL and keys
   - Check network connectivity
   - Ensure environment variables are set

2. **RLS Policy Issues**
   - Verify user authentication
   - Check policy definitions
   - Test with service role key

3. **Referral Not Working**
   - Validate referral code format
   - Check for existing referrals
   - Verify user eligibility

### Error Handling
All hooks include comprehensive error handling:
```typescript
const { error, loading } = useOrders();

if (error) {
  console.error('Order error:', error);
}
```

## 📞 Support Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Integration](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

This integration provides a complete referral and order management system with real-time updates, secure data handling, and excellent user experience.

---

# Cloudinary Integration for Luxury Jewelry App

This document explains how to set up and use Cloudinary for image storage in your luxury jewelry e-commerce application.

## 🚀 Setup Instructions

### 1. Get Cloudinary Account
1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Go to your Dashboard to get your credentials:
   - Cloud Name
   - API Key
   - API Secret

### 2. Create Upload Preset
1. In Cloudinary Dashboard, go to Settings > Upload
2. Click "Add upload preset"
3. Configure:
   - Preset name: `jewelry_app_preset` (or your choice)
   - Signing Mode: `Unsigned`
   - Folder: `jewelry-app` (optional)
   - Allowed formats: `jpg,jpeg,png,webp`
   - Max file size: `5MB`
   - Transformation: Add any default transformations

### 3. Environment Variables
Update your `.env.local` file with your Cloudinary credentials:

```env
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=jewelry_app_preset
```

### 4. Install Dependencies
The required packages are already installed:
- `cloudinary` - Server-side SDK
- `next-cloudinary` - Next.js optimized components

## 📁 File Structure

```
├── lib/
│   └── cloudinary.ts              # Server-side Cloudinary config
├── hooks/
│   └── use-cloudinary.ts          # Client-side upload hook
├── components/
│   ├── ui/
│   │   ├── image-upload.tsx       # Reusable upload component
│   │   └── cloudinary-image.tsx   # Optimized image component
│   └── admin/
│       └── product-manager.tsx    # Example admin interface
├── app/
│   └── api/
│       └── upload/
│           └── route.ts           # Upload API endpoint
└── scripts/
    └── migrate-images.ts          # Migration utility
```

## 🛠 Components Usage

### ImageUpload Component
```tsx
import { ImageUpload } from '@/components/ui/image-upload';

<ImageUpload
  onUploadSuccess={(result) => {
    console.log('Uploaded:', result.publicId);
  }}
  folder="products/rings"
  tags={['product', 'rings']}
  multiple={true}
  maxFiles={5}
/>
```

### CloudinaryImage Component
```tsx
import { CloudinaryImage } from '@/components/ui/cloudinary-image';

<CloudinaryImage
  publicId="products/rings/diamond_ring_001"
  alt="Diamond Ring"
  width={400}
  height={300}
  responsive={true}
  className="rounded-lg"
/>
```

### Upload Hook
```tsx
import { useCloudinaryUpload } from '@/hooks/use-cloudinary';

const { upload, uploading, error, progress } = useCloudinaryUpload();

const handleUpload = async (file: File) => {
  const result = await upload(file, {
    folder: 'products',
    tags: ['jewelry', 'product']
  });
  
  if (result) {
    console.log('Upload successful:', result.publicId);
  }
};
```

## 🔄 Migration Process

### Migrate Existing Images
1. Update the image paths in `scripts/migrate-images.ts`
2. Run the migration script:
```bash
npx ts-node scripts/migrate-images.ts
```

3. The script will:
   - Upload all images to Cloudinary
   - Generate a mapping file (`cloudinary-image-mapping.json`)
   - Provide a summary of successful/failed uploads

### Update Code References
After migration, replace static image paths with Cloudinary public IDs:

**Before:**
```tsx
<img src="/hero-jewelry.png" alt="Jewelry" />
```

**After:**
```tsx
<CloudinaryImage
  publicId="products/hero_jewelry"
  alt="Jewelry"
  width={800}
  height={600}
/>
```

## 🎯 Best Practices

### 1. Folder Organization
```
jewelry-app/
├── hero/           # Hero section images
├── products/       # Product images
│   ├── rings/
│   ├── earrings/
│   └── chains/
├── categories/     # Category thumbnails
├── icons/          # UI icons
└── branding/       # Logo, banners
```

### 2. Image Optimization
- Use automatic format (`f_auto`)
- Enable auto quality (`q_auto`)
- Implement responsive images with `srcset`
- Use appropriate transformations for different contexts

### 3. Naming Convention
- Use descriptive names: `diamond_ring_royal_collection`
- Include category in folder structure
- Use underscores instead of spaces
- Keep names URL-friendly

### 4. Tags Strategy
```tsx
// Product images
tags: ['product', 'rings', 'diamond', 'luxury']

// Hero images
tags: ['hero', 'banner', 'homepage']

// Category images
tags: ['category', 'thumbnail', 'navigation']
```

## 🚀 Performance Benefits

### Automatic Optimizations
- **Format conversion**: WebP/AVIF for supported browsers
- **Quality optimization**: Reduces file size by 50-80%
- **Lazy loading**: Built-in lazy loading support
- **Responsive images**: Automatic srcset generation
- **CDN delivery**: Global edge locations

### Transformations
```tsx
// Thumbnail
width: 200, height: 200, crop: 'fill'

// Hero banner
width: 1920, height: 1080, crop: 'fill', quality: 'auto'

// Product detail
width: 800, height: 600, crop: 'pad', background: 'white'
```

## 🔧 Advanced Features

### 1. Upload with Transformations
```tsx
const result = await upload(file, {
  folder: 'products',
  tags: ['jewelry'],
  transformation: {
    width: 1000,
    height: 1000,
    crop: 'fit',
    background: 'white'
  }
});
```

### 2. Bulk Upload
```tsx
const uploadMultiple = async (files: File[]) => {
  const results = await Promise.all(
    files.map(file => upload(file, { folder: 'bulk-upload' }))
  );
  return results.filter(Boolean);
};
```

### 3. Image Variants
```tsx
const getImageVariants = (publicId: string) => ({
  thumbnail: getOptimizedImageUrl(publicId, { width: 150, height: 150 }),
  medium: getOptimizedImageUrl(publicId, { width: 500, height: 500 }),
  large: getOptimizedImageUrl(publicId, { width: 1200, height: 1200 }),
  zoom: getOptimizedImageUrl(publicId, { width: 2000, height: 2000 })
});
```

## 🛡 Security Considerations

1. **Upload Presets**: Use unsigned presets for client uploads
2. **File Validation**: Validate file types and sizes
3. **Rate Limiting**: Implement upload rate limiting
4. **Access Control**: Use signed URLs for sensitive content
5. **Moderation**: Enable automatic content moderation

## 📊 Monitoring

### Track Upload Usage
- Monitor monthly bandwidth usage
- Track storage usage
- Monitor transformation usage
- Set up billing alerts

### Performance Metrics
- Image load times
- Conversion rates
- User engagement with visual content

## 🆘 Troubleshooting

### Common Issues

1. **Upload Fails**
   - Check upload preset configuration
   - Verify file size limits
   - Ensure CORS settings allow your domain

2. **Images Not Loading**
   - Verify public ID is correct
   - Check Cloudinary URL format
   - Ensure cloud name is correct

3. **Performance Issues**
   - Use appropriate image sizes
   - Enable auto-format and auto-quality
   - Implement lazy loading

### Error Handling
```tsx
const { upload, error } = useCloudinaryUpload();

if (error) {
  // Handle upload errors
  console.error('Upload failed:', error);
}
```

## 📞 Support

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Next.js Integration Guide](https://cloudinary.com/documentation/nextjs_integration)
- [Community Forum](https://community.cloudinary.com/)

---

This setup provides a complete image management solution with automatic optimization, responsive delivery, and a great developer experience. All images will be served from Cloudinary's global CDN for optimal performance.