// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import Link from 'next/link';
// import Image from 'next/image';
// import { useSignIn, useSignUp } from '@clerk/nextjs';
// import { useAuth } from '@/hooks/useAuth';
// import { useRouter } from 'next/navigation';
// import { useTheme } from 'next-themes';
// import { Eye, EyeOff, ArrowRight, Mail, Lock, User, Check, X } from 'lucide-react';
// import styles from './AuthCard.module.scss';

// interface AuthCardProps {
//   className?: string;
//   mode?: 'signin' | 'signup';
//   brandName?: string;
//   brandLogo?: string;
//   brandTagline?: string;
//   redirectUrl?: string;
//   backgroundImage?: string;
//   onSuccess?: () => void;
//   onError?: (error: Error) => void;
//   defaultRole?: string;
// }

// interface FormData {
//   firstName?: string;
//   lastName?: string;
//   email: string;
//   password: string;
//   confirmPassword?: string;
// }

// const AuthCard: React.FC<AuthCardProps> = ({
//   className = '',
//   mode = 'signin',
//   brandName = 'CyberFort Tech',
//   brandLogo = '/logo/logoown.png',
//   brandTagline = 'Empowering knowledge through technology',
//   redirectUrl = '/dashboard',
//   backgroundImage = '/images/auth-bg.jpg',
//   onSuccess,
//   onError,
//   defaultRole = 'student'
// }) => {
//   const { isLoaded: isSignInLoaded, signIn, setActive } = useSignIn();
//   const { isLoaded: isSignUpLoaded, signUp } = useSignUp();
//   const { isAuthenticated } = useAuth();
//   const router = useRouter();
//   const { theme } = useTheme();
  
//   const [isClient, setIsClient] = useState(false);
//   const [currentMode, setCurrentMode] = useState<'signin' | 'signup'>(mode);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
//   const [formData, setFormData] = useState<FormData>({
//     firstName: '',
//     lastName: '',
//     email: '',
//     password: '',
//     confirmPassword: ''
//   });

//   const [validations, setValidations] = useState({
//     length: false,
//     number: false,
//     lowercase: false,
//     uppercase: false
//   });
//   const [verificationStep, setVerificationStep] = useState<'none' | 'email_code'>('none');
// const [verificationCode, setVerificationCode] = useState('');

//   useEffect(() => {
//     setIsClient(true);
//     setCurrentMode(mode);
//   }, [mode]);

//   useEffect(() => {
//     if (isAuthenticated) {
//       router.push(redirectUrl);
//     }
//   }, [isAuthenticated, router, redirectUrl]);

//   useEffect(() => {
//     // Validate password as user types
//     const hasLength = formData.password?.length >= 8;
//     const hasNumber = /\d/.test(formData.password || '');
//     const hasLowercase = /[a-z]/.test(formData.password || '');
//     const hasUppercase = /[A-Z]/.test(formData.password || '');

//     setValidations({
//       length: hasLength,
//       number: hasNumber,
//       lowercase: hasLowercase,
//       uppercase: hasUppercase
//     });
//   }, [formData.password]);

//   const toggleMode = () => {
//     setCurrentMode(prev => prev === 'signin' ? 'signup' : 'signin');
//     setError(null);
//     setSuccessMessage(null);
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
    
//     // Clear error when user starts typing again
//     if (error) setError(null);
//   };

//   const validateForm = (): boolean => {
//     if (!formData.email) {
//       setError('Email is required');
//       return false;
//     }

//     if (!formData.password) {
//       setError('Password is required');
//       return false;
//     }

//     if (currentMode === 'signup') {
//       if (!formData.firstName) {
//         setError('First name is required');
//         return false;
//       }

//       if (formData.password !== formData.confirmPassword) {
//         setError('Passwords do not match');
//         return false;
//       }

//       // Check password strength
//       if (!(validations.length && validations.number && validations.lowercase && validations.uppercase)) {
//         setError('Password does not meet requirements');
//         return false;
//       }
//     }

//     return true;
//   };

//   const handleSignIn = async () => {
//     if (!isSignInLoaded) return;
//     if (!validateForm()) return;

//     setIsLoading(true);
//     setError(null);

//     try {
//       const result = await signIn.create({
//         identifier: formData.email,
//         password: formData.password,
//       });

