// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import Image from 'next/image';
// import { useTheme } from 'next-themes';
// import { useRouter } from 'next/navigation';
// import { useAuth } from '@/hooks/useAuth';

// // Component imports
// import SignInForm from '../SignInForm';
// import SignUpForm from '../SignUpForm';
// import VerificationForm from '../VerificationForm';
// import AuthIllustration from '../AuthIllustration';

// // Types
// import { AuthCardProps } from '../types';

// // Styles
// import styles from './AuthCard.module.scss';

// const AuthCard: React.FC<AuthCardProps> = ({
//   className = '',
//   mode = 'signin',
//   brandName = 'CyberFort Tech',
//   brandLogo = '/logo/logoown.png',
//   brandTagline = 'Empowering knowledge through technology',
//   redirectUrl = '/',
//   backgroundImage = '/images/auth-bg.jpg',
//   onSuccess,
//   onError,
//   defaultRole = 'student'
// }) => {
//   const [currentMode, setCurrentMode] = useState<'signin' | 'signup' | 'verification'>(mode);
//   const [isClient, setIsClient] = useState(false);
//   const { theme } = useTheme();
//   const { isAuthenticated } = useAuth();
//   const router = useRouter();
  
//   // Hydration fix
//   useEffect(() => {
//     setIsClient(true);
//     setCurrentMode(mode);
//   }, [mode]);

//   // Redirect if already authenticated
//   useEffect(() => {
//     if (isAuthenticated) {
//       router.push(redirectUrl);
//     }
//   }, [isAuthenticated, router, redirectUrl]);

//   // Toggle between sign in and sign up modes
//   const toggleMode = () => {
//     setCurrentMode(prev => prev === 'signin' ? 'signup' : 'signin');
//   };

//   // Set verification mode
//   const setVerificationMode = () => {
//     setCurrentMode('verification');
//   };

//   // Reset to sign up mode
//   const resetToSignUp = () => {
//     setCurrentMode('signup');
//   };

//   // Apply theme-specific classes
//   const isDarkTheme = theme === 'dark';
//   const cardClass = `${styles.authCard} ${isDarkTheme ? styles.darkTheme : ''} ${className}`;
//   const formSideClass = `${styles.formSide} ${isDarkTheme ? styles.darkTheme : ''}`;

//   if (!isClient) {
//     return null; // Prevent hydration mismatch
//   }

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

//         {currentMode === 'signin' && (
//           <SignInForm 
//             onSuccess={onSuccess} 
//             onError={onError}
//             redirectUrl={redirectUrl}
//             onToggleMode={toggleMode}
//           />
//         )}

//         {currentMode === 'signup' && (
//           <SignUpForm 
//             onSuccess={onSuccess} 
//             onError={onError}
//             redirectUrl={redirectUrl}
//             onToggleMode={toggleMode}
//             defaultRole={defaultRole}
//             onVerificationNeeded={setVerificationMode}
//           />
//         )}

//         {currentMode === 'verification' && (
//           <VerificationForm 
//             onSuccess={onSuccess} 
//             onError={onError}
//             redirectUrl={redirectUrl}
//             onBackToSignUp={resetToSignUp}
//           />
//         )}
//       </motion.div>

//       <AuthIllustration 
//         backgroundImage={backgroundImage}
//         brandTagline={brandTagline}
//         description={
//           currentMode === 'signin' 
//             ? 'Access your courses, track your progress, and connect with fellow learners.'
//             : 'Join our community of learners and unlock exclusive content and resources.'
//         }
//       />
//     </div>
//   );
// };

// export default AuthCard;