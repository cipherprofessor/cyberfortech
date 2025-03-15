import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSignIn } from '@clerk/nextjs';
import { Eye, EyeOff, ArrowRight, Mail, Lock, Check, X } from 'lucide-react';

// Components
import SocialAuth from '../SocialAuth';

// Types
import { SignInFormProps, SignInFormData } from '../types';

// Styles
import styles from './SignInForm.module.scss';

const SignInForm: React.FC<SignInFormProps> = ({
  onSuccess,
  onError,
  redirectUrl = '/dashboard',
  className = '',
  onToggleMode
}) => {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();
  
  const [formData, setFormData] = useState<SignInFormData>({
    email: '',
    password: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing again
    if (error) setError(null);
  };

  // Validate form
  const validateForm = (): boolean => {
    if (!formData.email) {
      setError('Email is required');
      return false;
    }

    if (!formData.password) {
      setError('Password is required');
      return false;
    }

    return true;
  };

  // Handle sign in
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoaded) return;
    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn.create({
        identifier: formData.email,
        password: formData.password,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        setSuccessMessage('Successfully signed in!');
        if (onSuccess) onSuccess();
        router.push(redirectUrl);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Failed to sign in');
      if (onError) onError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="signin"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className={`${styles.formContainer} ${className}`}
      >
        <h2 className={styles.authTitle}>Welcome Back</h2>
        <p className={styles.authSubtitle}>
          Enter your credentials to access your account
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

        <form onSubmit={handleSignIn} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.inputLabel}>Email</label>
            <div className={styles.inputWrapper}>
              <Mail size={16} className={styles.inputIcon} />
              <input
                id="email"
                type="email"
                name="email"
                placeholder="your@email.com"
                className={styles.input}
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.inputLabel}>Password</label>
            <div className={styles.inputWrapper}>
              <Lock size={16} className={styles.inputIcon} />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                className={styles.input}
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className={styles.forgotPassword}>
            <Link href="/forgot-password" className={styles.forgotPasswordLink}>
              Forgot Password?
            </Link>
          </div>

          <motion.button
            type="submit"
            className={styles.submitButton}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
            <ArrowRight size={16} className={styles.buttonIcon} />
          </motion.button>
        </form>

        <div className={styles.divider}>
          <span className={styles.dividerLine}></span>
          <span className={styles.dividerText}>OR</span>
          <span className={styles.dividerLine}></span>
        </div>

        <SocialAuth 
          onSuccess={onSuccess}
          onError={onError}
          redirectUrl={redirectUrl}
        />

        <div className={styles.switchMode}>
          <p>Don't have an account?</p>
          <button 
            type="button" 
            onClick={onToggleMode}
            className={styles.switchModeButton}
          >
            Sign Up
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SignInForm;