//       if (result.status === 'complete') {
//         await setActive({ session: result.createdSessionId });
//         setSuccessMessage('Successfully signed in!');
//         if (onSuccess) onSuccess();
//         router.push(redirectUrl);
//       } else {
//         setError('Something went wrong. Please try again.');
//       }
//     } catch (err) {
//       const error = err as Error;
//       setError(error.message || 'Failed to sign in');
//       if (onError) onError(error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSignUp = async () => {
//     if (!isSignUpLoaded) return;
//     if (verificationStep === 'email_code') {
//       // Handle verification code submission
//       try {
//         setIsLoading(true);
        
//         const response = await signUp.attemptEmailAddressVerification({
//           code: verificationCode
//         });
        
//         if (response.status === 'complete') {
//           setSuccessMessage('Account verified successfully!');
//           // Set the user session
//           if (response.createdSessionId) {
//             await setActive({ session: response.createdSessionId });
//           }
          
//           setTimeout(() => {
//             if (onSuccess) onSuccess();
//             router.push(redirectUrl);
//           }, 1500);
//         } else {
//           setError('Verification failed. Please try again.');
//         }
//       } catch (err) {
//         const error = err as Error;
//         setError(error.message || 'Failed to verify email');
//         if (onError) onError(error);
//       } finally {
//         setIsLoading(false);
//       }
//       return;
//     }
  
//     if (!validateForm()) return;
  
//     setIsLoading(true);
//     setError(null);
  
//     try {
//       const result = await signUp.create({
//         firstName: formData.firstName,
//         lastName: formData.lastName,
//         emailAddress: formData.email,
//         password: formData.password,
//         // Include default user role in unsafeMetadata
//         unsafeMetadata: {
//           role: defaultRole
//         }
//       });
  
//       if (result.status === 'complete') {
//         setSuccessMessage('Account created successfully!');
//         setTimeout(() => {
//           setCurrentMode('signin');
//         }, 2000);
//         if (onSuccess) onSuccess();
//       } else if (result.status === 'needs_email_verification') {
//         // Start email verification
//         const verificationResult = await signUp.prepareEmailAddressVerification({
//           strategy: 'email_code'
//         });
        
//         if (verificationResult.status === 'needs_verification') {
//           setVerificationStep('email_code');
//           setSuccessMessage('Verification code sent to your email.');
//         } else {
//           setError('Failed to send verification code.');
//         }
//       } else {
//         setError('Something went wrong. Please try again.');
//       }
//     } catch (err) {
//       const error = err as Error;
//       setError(error.message || 'Failed to sign up');
//       if (onError) onError(error);
//     } finally {
//       setIsLoading(false);
//     }
//   };
  

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (currentMode === 'signin') {
//       handleSignIn();
//     } else {
//       handleSignUp();
//     }
//   };

//   // For 3rd party auth
//   const handleGoogleAuth = async () => {
//     if (!isSignInLoaded) return;
    
//     try {
//       const result = await signIn.authenticateWithRedirect({
//         strategy: 'oauth_google',
//         redirectUrl: '/sso-callback',
//         redirectUrlComplete: redirectUrl,
//       });
//     } catch (err) {
//       const error = err as Error;
//       setError(error.message || 'Failed to authenticate with Google');
//       if (onError) onError(error);
//     }
//   };

//   const handleAppleAuth = async () => {
//     if (!isSignInLoaded) return;
    
//     try {
//       await signIn.authenticateWithRedirect({
//         strategy: 'oauth_apple',
//         redirectUrl: '/sso-callback',
//         redirectUrlComplete: redirectUrl,
//       });
//     } catch (err) {
//       const error = err as Error;
//       setError(error.message || 'Failed to authenticate with Apple');
//       if (onError) onError(error);
//     }
//   };

//   // Apply theme-specific classes using JS logic instead of CSS selectors
//   const isDarkTheme = theme === 'dark';
//   const cardClass = `${styles.authCard} ${isDarkTheme ? styles.darkTheme : ''} ${className}`;
//   const formSideClass = `${styles.formSide} ${isDarkTheme ? styles.darkTheme : ''}`;
//   const imageSideClass = `${styles.imageSide} ${isDarkTheme ? styles.darkTheme : ''}`;

//   if (!isClient) {
//     return null; // Prevent hydration mismatch
//   }

//   const submitBtnText = isLoading
//     ? currentMode === 'signin' ? 'Signing In...' : 'Signing Up...'
//     : currentMode === 'signin' ? 'Sign In' : 'Sign Up';

//   return (
//     <div className={cardClass}>
//       <motion.div 
//         className={formSideClass}
//         initial={{ opacity: 0, x: -20 }}
//         animate={{ opacity: 1, x: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         <div className={styles.brandContainer}>
//           {brandLogo && (
//             <Image
//               src={brandLogo}
//               alt={brandName}
//               width={40}
//               height={40}
//               className={styles.brandLogo}
//             />
//           )}
//           <h1 className={styles.brandName}>{brandName}</h1>
//         </div>

//         <AnimatePresence mode="wait">
//           <motion.div
//             key={currentMode}
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -10 }}
//             transition={{ duration: 0.3 }}
//             className={styles.formContainer}
//           >
//             <h2 className={styles.authTitle}>
//               {currentMode === 'signin' ? 'Welcome Back' : 'Create an Account'}
//             </h2>
//             <p className={styles.authSubtitle}>
//               {currentMode === 'signin' 
//                 ? 'Enter your credentials to access your account' 
//                 : 'Fill in your details to get started'}
//             </p>

