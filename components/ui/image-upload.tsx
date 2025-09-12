'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useCloudinaryUpload, getOptimizedImageUrl } from '@/hooks/use-cloudinary';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  onUploadSuccess?: (result: {
    publicId: string;
    url: string;
    width: number;
    height: number;
    format: string;
  }) => void;
  onUploadError?: (error: string) => void;
  folder?: string;
  tags?: string[];
  maxFiles?: number;
  acceptedFileTypes?: string[];
  maxFileSize?: number; // in MB
  className?: string;
  showPreview?: boolean;
  multiple?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onUploadSuccess,
  onUploadError,
  folder = 'jewelry-app',
  tags = ['jewelry', 'product'],
  maxFiles = 5,
  acceptedFileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  maxFileSize = 5, // 5MB
  className = '',
  showPreview = true,
  multiple = false,
}) => {
  const [uploadedImages, setUploadedImages] = useState<Array<{
    publicId: string;
    url: string;
    width: number;
    height: number;
    format: string;
  }>>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { upload, uploading, error, progress } = useCloudinaryUpload();
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (files.length === 0) return;

    // Validate file types and sizes
    const validFiles = files.filter(file => {
      if (!acceptedFileTypes.includes(file.type)) {
        toast({
          title: 'Invalid File Type',
          description: `${file.name} is not a supported image format.`,
          variant: 'destructive',
        });
        return false;
      }
      
      if (file.size > maxFileSize * 1024 * 1024) {
        toast({
          title: 'File Too Large',
          description: `${file.name} exceeds the ${maxFileSize}MB size limit.`,
          variant: 'destructive',
        });
        return false;
      }
      
      return true;
    });

    if (validFiles.length === 0) return;

    // Check max files limit
    if (uploadedImages.length + validFiles.length > maxFiles) {
      toast({
        title: 'Too Many Files',
        description: `You can only upload up to ${maxFiles} images.`,
        variant: 'destructive',
      });
      return;
    }

    // Create previews
    if (showPreview) {
      const newPreviews = validFiles.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    }

    // Upload files
    uploadFiles(validFiles);
  };

  const uploadFiles = async (files: File[]) => {
    for (const file of files) {
      try {
        const result = await upload(file, { folder, tags });
        
        if (result) {
          setUploadedImages(prev => [...prev, result]);
          onUploadSuccess?.(result);
          
          toast({
            title: 'Upload Successful',
            description: `${file.name} has been uploaded successfully.`,
          });
        } else {
          throw new Error('Upload failed');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Upload failed';
        onUploadError?.(errorMessage);
        
        toast({
          title: 'Upload Failed',
          description: `Failed to upload ${file.name}: ${errorMessage}`,
          variant: 'destructive',
        });
      }
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
    if (showPreview) {
      setPreviews(prev => {
        const newPreviews = prev.filter((_, i) => i !== index);
        // Revoke the object URL to free memory
        URL.revokeObjectURL(prev[index]);
        return newPreviews;
      });
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div className="space-y-2">
        <Label>Upload Images</Label>
        <div
          onClick={triggerFileInput}
          className={`
            relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer
            hover:border-gray-400 hover:bg-gray-50 transition-colors
            ${uploading ? 'pointer-events-none opacity-50' : ''}
          `}
        >
          <Input
            ref={fileInputRef}
            type="file"
            multiple={multiple}
            accept={acceptedFileTypes.join(',')}
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
          
          <div className="flex flex-col items-center space-y-2">
            <Upload className="w-8 h-8 text-gray-400" />
            <div className="text-sm text-gray-600">
              <span className="font-medium text-[#ff8fab]">Click to upload</span> or drag and drop
            </div>
            <div className="text-xs text-gray-500">
              {acceptedFileTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')} up to {maxFileSize}MB
            </div>
          </div>
        </div>
      </div>

      {/* Upload Progress */}
      {uploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Uploading...</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
          {error}
        </div>
      )}

      {/* Image Previews */}
      {showPreview && uploadedImages.length > 0 && (
        <div className="space-y-2">
          <Label>Uploaded Images ({uploadedImages.length}/{maxFiles})</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {uploadedImages.map((image, index) => (
              <div key={image.publicId} className="relative group">
                <div className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={getOptimizedImageUrl(image.publicId, { width: 200, height: 200 })}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                    <Button
                      onClick={() => removeImage(index)}
                      variant="destructive"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-1 truncate">
                  {image.format.toUpperCase()} • {image.width}×{image.height}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Stats */}
      <div className="text-xs text-gray-500">
        {uploadedImages.length > 0 && (
          <span>{uploadedImages.length} image{uploadedImages.length !== 1 ? 's' : ''} uploaded</span>
        )}
        {maxFiles - uploadedImages.length > 0 && (
          <span> • {maxFiles - uploadedImages.length} more allowed</span>
        )}
      </div>
    </div>
  );
};