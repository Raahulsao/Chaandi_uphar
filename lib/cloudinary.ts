import { v2 as cloudinary } from 'cloudinary';

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

// Helper function to get Cloudinary image URL with transformations
export const getCloudinaryImageUrl = (
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: string | number;
    format?: string;
    crop?: string;
    gravity?: string;
  } = {}
) => {
  const {
    width = 800,
    height = 600,
    quality = 'auto',
    format = 'auto',
    crop = 'fill',
    gravity = 'auto'
  } = options;

  return cloudinary.url(publicId, {
    width,
    height,
    quality,
    format,
    crop,
    gravity,
    fetch_format: 'auto',
    dpr: 'auto',
  });
};

// Helper function for responsive image URLs
export const getResponsiveImageUrls = (publicId: string) => {
  return {
    mobile: getCloudinaryImageUrl(publicId, { width: 400, height: 300 }),
    tablet: getCloudinaryImageUrl(publicId, { width: 800, height: 600 }),
    desktop: getCloudinaryImageUrl(publicId, { width: 1200, height: 900 }),
    thumbnail: getCloudinaryImageUrl(publicId, { width: 200, height: 150 }),
  };
};

// Upload function for server-side uploads
export const uploadToCloudinary = async (
  file: string | Buffer,
  options: {
    folder?: string;
    public_id?: string;
    tags?: string[];
    transformation?: any;
  } = {}
) => {
  try {
    // Convert Buffer to base64 string if necessary
    let fileData: string;
    if (Buffer.isBuffer(file)) {
      fileData = `data:image/jpeg;base64,${file.toString('base64')}`;
    } else {
      fileData = file;
    }

    const result = await cloudinary.uploader.upload(fileData, {
      folder: options.folder || 'jewelry-app',
      public_id: options.public_id,
      tags: options.tags || ['jewelry', 'product'],
      transformation: options.transformation,
      resource_type: 'auto',
    });

    return {
      success: true,
      publicId: result.public_id,
      url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
};

// Delete function
export const deleteFromCloudinary = async (publicId: string) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return {
      success: result.result === 'ok',
      result: result.result,
    };
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Delete failed',
    };
  }
};