//             {error && (
//               <motion.div 
//                 className={styles.errorMessage}
//                 initial={{ opacity: 0, y: -10 }}
//                 animate={{ opacity: 1, y: 0 }}
//               >
//                 <X size={16} />
//                 <span>{error}</span>
//               </motion.div>
//             )}

//             {successMessage && (
//               <motion.div 
//                 className={styles.successMessage}
//                 initial={{ opacity: 0, y: -10 }}
//                 animate={{ opacity: 1, y: 0 }}
//               >
//                 <Check size={16} />
//                 <span>{successMessage}</span>
//               </motion.div>
//             )}

//             <form onSubmit={handleSubmit} className={styles.form}>
//               {currentMode === 'signup' && (
//                 <div className={styles.nameRow}>
//                   <div className={styles.inputGroup}>
//                     <label htmlFor="firstName" className={styles.inputLabel}>First Name</label>
//                     <div className={styles.inputWrapper}>
//                       <User size={16} className={styles.inputIcon} />
//                       <input
//                         id="firstName"
//                         type="text"
//                         name="firstName"
//                         placeholder="John"
//                         className={styles.input}
//                         value={formData.firstName}
//                         onChange={handleChange}
//                         required
//                       />
//                     </div>
//                   </div>
                  
//                   <div className={styles.inputGroup}>
//                     <label htmlFor="lastName" className={styles.inputLabel}>Last Name</label>
//                     <div className={styles.inputWrapper}>
//                       <User size={16} className={styles.inputIcon} />
//                       <input
//                         id="lastName"
//                         type="text"
//                         name="lastName"
//                         placeholder="Doe"
//                         className={styles.input}
//                         value={formData.lastName}
//                         onChange={handleChange}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               )}

//               <div className={styles.inputGroup}>
//                 <label htmlFor="email" className={styles.inputLabel}>Email</label>
//                 <div className={styles.inputWrapper}>
//                   <Mail size={16} className={styles.inputIcon} />
//                   <input
//                     id="email"
//                     type="email"
//                     name="email"
//                     placeholder="your@email.com"
//                     className={styles.input}
//                     value={formData.email}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>
//               </div>

//               <div className={styles.inputGroup}>
//                 <label htmlFor="password" className={styles.inputLabel}>Password</label>
//                 <div className={styles.inputWrapper}>
//                   <Lock size={16} className={styles.inputIcon} />
//                   <input
//                     id="password"
//                     type={showPassword ? "text" : "password"}
//                     name="password"
//                     placeholder="••••••••"
//                     className={styles.input}
//                     value={formData.password}
//                     onChange={handleChange}
//                     required
//                   />
//                   <button
//                     type="button"
//                     className={styles.passwordToggle}
//                     onClick={() => setShowPassword(!showPassword)}
//                     aria-label={showPassword ? "Hide password" : "Show password"}
//                   >
//                     {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
//                   </button>
//                 </div>
//               </div>

