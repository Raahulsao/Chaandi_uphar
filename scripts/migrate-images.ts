import { uploadToCloudinary } from '../lib/cloudinary';
import fs from 'fs';
import path from 'path';

// Define your existing images and their paths
const imagesToMigrate = [
  // Hero section images
  { path: '/public/Untitled design (3) (1).png', folder: 'hero', tags: ['hero', 'banner'] },
  { path: '/public/Gemini.png', folder: 'hero', tags: ['hero', 'banner'] },
  { path: '/public/Untitled design (1).png', folder: 'hero', tags: ['hero', 'banner'] },
  { path: '/public/brand.jpg', folder: 'hero', tags: ['hero', 'banner'] },
  
  // Product images
  { path: '/public/hero-jewelry.png', folder: 'products', tags: ['product', 'jewelry'] },
  { path: '/public/New Ring.jpeg', folder: 'products', tags: ['product', 'jewelry', 'ring'] },
  { path: '/public/Untitled design (2) (1).png', folder: 'products', tags: ['product', 'jewelry'] },
  { path: '/public/Untitled design (10).png', folder: 'products', tags: ['product', 'jewelry'] },
  
  // Logo and branding
  { path: '/public/logo.png', folder: 'branding', tags: ['logo', 'brand'] },
  
  // Category images
  { path: '/public/ladoo-gopal-shringaar.png', folder: 'categories', tags: ['category', 'spiritual'] },
  { path: '/public/gift-items.png', folder: 'categories', tags: ['category', 'gifts'] },
  
  // Icons
  { path: '/public/icons/necklace.png', folder: 'icons', tags: ['icon', 'category'] },
  { path: '/public/icons/golden.png', folder: 'icons', tags: ['icon', 'category'] },
  { path: '/public/icons/pendant-necklance.png', folder: 'icons', tags: ['icon', 'category'] },
  { path: '/public/icons/earrings.png', folder: 'icons', tags: ['icon', 'category'] },
  { path: '/public/icons/wedding-ring.png', folder: 'icons', tags: ['icon', 'category'] },
  { path: '/public/icons/bracelet.png', folder: 'icons', tags: ['icon', 'category'] },
  { path: '/public/icons/fashion.png', folder: 'icons', tags: ['icon', 'category'] },
  { path: '/public/icons/gift-card.png', folder: 'icons', tags: ['icon', 'category'] },
];

interface MigrationResult {
  originalPath: string;
  publicId?: string;
  cloudinaryUrl?: string;
  success: boolean;
  error?: string;
}

export async function migrateImagesToCloudinary(): Promise<MigrationResult[]> {
  const results: MigrationResult[] = [];
  
  console.log(`Starting migration of ${imagesToMigrate.length} images...`);
  
  for (const image of imagesToMigrate) {
    try {
      const fullPath = path.join(process.cwd(), image.path);
      
      // Check if file exists
      if (!fs.existsSync(fullPath)) {
        console.log(`⚠️  File not found: ${image.path}`);
        results.push({
          originalPath: image.path,
          success: false,
          error: 'File not found'
        });
        continue;
      }
      
      // Read file
      const fileBuffer = fs.readFileSync(fullPath);
      
      // Generate public_id from file path
      const fileName = path.basename(image.path, path.extname(image.path));
      const publicId = `${image.folder}/${fileName}`.replace(/[^a-zA-Z0-9_-]/g, '_');
      
      console.log(`📤 Uploading: ${image.path} -> ${publicId}`);
      
      // Upload to Cloudinary
      const uploadResult = await uploadToCloudinary(fileBuffer, {
        folder: image.folder,
        public_id: publicId,
        tags: image.tags
      });
      
      if (uploadResult.success) {
        console.log(`✅ Successfully uploaded: ${publicId}`);
        results.push({
          originalPath: image.path,
          publicId: uploadResult.publicId,
          cloudinaryUrl: uploadResult.url,
          success: true
        });
      } else {
        console.log(`❌ Failed to upload: ${image.path} - ${uploadResult.error}`);
        results.push({
          originalPath: image.path,
          success: false,
          error: uploadResult.error
        });
      }
      
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.log(`❌ Error processing ${image.path}: ${errorMessage}`);
      results.push({
        originalPath: image.path,
        success: false,
        error: errorMessage
      });
    }
  }
  
  // Generate summary
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`\n📊 Migration Summary:`);
  console.log(`✅ Successful: ${successful}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📁 Total: ${results.length}`);
  
  // Generate mapping file for easy reference
  const mapping = results
    .filter(r => r.success)
    .reduce((acc, result) => {
      acc[result.originalPath] = {
        publicId: result.publicId,
        cloudinaryUrl: result.cloudinaryUrl
      };
      return acc;
    }, {} as Record<string, any>);
  
  // Save mapping to file
  const mappingPath = path.join(process.cwd(), 'cloudinary-image-mapping.json');
  fs.writeFileSync(mappingPath, JSON.stringify(mapping, null, 2));
  console.log(`\n💾 Image mapping saved to: ${mappingPath}`);
  
  return results;
}

// Helper function to update image references in code
export function generateImageReplacementMap(results: MigrationResult[]): Record<string, string> {
  const replacementMap: Record<string, string> = {};
  
  results.forEach(result => {
    if (result.success && result.publicId) {
      // Convert public path to import path
      const importPath = result.originalPath.replace('/public', '');
      replacementMap[importPath] = result.publicId;
    }
  });
  
  return replacementMap;
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrateImagesToCloudinary()
    .then((results) => {
      console.log('✨ Migration completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration failed:', error);
      process.exit(1);
    });
}