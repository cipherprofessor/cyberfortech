import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useSignUp } from '@clerk/nextjs';
import { Eye, EyeOff, ArrowRight, Mail, Lock, User, Check, X } from 'lucide-react';

// Components
import SocialAuth from '../SocialAuth';

// Types
import { SignUpFormProps, SignUpFormData, PasswordValidation, ClerkSignUpStatus } from '../types';

// Styles
import styles from './SignUpForm.module.scss';

interface Props extends SignUpFormProps {
  onVerificationNeeded?: () => void;
}

const SignUpForm: React.FC<Props> = ({
  onSuccess,
  onError,
  redirectUrl = '/dashboard',
  className = '',
  onToggleMode,
  defaultRole = 'student',
  onVerificationNeeded
}) => {
  const { isLoaded, signUp } = useSignUp();
  const router = useRouter();
  
  const [formData, setFormData] = useState<SignUpFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [validations, setValidations] = useState<PasswordValidation>({
    length: false,
    number: false,
    lowercase: false,
    uppercase: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Validate password as user types
  useEffect(() => {
    const hasLength = formData.password?.length >= 8;
    const hasNumber = /\d/.test(formData.password || '');
    const hasLowercase = /[a-z]/.test(formData.password || '');
    const hasUppercase = /[A-Z]/.test(formData.password || '');

    setValidations({
      length: hasLength,
      number: hasNumber,
      lowercase: hasLowercase,
      uppercase: hasUppercase
    });
  }, [formData.password]);

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

    if (!formData.firstName) {
      setError('First name is required');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    // Check password strength
    if (!(validations.length && validations.number && validations.lowercase && validations.uppercase)) {
      setError('Password does not meet requirements');
      return false;
    }

    return true;
  };

  // Handle sign up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoaded || !signUp) return;
    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await signUp.create({
        firstName: formData.firstName,
        lastName: formData.lastName,
        emailAddress: formData.email,
        password: formData.password,
        // Include default user role in unsafeMetadata
        unsafeMetadata: {
          role: defaultRole
        }
      });

      // Check for various status types
      if (result.status === 'complete') {
        setSuccessMessage('Account created successfully!');
        setTimeout(() => {
          if (onToggleMode) onToggleMode();
        }, 2000);
        if (onSuccess) onSuccess();
      } else if (result.status === 'needs_email_verification') {
        setSuccessMessage('Verification email sent!');
        if (onVerificationNeeded) {
          setTimeout(() => {
            onVerificationNeeded();
          }, 1500);
        } else {
          setError('Please verify your email to continue');
        }
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Failed to sign up');
      if (onError) onError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="signup"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className={`${styles.formContainer} ${className}`}
      >
        <h2 className={styles.authTitle}>Create an Account</h2>
        <p className={styles.authSubtitle}>
          Fill in your details to get started
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

        <form onSubmit={handleSignUp} className={styles.form}>
          <div className={styles.nameRow}>
            <div className={styles.inputGroup}>
              <label htmlFor="firstName" className={styles.inputLabel}>First Name</label>
              <div className={styles.inputWrapper}>
                <User size={16} className={styles.inputIcon} />
                <input
                  id="firstName"
                  type="text"
                  name="firstName"
                  placeholder="John"
                  className={styles.input}
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className={styles.inputGroup}>
              <label htmlFor="lastName" className={styles.inputLabel}>Last Name</label>
              <div className={styles.inputWrapper}>
                <User size={16} className={styles.inputIcon} />
                <input
                  id="lastName"
                  type="text"
                  name="lastName"
                  placeholder="Doe"
                  className={styles.input}
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

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

          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword" className={styles.inputLabel}>Confirm Password</label>
            <div className={styles.inputWrapper}>
              <Lock size={16} className={styles.inputIcon} />
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="••••••••"
                className={styles.input}
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className={styles.passwordRequirements}>
            <p className={styles.requirementsTitle}>Password must have:</p>
            <ul className={styles.requirementsList}>
              <li className={validations.length ? styles.valid : styles.invalid}>
                <span className={styles.validationIcon}>{validations.length ? <Check size={12} /> : <X size={12} />}</span>
                At least 8 characters
              </li>
              <li className={validations.number ? styles.valid : styles.invalid}>
                <span className={styles.validationIcon}>{validations.number ? <Check size={12} /> : <X size={12} />}</span>
                At least 1 number (0-9)
              </li>
              <li className={validations.lowercase ? styles.valid : styles.invalid}>
                <span className={styles.validationIcon}>{validations.lowercase ? <Check size={12} /> : <X size={12} />}</span>
                At least 1 lowercase letter (a-z)
              </li>
              <li className={validations.uppercase ? styles.valid : styles.invalid}>
                <span className={styles.validationIcon}>{validations.uppercase ? <Check size={12} /> : <X size={12} />}</span>
                At least 1 uppercase letter (A-Z)
              </li>
            </ul>
          </div>

          <motion.button
            type="submit"
            className={styles.submitButton}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
          >
            {isLoading ? 'Signing Up...' : 'Sign Up'}
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
          <p>Already have an account?</p>
          <button 
            type="button" 
            onClick={onToggleMode}
            className={styles.switchModeButton}
          >
            Sign In
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SignUpForm;