//               {currentMode === 'signup' && (
//                 <>
//                   <div className={styles.inputGroup}>
//                     <label htmlFor="confirmPassword" className={styles.inputLabel}>Confirm Password</label>
//                     <div className={styles.inputWrapper}>
//                       <Lock size={16} className={styles.inputIcon} />
//                       <input
//                         id="confirmPassword"
//                         type={showConfirmPassword ? "text" : "password"}
//                         name="confirmPassword"
//                         placeholder="••••••••"
//                         className={styles.input}
//                         value={formData.confirmPassword}
//                         onChange={handleChange}
//                         required
//                       />
//                       <button
//                         type="button"
//                         className={styles.passwordToggle}
//                         onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                         aria-label={showConfirmPassword ? "Hide password" : "Show password"}
//                       >
//                         {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
//                       </button>
//                     </div>
//                   </div>

//                   <div className={styles.passwordRequirements}>
//                     <p className={styles.requirementsTitle}>Password must have:</p>
//                     <ul className={styles.requirementsList}>
//                       <li className={validations.length ? styles.valid : styles.invalid}>
//                         <span className={styles.validationIcon}>{validations.length ? <Check size={12} /> : <X size={12} />}</span>
//                         At least 8 characters
//                       </li>
//                       <li className={validations.number ? styles.valid : styles.invalid}>
//                         <span className={styles.validationIcon}>{validations.number ? <Check size={12} /> : <X size={12} />}</span>
//                         At least 1 number (0-9)
//                       </li>
//                       <li className={validations.lowercase ? styles.valid : styles.invalid}>
//                         <span className={styles.validationIcon}>{validations.lowercase ? <Check size={12} /> : <X size={12} />}</span>
//                         At least 1 lowercase letter (a-z)
//                       </li>
//                       <li className={validations.uppercase ? styles.valid : styles.invalid}>
//                         <span className={styles.validationIcon}>{validations.uppercase ? <Check size={12} /> : <X size={12} />}</span>
//                         At least 1 uppercase letter (A-Z)
//                       </li>
//                     </ul>
//                   </div>
//                 </>
//               )}

//               {currentMode === 'signin' && (
//                 <div className={styles.forgotPassword}>
//                   <Link href="/forgot-password" className={styles.forgotPasswordLink}>
//                     Forgot Password?
//                   </Link>
//                 </div>
//               )}

//               <motion.button
//                 type="submit"
//                 className={styles.submitButton}
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 disabled={isLoading}
//               >
//                 {submitBtnText}
//                 <ArrowRight size={16} className={styles.buttonIcon} />
//               </motion.button>

//               <div className={styles.divider}>
//                 <span className={styles.dividerLine}></span>
//                 <span className={styles.dividerText}>OR</span>
//                 <span className={styles.dividerLine}></span>
//               </div>

//               <div className={styles.socialAuth}>
//                 <motion.button
//                   type="button"
//                   className={styles.googleButton}
//                   onClick={handleGoogleAuth}
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                 >
//                   <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
//                     <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
//                     <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
//                     <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
//                     <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
//                   </svg>
//                   <span>Continue with Google</span>
//                 </motion.button>

//                 <motion.button
//                   type="button"
//                   className={styles.appleButton}
//                   onClick={handleAppleAuth}
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                 >
//                   <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
//                     <path d="M14.767 9.023c-.021-2.12 1.736-3.152 1.816-3.2-1.01-1.481-2.523-1.68-3.05-1.684-1.293-.132-2.54.768-3.195.768-.659 0-1.672-.756-2.752-.732-1.406.023-2.707.825-3.43 2.082-1.473 2.551-.374 6.312 1.043 8.382.707 1.011 1.54 2.142 2.63 2.102 1.063-.044 1.46-.678 2.741-.678 1.276 0 1.645.678 2.76.654 1.145-.021 1.865-1.03 2.552-2.051.822-1.171 1.152-2.324 1.166-2.383-.026-.01-2.22-.847-2.241-3.37-.013-1.772 1.451-2.615 1.518-2.67-.834-1.228-2.13-1.364-2.59-1.39-1.17-.088-2.237.639-2.827.639-.65 0-1.58-.639-2.625-.62z" fill="currentColor"/>
//                   </svg>
//                   <span>Continue with Apple</span>
//                 </motion.button>
//               </div>

