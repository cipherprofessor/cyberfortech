import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSignIn } from '@clerk/nextjs';

// Types
import { SocialAuthProps } from '../types';

// Styles
import styles from './SocialAuth.module.scss';

const SocialAuth: React.FC<SocialAuthProps> = ({
  onSuccess,
  onError,
  redirectUrl = '/dashboard',
  className = ''
}) => {
  const { isLoaded, signIn } = useSignIn();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isAppleLoading, setIsAppleLoading] = useState(false);

  // Handle Google auth
  const handleGoogleAuth = async () => {
    if (!isLoaded || !signIn) return;
    
    setIsGoogleLoading(true);
    
    try {
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/sso-callback',
        redirectUrlComplete: redirectUrl,
      });
      // No need to set success message since we're redirecting
    } catch (err) {
      const error = err as Error;
      if (onError) onError(error);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Handle Apple auth
  const handleAppleAuth = async () => {
    if (!isLoaded || !signIn) return;
    
    setIsAppleLoading(true);
    
    try {
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_apple',
        redirectUrl: '/sso-callback',
        redirectUrlComplete: redirectUrl,
      });
      // No need to set success message since we're redirecting
    } catch (err) {
      const error = err as Error;
      if (onError) onError(error);
    } finally {
      setIsAppleLoading(false);
    }
  };

  return (
    <div className={`${styles.socialAuth} ${className}`}>
      <motion.button
        type="button"
        className={styles.googleButton}
        onClick={handleGoogleAuth}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={isGoogleLoading || isAppleLoading}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
          <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
          <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
          <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
        </svg>
        <span>{isGoogleLoading ? 'Connecting...' : 'Continue with Google'}</span>
      </motion.button>

      <motion.button
        type="button"
        className={styles.appleButton}
        onClick={handleAppleAuth}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={isGoogleLoading || isAppleLoading}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
          <path d="M14.767 9.023c-.021-2.12 1.736-3.152 1.816-3.2-1.01-1.481-2.523-1.68-3.05-1.684-1.293-.132-2.54.768-3.195.768-.659 0-1.672-.756-2.752-.732-1.406.023-2.707.825-3.43 2.082-1.473 2.551-.374 6.312 1.043 8.382.707 1.011 1.54 2.142 2.63 2.102 1.063-.044 1.46-.678 2.741-.678 1.276 0 1.645.678 2.76.654 1.145-.021 1.865-1.03 2.552-2.051.822-1.171 1.152-2.324 1.166-2.383-.026-.01-2.22-.847-2.241-3.37-.013-1.772 1.451-2.615 1.518-2.67-.834-1.228-2.13-1.364-2.59-1.39-1.17-.088-2.237.639-2.827.639-.65 0-1.58-.639-2.625-.62z" fill="currentColor"/>
        </svg>
        <span>{isAppleLoading ? 'Connecting...' : 'Continue with Apple'}</span>
      </motion.button>
    </div>
  );
};

export default SocialAuth;