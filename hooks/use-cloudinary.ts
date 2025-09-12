'use client';

import { useState } from 'react';

interface UploadResult {
  publicId: string;
  url: string;
  width: number;
  height: number;
  format: string;
}

interface UseCloudinaryUploadReturn {
  upload: (file: File, options?: UploadOptions) => Promise<UploadResult | null>;
  uploading: boolean;
  error: string | null;
  progress: number;
}

interface UploadOptions {
  folder?: string;
  tags?: string[];
  transformation?: string;
  eager?: string;
}

export const useCloudinaryUpload = (): UseCloudinaryUploadReturn => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const upload = async (file: File, options: UploadOptions = {}): Promise<UploadResult | null> => {
    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '');
      
      if (options.folder) {
        formData.append('folder', options.folder);
      }
      
      if (options.tags) {
        formData.append('tags', options.tags.join(','));
      }

      if (options.transformation) {
        formData.append('transformation', options.transformation);
      }

      if (options.eager) {
        formData.append('eager', options.eager);
      }

      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progressPercentage = (event.loaded / event.total) * 100;
          setProgress(progressPercentage);
        }
      });

      const uploadPromise = new Promise<UploadResult>((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status === 200) {
            const result = JSON.parse(xhr.responseText);
            resolve({
              publicId: result.public_id,
              url: result.secure_url,
              width: result.width,
              height: result.height,
              format: result.format,
            });
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        };

        xhr.onerror = () => {
          reject(new Error('Upload failed'));
        };
      });

      xhr.open('POST', `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`);
      xhr.send(formData);

      const result = await uploadPromise;
      setProgress(100);
      return result;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      console.error('Upload error:', err);
      return null;
    } finally {
      setUploading(false);
    }
  };

  return {
    upload,
    uploading,
    error,
    progress,
  };
};

// Helper function for client-side image optimization
export const getOptimizedImageUrl = (
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: string | number;
    format?: string;
    crop?: string;
  } = {}
) => {
  const {
    width = 800,
    height = 600,
    quality = 'auto',
    format = 'auto',
    crop = 'fill'
  } = options;

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  
  const transformations = [
    `w_${width}`,
    `h_${height}`,
    `c_${crop}`,
    `q_${quality}`,
    `f_${format}`,
    'dpr_auto'
  ].join(',');

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${publicId}`;
};