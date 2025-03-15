// // src/lib/types.ts

// import { ReactNode } from 'react';

// export interface KPICardProps {
//   title: string;
//   value: string | number;
//   change: number;
//   icon: ReactNode;
//   iconType: 'users' | 'revenue' | 'instructors' | 'courses' | 'certifications' | 'leads';
//   className?: string;
// }

// export interface AuthCardProps {
//   /**
//    * Additional CSS class for custom styling
//    */
//   className?: string;
  
//   /**
//    * Authentication mode to display
//    * @default 'signin'
//    */
//   mode?: 'signin' | 'signup';
  
//   /**
//    * Brand name to display in the component
//    * @default 'CyberFort Tech'
//    */
//   brandName?: string;
  
//   /**
//    * Path to brand logo image
//    * @default '/logo/logoown.png'
//    */
//   brandLogo?: string;
  
//   /**
//    * Tagline to display on the image side
//    * @default 'Empowering knowledge through technology'
//    */
//   brandTagline?: string;
  
//   /**
//    * URL to redirect after successful authentication
//    * @default '/dashboard'
//    */
//   redirectUrl?: string;
  
//   /**
//    * Path to background image for the image side
//    * @default '/images/auth-bg.jpg'
//    */
//   backgroundImage?: string;
  
//   /**
//    * Callback function on successful authentication
//    */
//   onSuccess?: () => void;
  
//   /**
//    * Callback function on authentication error
//    */
//   onError?: (error: Error) => void;
// }