// src/app/dashboard/myworkspace/menus/blog/blog_categories/hooks/useToast.ts
"use client";

import { showToast, toast as mohsinToast, ToastVariant } from "@/components/ui/mohsin-toast";

// Define the legacy variant type to include 'destructive'
type LegacyVariant = ToastVariant | "destructive";

export const useToast = () => {
  const showToastNotification = (
    title: string, 
    description: string, 
    variant: LegacyVariant = "default"
  ) => {
    // Map existing variant names to new ones if needed
    let mappedVariant: ToastVariant = variant as ToastVariant;
    
    // If you were using 'destructive' in your old system, map it to 'error'
    if (variant === 'destructive') {
      mappedVariant = 'error';
    }
    
    // Use the new showToast function
    showToast(title, description, mappedVariant);
  };

  return { showToast: showToastNotification };
};