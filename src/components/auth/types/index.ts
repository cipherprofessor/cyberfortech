import { ReactNode } from 'react';

// Auth Card Props
export interface AuthCardProps {
  className?: string;
  mode?: 'signin' | 'signup';
  brandName?: string;
  brandLogo?: string;
  brandTagline?: string;
  redirectUrl?: string;
  backgroundImage?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  defaultRole?: string;
}

// Sign In Form Props
export interface SignInFormProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  redirectUrl?: string;
  className?: string;
  onToggleMode?: () => void;
}

// Sign Up Form Props
export interface SignUpFormProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  redirectUrl?: string;
  className?: string;
  onToggleMode?: () => void;
  defaultRole?: string;
}

// Verification Form Props
export interface VerificationFormProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  redirectUrl?: string;
  className?: string;
  onBackToSignUp?: () => void;
}

// Social Auth Props
export interface SocialAuthProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  redirectUrl?: string;
  className?: string;
}

// Auth Illustration Props
export interface AuthIllustrationProps {
  backgroundImage?: string;
  brandTagline?: string;
  description?: string;
  className?: string;
}

// Common form data types
export interface SignInFormData {
  email: string;
  password: string;
}

export interface SignUpFormData {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

// Password validation type
export interface PasswordValidation {
  length: boolean;
  number: boolean;
  lowercase: boolean;
  uppercase: boolean;
}

// KPI Card Props (preserved from your original types)
export interface KPICardProps {
  title: string;
  value: string | number;
  change: number;
  icon: ReactNode;
  iconType: 'users' | 'revenue' | 'instructors' | 'courses' | 'certifications' | 'leads';
  className?: string;
}

// Clerk types for better type safety
export type ClerkSignUpStatus = 
  | 'complete'
  | 'needs_identifier'
  | 'needs_email_verification'
  | 'needs_phone_verification'
  | 'needs_username'
  | 'needs_password';

export type ClerkVerificationStatus =
  | 'verified'
  | 'expired'
  | 'failed'
  | 'needs_verification';