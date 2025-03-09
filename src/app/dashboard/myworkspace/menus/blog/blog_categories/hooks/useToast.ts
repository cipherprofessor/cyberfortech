// src/app/dashboard/myworkspace/menus/blog/blog_categories/hooks/useToast.ts
import { 
    Toast, 
    ToastActionElement, 
    ToastProps 
  } from "@/components/ui/toast";
  
  type ToasterToast = ToastProps & {
    id: string;
    action?: ToastActionElement;
  };
  
  export type ToastType = 'default' | 'destructive';
  
  export const useToast = () => {
    const showToast = (title: string, description?: string, type: ToastType = 'default') => {
      // This is a proxy function for the actual toast implementation
      // For now, we're using console.log for demonstration purposes
      console.log(`[Toast] ${type.toUpperCase()}: ${title} - ${description || ''}`);
      
      // In a real implementation, you would dispatch a toast event or update a toast state
      // For example with a toast context:
      // dispatch({ type: "ADD_TOAST", toast: { id: new Date().getTime().toString(), title, description, type } });
    };
  
    return { showToast };
  };