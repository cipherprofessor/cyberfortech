import React from 'react';
import { LogIn, UserPlus } from 'lucide-react';
import { MohsinButton } from './MohsinButtons';

// Sign In Button with responsive classes through Tailwind
export const ResponsiveMohsinSignInButton = ({ 
  children = 'Sign In', 
  variant = 'outline',
  color = 'blue',
  className = '',
  ...props 
}) => (
  <MohsinButton 
    icon={LogIn} 
    iconPosition="left" 
    variant="outline"
    color="info"
    size="sm" 
    animation="pulse"
    className={`
      !border-[1px] !text-[#fff] 
      md:!h-8 md:!text-sm md:!rounded-md
      !h-7 !text-xs !rounded-sm !px-2
      ${className}
    `}
    {...props}
  >
    {children}
  </MohsinButton>
);

// Sign Up Button with responsive classes through Tailwind
export const ResponsiveMohsinSignUpButton = ({ 
  children = 'Sign Up', 
  variant = 'outline',
  color = 'secondary',
  className = '',
  ...props 
}) => (
  <MohsinButton 
    icon={UserPlus} 
    iconPosition="left" 
    variant="outline"
    color="secondary"
    size="sm" 
    animation="scale"
    className={`
      !border-1  !text-#17A2B8
      md:!h-8 md:!text-sm md:!rounded-md
      !h-7 !text-xs !rounded-sm !px-2
      ${className}
    `}
    {...props}
  >
    {children}
  </MohsinButton>
);