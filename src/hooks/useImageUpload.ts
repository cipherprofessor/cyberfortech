// src/hooks/useImageUpload.ts
import { useState, useRef } from 'react';
import axios from 'axios';

interface UseImageUploadOptions {
  onSuccess?: (url: string) => void;
  onError?: (error: Error) => void;
}

export function useImageUpload(options?: UseImageUploadOptions) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { onSuccess, onError } = options || {};

  const uploadImage = async (file: File) => {
    if (!file) return;

    try {
      setUploading(true);
      setError(null);
      setProgress(0);
      
      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      
      // Upload file with progress tracking
      const response = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setProgress(percentCompleted);
          }
        }
      });
      
      const uploadedUrl = response.data.url;
      setImageUrl(uploadedUrl);
      
      if (onSuccess) {
        onSuccess(uploadedUrl);
      }
      
      return uploadedUrl;
    } catch (err) {
      console.error('Error uploading image:', err);
      
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to upload image';
      
      setError(errorMessage);
      
      if (onError) {
        onError(new Error(errorMessage));
      }
      
      return null;
    } finally {
      setUploading(false);
    }
  };

  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const clearImage = () => {
    setImageUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return {
    uploading,
    error,
    progress,
    imageUrl,
    fileInputRef,
    uploadImage,
    triggerFileSelect,
    clearImage,
    setImageUrl
  };
}