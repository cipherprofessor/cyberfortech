import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useSignUp } from '@clerk/nextjs';
import { ArrowRight, Check, X, ArrowLeft } from 'lucide-react';

// Types
import { VerificationFormProps } from '../types';

// Styles
import styles from './VerificationForm.module.scss';

const VerificationForm: React.FC<VerificationFormProps> = ({
  onSuccess,
  onError,
  redirectUrl = '/dashboard',
  className = '',
  onBackToSignUp
}) => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Handle verification code input
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVerificationCode(e.target.value);
    
    // Clear error when user starts typing again
    if (error) setError(null);
  };

  // Handle verification submission
  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoaded || !signUp) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code: verificationCode
      });
      
      if (result.status === 'complete') {
        setSuccessMessage('Email verified successfully!');
        
        // Set the user session if available
        if (result.createdSessionId) {
          await setActive({ session: result.createdSessionId });
        }
        
        setTimeout(() => {
          if (onSuccess) onSuccess();
          router.push(redirectUrl);
        }, 1500);
      } else {
        setError('Verification failed. Please check the code and try again.');
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Failed to verify email');
      if (onError) onError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle resend verification code
  const handleResendCode = async () => {
    if (!isLoaded || !signUp) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const result = await signUp.prepareEmailAddressVerification({
        strategy: 'email_code'
      });
      
      if (result.status === 'needs_verification') {
        setSuccessMessage('Verification code resent to your email.');
      } else {
        setError('Failed to resend verification code.');
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Failed to resend verification code');
      if (onError) onError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle back to sign up
  const handleBackToSignUp = () => {
    if (onBackToSignUp) onBackToSignUp();
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="verification"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className={`${styles.formContainer} ${className}`}
      >
        <button 
          onClick={handleBackToSignUp}
          className={styles.backButton}
          disabled={isLoading}
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>

        <h2 className={styles.authTitle}>Verify Your Email</h2>
        <p className={styles.authSubtitle}>
          We've sent a verification code to your email.
          Please enter it below to complete your registration.
        </p>

        {error && (
          <motion.div 
            className={styles.errorMessage}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <X size={16} />
            <span>{error}</span>
          </motion.div>
        )}

        {successMessage && (
          <motion.div 
            className={styles.successMessage}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Check size={16} />
            <span>{successMessage}</span>
          </motion.div>
        )}

        <form onSubmit={handleVerification} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="verificationCode" className={styles.inputLabel}>Verification Code</label>
            <input
              id="verificationCode"
              type="text"
              name="verificationCode"
              placeholder="Enter verification code"
              className={styles.verificationInput}
              value={verificationCode}
              onChange={handleCodeChange}
              required
              autoComplete="one-time-code"
              autoFocus
            />
          </div>

          <motion.button
            type="submit"
            className={styles.submitButton}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading || !verificationCode}
          >
            {isLoading ? 'Verifying...' : 'Verify Email'}
            <ArrowRight size={16} className={styles.buttonIcon} />
          </motion.button>
        </form>

        <div className={styles.resendCode}>
          <p>Didn't receive the code?</p>
          <button 
            type="button" 
            onClick={handleResendCode}
            className={styles.resendButton}
            disabled={isLoading}
          >
            Resend Code
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VerificationForm;