//               <div className={styles.switchMode}>
//                 <p>
//                   {currentMode === 'signin' 
//                     ? "Don't have an account?" 
//                     : "Already have an account?"}
//                 </p>
//                 <button 
//                   type="button" 
//                   onClick={toggleMode}
//                   className={styles.switchModeButton}
//                 >
//                   {currentMode === 'signin' ? 'Sign Up' : 'Sign In'}
//                 </button>
//               </div>
//             </form>
//           </motion.div>
//         </AnimatePresence>
//       </motion.div>

//       {verificationStep === 'email_code' && (
//   <motion.div
//     key="verification"
//     initial={{ opacity: 0, y: 10 }}
//     animate={{ opacity: 1, y: 0 }}
//     exit={{ opacity: 0, y: -10 }}
//     transition={{ duration: 0.3 }}
//     className={styles.formContainer}
//   >
//     <h2 className={styles.authTitle}>Verify Your Email</h2>
//     <p className={styles.authSubtitle}>
//       We've sent a verification code to your email.
//       Please enter it below to complete your registration.
//     </p>

//     {error && (
//       <motion.div 
//         className={styles.errorMessage}
//         initial={{ opacity: 0, y: -10 }}
//         animate={{ opacity: 1, y: 0 }}
//       >
//         <X size={16} />
//         <span>{error}</span>
//       </motion.div>
//     )}

//     {successMessage && (
//       <motion.div 
//         className={styles.successMessage}
//         initial={{ opacity: 0, y: -10 }}
//         animate={{ opacity: 1, y: 0 }}
//       >
//         <Check size={16} />
//         <span>{successMessage}</span>
//       </motion.div>
//     )}

//     <form onSubmit={(e) => {
//       e.preventDefault();
//       handleSignUp();
//     }} className={styles.form}>
//       <div className={styles.inputGroup}>
//         <label htmlFor="verificationCode" className={styles.inputLabel}>Verification Code</label>
//         <div className={styles.inputWrapper}>
//           <input
//             id="verificationCode"
//             type="text"
//             name="verificationCode"
//             placeholder="Enter code"
//             className={styles.input}
//             value={verificationCode}
//             onChange={(e) => setVerificationCode(e.target.value)}
//             required
//             autoComplete="one-time-code"
//             autoFocus
//           />
//         </div>
//       </div>

//       <motion.button
//         type="submit"
//         className={styles.submitButton}
//         whileHover={{ scale: 1.02 }}
//         whileTap={{ scale: 0.98 }}
//         disabled={isLoading}
//       >
//         {isLoading ? 'Verifying...' : 'Verify Email'}
//         <ArrowRight size={16} className={styles.buttonIcon} />
//       </motion.button>

//       <div className={styles.resendCode}>
//         <p>Didn't receive the code?</p>
//         <button 
//           type="button" 
//           onClick={async () => {
//             try {
//               setIsLoading(true);
//               const result = await signUp.prepareEmailAddressVerification({
//                 strategy: 'email_code'
//               });
//               if (result.status === 'needs_verification') {
//                 setSuccessMessage('Verification code resent to your email.');
//               } else {
//                 setError('Failed to resend verification code.');
//               }
//             } catch (err) {
//               setError('Failed to resend verification code.');
//             } finally {
//               setIsLoading(false);
//             }
//           }}
//           className={styles.resendButton}
//           disabled={isLoading}
//         >
//           Resend Code
//         </button>
//       </div>
//     </form>
//   </motion.div>
// )}

//       <motion.div 
//         className={imageSideClass}
//         initial={{ opacity: 0, x: 20 }}
//         animate={{ opacity: 1, x: 0 }}
//         transition={{ duration: 0.5, delay: 0.2 }}
//         style={{ 
//           backgroundImage: `url(${backgroundImage})`,
//           backgroundSize: 'cover',
//           backgroundPosition: 'center'
//         }}
//       >
//         <div className={styles.overlay}></div>
//         <div className={styles.content}>
//           <h2 className={styles.tagline}>{brandTagline}</h2>
//           <p className={styles.description}>
//             {currentMode === 'signin' 
//               ? 'Access your courses, track your progress, and connect with fellow learners.'
//               : 'Join our community of learners and unlock exclusive content and resources.'}
//           </p>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default AuthCard;