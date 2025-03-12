// src/app/dashboard/myworkspace/menus/blog/blog_categories/hooks/useToast.ts
"use client";

import { useToast as useToastHook } from "@/hooks/use-toast";

export const useToast = () => {
  const { toast } = useToastHook();

  const showToast = (
    title: string, 
    description: string, 
    variant: "default" | "destructive" = "default"
  ) => {
    toast({
      title,
      description,
      variant,
    });
  };

  return { showToast };
};