# MohsinToaster

A beautiful, flexible, and powerful toast notification system for React and Next.js applications.

![MohsinToaster Demo](https://your-project-url.com/mohsin-toaster-demo.gif)

## Features

- 🎨 **8 Beautiful Variants** - Default, Success, Error, Warning, Info, Discovery, Notification, Update
- 🖌️ **3 Style Options** - Solid, Outline, Glass (frosted glass effect)
- 📏 **3 Size Options** - Small, Medium, Large
- 📍 **6 Position Options** - Top/bottom, left/right/center
- ⚡ **Rich Animations** - Smooth transitions, progress bars, and interactive effects
- 🔄 **Updatable Toasts** - Change content, style, or type after creation
- ⏱️ **Flexible Duration Control** - Custom timing or infinite duration
- 🎯 **Interactive Elements** - Add custom action buttons to toasts
- 🌓 **Dark/Light Mode Support** - Automatic theme detection and adaptation
- 📱 **Responsive Design** - Looks great on mobile and desktop
- 🔧 **TypeScript Support** - Fully typed for a better developer experience

## Installation

1. Copy the `mohsin-toast` directory to your project:
   ```
   src/components/ui/mohsin-toast/
   ```

2. Make sure you have the required dependencies:
   ```bash
   npm install framer-motion @radix-ui/react-toast class-variance-authority lucide-react
   ```

3. Add the `MohsinToaster` component to your layout:
   ```tsx
   // In your layout.tsx
   import { MohsinToaster } from "@/components/ui/mohsin-toast";

   export default function RootLayout({ children }) {
     return (
       <html lang="en">
         <body>
           {children}
           <MohsinToaster position="bottom-right" />
         </body>
       </html>
     );
   }
   ```

## Basic Usage

### Simple Toast Notifications

```tsx
import { showToast } from "@/components/ui/mohsin-toast";

// Default toast
showToast("Notification", "This is a default toast message");

// Success toast
showToast("Success!", "Your action was completed successfully.", "success");

// Error toast
showToast("Error!", "Something went wrong. Please try again.", "error");

// Warning toast
showToast("Warning!", "This action might have consequences.", "warning");

// Info toast
showToast("Info", "Here's some information for you.", "info");

// Discovery toast
showToast("Tip", "Did you know you can customize these toasts?", "discovery");

// Notification toast
showToast("New Message", "You have a new message in your inbox.", "notification");

// Update toast
showToast("Update Available", "A new version is ready to install.", "update");
```

### With Custom Style, Size and Duration

```tsx
showToast(
  "Custom Toast", 
  "This toast has custom styling and duration.",
  "success",     // variant
  10000,         // duration in ms (10 seconds)
  "glass",       // style: "solid", "outline", or "glass"
  "lg",          // size: "sm", "md", or "lg"
  true,          // showIcon
  true           // showProgress
);
```

### Using Shorthand Methods

```tsx
import { toast } from "@/components/ui/mohsin-toast";

// Success toast
toast.success({
  title: "Success!",
  description: "Your action was completed successfully.",
  style: "glass"
});

// Error toast
toast.error({
  title: "Error!",
  description: "Something went wrong. Please try again."
});

// Warning toast
toast.warning({
  title: "Warning!",
  description: "This action might have consequences."
});

// Info toast
toast.info({
  title: "Info",
  description: "Here's some information for you."
});

// Discovery toast
toast.discovery({
  title: "Tip",
  description: "Did you know you can customize these toasts?"
});

// Notification toast
toast.notification({
  title: "New Message",
  description: "You have a new message in your inbox."
});

// Update toast
toast.update({
  title: "Update Available",
  description: "A new version is ready to install."
});
```

### Using the Toast Hook

```tsx
import { useToast } from "@/components/ui/mohsin-toast";

function MyComponent() {
  const { toast } = useToast();
  
  const handleClick = () => {
    toast({
      title: "Toast Title",
      description: "Toast description or message",
      variant: "success",
      duration: 5000, // 5 seconds
      style: "glass",
      size: "md"
    });
  };
  
  return <button onClick={handleClick}>Show Toast</button>;
}
```

## Advanced Usage

### Updating Toast Content

```tsx
import { toast } from "@/components/ui/mohsin-toast";

function showDownloadProgress() {
  const { update } = toast({
    title: "Downloading...",
    description: "Starting download",
    variant: "info",
    duration: Infinity // Won't auto-dismiss
  });
  
  // Update after 2 seconds
  setTimeout(() => {
    update({
      title: "Downloading...",
      description: "Download 50% complete"
    });
  }, 2000);
  
  // Change to success after 4 seconds
  setTimeout(() => {
    update({
      title: "Success!",
      description: "Download complete",
      variant: "success",
      duration: 3000 // Auto-dismiss after 3 seconds
    });
  }, 4000);
}
```

### Adding Action Buttons

```tsx
import { toast } from "@/components/ui/mohsin-toast";

function showConfirmationToast() {
  const { dismiss } = toast({
    title: "Confirm Action",
    description: "Are you sure you want to proceed?",
    variant: "warning",
    duration: Infinity, // Won't auto-dismiss
    action: (
      <div className="flex gap-2 mt-2">
        <button 
          onClick={() => {
            // Handle confirmation
            toast.success({ 
              title: "Confirmed!", 
              description: "Action has been completed" 
            });
            dismiss(); // Dismiss the confirmation toast
          }}
          className="px-3 py-1 bg-white bg-opacity-20 rounded-md hover:bg-opacity-30 transition-all"
        >
          Yes
        </button>
        <button 
          onClick={() => {
            // Handle cancellation
            toast.error({ 
              title: "Cancelled", 
              description: "Action has been cancelled" 
            });
            dismiss(); // Dismiss the confirmation toast
          }}
          className="px-3 py-1 bg-transparent border border-current rounded-md hover:bg-white hover:bg-opacity-10 transition-all"
        >
          No
        </button>
      </div>
    )
  });
}
```

### Persistent Toast with Manual Dismissal

```tsx
const { dismiss } = toast({
  title: "Persistent Notification",
  description: "This toast won't disappear until you dismiss it or call the dismiss function.",
  variant: "info",
  duration: Infinity,
  showProgress: false // Hide progress bar for persistent toasts
});

// Later, to dismiss programmatically:
dismiss();
```

### Custom Icons

```tsx
toast({
  title: "Custom Icon",
  description: "This toast has a custom icon element.",
  variant: "default",
  icon: (
    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
      <span className="text-white text-xs font-bold">M</span>
    </div>
  )
});
```

## Customization Options

### Toaster Component Props

The `MohsinToaster` component accepts the following props:

```tsx
<MohsinToaster 
  position="bottom-right"    // Default position for all toasts
  defaultStyle="glass"       // Default style for all toasts
  defaultSize="md"           // Default size for all toasts
  showIcons={true}           // Whether to show icons by default
  showProgress={true}        // Whether to show progress bars by default
/>
```

### Toast Options

The toast function accepts the following options:

```tsx
toast({
  title: string;                // Toast title
  description?: string;         // Optional description/message
  variant?: ToastVariant;       // "default" | "success" | "error" | "warning" | "info" | "discovery" | "notification" | "update"
  duration?: number;            // Duration in milliseconds (default: 5000)
  style?: ToastStyle;           // "solid" | "outline" | "glass"
  size?: ToastSize;             // "sm" | "md" | "lg"
  position?: ToastPosition;     // Override default position for this specific toast
  action?: React.ReactNode;     // Optional action buttons/components
  icon?: React.ReactNode;       // Custom icon element
  showIcon?: boolean;           // Whether to show the icon
  showProgress?: boolean;       // Whether to show the progress bar
});
```

## Examples in Different Contexts

### Form Submission

```tsx
import { showToast } from "@/components/ui/mohsin-toast";

async function handleSubmit(event) {
  event.preventDefault();
  
  try {
    setSubmitting(true);
    
    // Form validation
    if (!isValid) {
      showToast("Warning", "Please fill in all required fields", "warning");
      return;
    }
    
    // API call
    await submitForm(formData);
    
    // Success message
    showToast("Success", "Form submitted successfully", "success");
    
    // Reset form
    resetForm();
    
  } catch (error) {
    // Error handling
    showToast("Error", error.message || "Failed to submit form", "error");
  } finally {
    setSubmitting(false);
  }
}
```

### Data Fetching

```tsx
import { toast } from "@/components/ui/mohsin-toast";

async function fetchData() {
  const { dismiss, update } = toast({
    title: "Loading",
    description: "Fetching your data...",
    variant: "info",
    duration: Infinity
  });
  
  try {
    const data = await fetchFromAPI();
    
    update({
      title: "Success",
      description: "Data loaded successfully",
      variant: "success",
      duration: 3000
    });
    
    return data;
  } catch (error) {
    update({
      title: "Error",
      description: error.message || "Failed to load data",
      variant: "error",
      duration: 5000
    });
  }
}
```

### Authentication Flow

```tsx
import { showToast } from "@/components/ui/mohsin-toast";

async function handleLogin(credentials) {
  try {
    // Login API call
    await loginUser(credentials);
    
    // Success message
    showToast("Welcome back!", "You've successfully logged in", "success");
    
    // Redirect to dashboard
    router.push('/dashboard');
    
  } catch (error) {
    // Handle different error types
    if (error.code === 'auth/wrong-password') {
      showToast("Login Failed", "Incorrect email or password", "error");
    } else if (error.code === 'auth/too-many-requests') {
      showToast("Too Many Attempts", "Please try again later", "warning");
    } else {
      showToast("Error", "An unexpected error occurred", "error");
    }
  }
}
```

### Feature Announcement

```tsx
import { toast } from "@/components/ui/mohsin-toast";

function announceNewFeature() {
  toast.discovery({
    title: "New Feature Available",
    description: "Check out our new dashboard redesign! Click to learn more.",
    duration: 8000,
    style: "glass",
    action: (
      <button 
        onClick={() => window.open('/whats-new', '_blank')}
        className="px-3 py-1 mt-2 bg-white bg-opacity-20 rounded-md hover:bg-opacity-30 transition-all"
      >
        Learn More
      </button>
    )
  });
}

// Call this when appropriate, e.g., after login or on dashboard load
setTimeout(announceNewFeature, 1000);
```

### CRUD Operations

```tsx
import { showToast } from "@/components/ui/mohsin-toast";

// Create
async function createItem(data) {
  try {
    await api.post('/items', data);
    showToast("Item Created", "Your new item has been created successfully", "success");
    refreshList();
  } catch (error) {
    showToast("Creation Failed", error.message || "Failed to create item", "error");
  }
}

// Update
async function updateItem(id, data) {
  try {
    await api.put(`/items/${id}`, data);
    showToast("Item Updated", "Your item has been updated successfully", "success");
    refreshList();
  } catch (error) {
    showToast("Update Failed", error.message || "Failed to update item", "error");
  }
}

// Delete
async function deleteItem(id) {
  const { dismiss } = toast({
    title: "Confirm Deletion",
    description: "Are you sure you want to delete this item?",
    variant: "warning",
    duration: Infinity,
    action: (
      <div className="flex gap-2 mt-2">
        <button 
          onClick={async () => {
            dismiss();
            try {
              await api.delete(`/items/${id}`);
              showToast("Item Deleted", "Your item has been deleted successfully", "success");
              refreshList();
            } catch (error) {
              showToast("Deletion Failed", error.message || "Failed to delete item", "error");
            }
          }}
          className="px-3 py-1 bg-white bg-opacity-20 rounded-md hover:bg-opacity-30 transition-all"
        >
          Yes, Delete
        </button>
        <button 
          onClick={() => dismiss()}
          className="px-3 py-1 bg-transparent border border-current rounded-md hover:bg-white hover:bg-opacity-10 transition-all"
        >
          Cancel
        </button>
      </div>
    )
  });
}
```

## Migration from Existing Toast Systems

If you're migrating from an existing toast system, you can create a wrapper hook to maintain compatibility:

```tsx
// src/app/your-path/hooks/useToast.ts
"use client";

import { showToast, toast as mohsinToast, ToastVariant } from "@/components/ui/mohsin-toast";

// Define legacy variant types if needed
type LegacyVariant = ToastVariant | "destructive";

export const useToast = () => {
  const showToastNotification = (
    title: string, 
    description: string, 
    variant: LegacyVariant = "default"
  ) => {
    // Map legacy variants to new variants
    let mappedVariant: ToastVariant = variant as ToastVariant;
    
    if (variant === 'destructive') {
      mappedVariant = 'error';
    }
    
    showToast(title, description, mappedVariant, 5000, "glass");
  };

  return { showToast: showToastNotification };
};
```

## Browser Support

The MohsinToaster system supports all modern browsers:

- Chrome, Firefox, Safari, Edge (latest versions)
- Works on desktop and mobile devices

## Accessibility

This toast system is built on Radix UI's toast primitives, which provide:

- ARIA attributes for screen readers
- Keyboard navigation
- Focus management
- Swipe-to-dismiss functionality

## TypeScript Types

```typescript
// Available toast variants
type ToastVariant = 
  | "default" 
  | "success" 
  | "error" 
  | "warning" 
  | "info" 
  | "discovery" 
  | "notification" 
  | "update";

// Available toast positions
type ToastPosition = 
  | "top-right" 
  | "top-left" 
  | "bottom-right" 
  | "bottom-left" 
  | "top-center" 
  | "bottom-center";

// Toast styles
type ToastStyle = "solid" | "outline" | "glass";

// Toast sizes
type ToastSize = "sm" | "md" | "lg";

// Toast options
interface ToastOptions {
  title: React.ReactNode;
  description?: React.ReactNode;
  variant?: ToastVariant;
  duration?: number;
  style?: ToastStyle;
  size?: ToastSize;
  position?: ToastPosition;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  showIcon?: boolean;
  showProgress?: boolean;
}

// Return value from toast function
interface ToastReturn {
  id: string;
  dismiss: () => void;
  update: (props: Partial<ToastOptions>) => void;
}

// MohsinToaster props
interface MohsinToasterProps {
  position?: ToastPosition;
  defaultStyle?: ToastStyle;
  defaultSize?: ToastSize;
  showIcons?: boolean;
  showProgress?: boolean;
}
```

## Conclusion

MohsinToaster provides a beautiful, flexible, and powerful toast notification system for your React and Next.js applications. With its rich set of features and customization options, it can handle everything from simple notifications to complex interactive dialogues.

Created by Mohsin





Installation and Setup
The documentation details how to add the MohsinToaster to your project and integrate it into your layout file.

Basic Usage Examples
tsxCopyimport { showToast } from "@/components/ui/mohsin-toast";

// Success toast
showToast("Success!", "Your changes have been saved successfully.", "success");

// Error toast
showToast("Error!", "Failed to connect to the server.", "error");

// Warning toast
showToast("Warning!", "This action cannot be undone.", "warning");
Advanced Use Cases
The documentation includes examples for:

Forms and validation feedback
API calls and data fetching
Authentication flows
CRUD operations
Feature announcements
Interactive confirmations

Example: Form Submission
tsxCopyimport { showToast } from "@/components/ui/mohsin-toast";

async function handleSubmit(event) {
  event.preventDefault();
  
  try {
    // Form validation
    if (!isValid) {
      showToast("Warning", "Please fill in all required fields", "warning");
      return;
    }
    
    // API call
    await submitForm(formData);
    
    // Success message
    showToast("Success", "Form submitted successfully", "success");
    
  } catch (error) {
    // Error handling
    showToast("Error", error.message || "Failed to submit form", "error");
  }
}
Example: Delete Confirmation
tsxCopyimport { toast } from "@/components/ui/mohsin-toast";

function confirmDelete(itemId) {
  const { dismiss } = toast({
    title: "Confirm Deletion",
    description: "Are you sure you want to delete this item?",
    variant: "warning",
    duration: Infinity,
    action: (
      <div className="flex gap-2 mt-2">
        <button 
          onClick={async () => {
            dismiss();
            try {
              await deleteItem(itemId);
              showToast("Item Deleted", "Successfully deleted", "success");
            } catch (error) {
              showToast("Failed", "Could not delete item", "error");
            }
          }}
          className="px-3 py-1 bg-white bg-opacity-20 rounded-md"
        >
          Yes, Delete
        </button>
        <button 
          onClick={() => dismiss()}
          className="px-3 py-1 border border-current rounded-md"
        >
          Cancel
        </button>
      </div>
    )
  });
}
Custom Styling Options
The documentation covers all the available customization options:

8 different variants (default, success, error, warning, info, discovery, notification, update)
3 style options (solid, outline, glass)
3 size options (small, medium, large)
6 position options
Custom icons and actions

TypeScript Support
The documentation includes all TypeScript type definitions for perfect type safety and autocompletion.
Migration Guide
There's a section dedicated to migrating from existing toast systems, including how to maintain backward compatibility with your current code.

These examples and documentation should help you seamlessly integrate MohsinToaster throughout your application. Feel free to refer to the full documentation file for more detailed information and implementation examples.



Here's a quick guide to using the toast system in any file:

1. Basic Usage - Simple Toast

import { showToast } from "@/components/ui/mohsin-toast";

// Basic toast with title, message, and variant
showToast("Title", "Your message here", "success");

2. Advanced Usage - Toast with Options

import { toast } from "@/components/ui/mohsin-toast";

// Using the toast function with more options
toast({
  title: "Hello",
  description: "Detailed message here",
  variant: "success", // "success" | "error" | "warning" | "info" | "discovery" | "notification" | "update"
  duration: 5000, // milliseconds
  style: "glass", // "solid" | "outline" | "glass"
  size: "md" // "sm" | "md" | "lg"
});


3. Shorthand Methods

import { toast } from "@/components/ui/mohsin-toast";

// Success toast
toast.success({
  title: "Success!",
  description: "Operation completed"
});

// Error toast
toast.error({
  title: "Error!",
  description: "Something went wrong"
});

// Warning toast
toast.warning({
  title: "Warning",
  description: "Please check your input"
});