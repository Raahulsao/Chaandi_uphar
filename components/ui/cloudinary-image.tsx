'use client';

import React from 'react';
import { getOptimizedImageUrl } from '@/hooks/use-cloudinary';

interface CloudinaryImageProps {
  publicId: string;
  alt: string;
  width?: number;
  height?: number;
  quality?: string | number;
  format?: string;
  crop?: string;
  className?: string;
  responsive?: boolean;
  sizes?: string;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

export const CloudinaryImage: React.FC<CloudinaryImageProps> = ({
  publicId,
  alt,
  width = 800,
  height = 600,
  quality = 'auto',
  format = 'auto',
  crop = 'fill',
  className = '',
  responsive = true,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  priority = false,
  onLoad,
  onError,
}) => {
  const generateSrcSet = () => {
    if (!responsive) return undefined;
    
    const breakpoints = [320, 640, 768, 1024, 1280, 1920];
    return breakpoints
      .map(bp => {
        const url = getOptimizedImageUrl(publicId, {
          width: bp,
          height: Math.round((bp * height) / width),
          quality,
          format,
          crop,
        });
        return `${url} ${bp}w`;
      })
      .join(', ');
  };

  const src = getOptimizedImageUrl(publicId, {
    width,
    height,
    quality,
    format,
    crop,
  });

  return (
    <img
      src={src}
      srcSet={responsive ? generateSrcSet() : undefined}
      sizes={responsive ? sizes : undefined}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      onLoad={onLoad}
      onError={onError}
      style={{
        maxWidth: '100%',
        height: 'auto',
      }}
    />
  );
};

// Hook for getting responsive image URLs
export const useResponsiveImages = (publicId: string) => {
  return {
    mobile: getOptimizedImageUrl(publicId, { width: 400, height: 300 }),
    tablet: getOptimizedImageUrl(publicId, { width: 800, height: 600 }),
    desktop: getOptimizedImageUrl(publicId, { width: 1200, height: 900 }),
    thumbnail: getOptimizedImageUrl(publicId, { width: 200, height: 150 }),
    hero: getOptimizedImageUrl(publicId, { width: 1920, height: 1080 }),
  };
};