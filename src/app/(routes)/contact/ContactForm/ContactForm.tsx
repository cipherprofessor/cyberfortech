"use client"
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Send, User, Mail, MessageSquare, FileText, Loader2, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import styles from './ContactForm.module.scss';
import { Alert } from '@heroui/react';
// Remove other imports related to phone styles
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import phoneStyles from './ContactForm.PhoneInput.module.scss';


type FormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>(""); // for phone input

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      await axios.post('/api/contact', {
        ...data,
        phoneNumber // Include phone number in submission
      });
      setSubmitStatus('success');
      reset();
      setPhoneNumber(""); // Reset phone number
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFocus = (fieldName: string) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  return (
    <>
      <div className={styles.formHeader}>
        <MessageCircle className={styles.headerIcon} />
        <div className={styles.headerText}>
          <h2>Send us a Message</h2>
          <p>We'd love to hear from you! Send us a message and we'll respond as soon as possible.</p>
        </div>
      </div>
   
      <motion.form 
        className={styles.form} 
        onSubmit={handleSubmit(onSubmit)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className={styles.formGroup}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label htmlFor="name">
            <User size={18} className={styles.icon} />
            Full Name (Optional)
          </label>
          <div className={`${styles.inputWrapper} ${focusedField === 'name' ? styles.focused : ''}`}>
            <input
              id="name"
              type="text"
              placeholder="Arsalan Rayees"
              {...register('name', { 
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters'
                }
              })}
              className={errors.name ? styles.error : ''}
              onFocus={() => handleFocus('name')}
              onBlur={handleBlur}
            />
          </div>
          <AnimatePresence>
            {errors.name && (
              <motion.span 
                className={styles.errorMessage}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {errors.name.message}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div 
          className={styles.formGroup}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <label htmlFor="email">
            <Mail size={18} className={styles.icon} />
            Email Address
          </label>
          <div className={`${styles.inputWrapper} ${focusedField === 'email' ? styles.focused : ''}`}>
            <input
              id="email"
              type="email"
              placeholder="arsalancr7@footballer.com"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              className={errors.email ? styles.error : ''}
              onFocus={() => handleFocus('email')}
              onBlur={handleBlur}
            />
          </div>
          <AnimatePresence>
            {errors.email && (
              <motion.span 
                className={styles.errorMessage}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {errors.email.message}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Phone Input */}
               

        <motion.div 
  className={styles.formGroup}
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ delay: 0.25 }}
>
  <label>
    <User size={18} className={styles.icon} />
    Phone Number (Optional)
  </label>
  <div className={`${styles.inputWrapper} ${styles.phoneWrapper} ${focusedField === 'phone' ? styles.focused : ''} ${phoneStyles.phoneInputWrapper}`}>
    <PhoneInput
      defaultCountry="IN"
      value={phoneNumber}
      onChange={setPhoneNumber}
      onFocus={() => handleFocus('phone')}
      onBlur={handleBlur}
      placeholder="Enter phone number"
      international
      countryCallingCodeEditable={false}
      limitMaxLength={true}
      addInternationalOption={false}
    />
  </div>
</motion.div>

        <motion.div 
          className={styles.formGroup}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label htmlFor="subject">
            <FileText size={18} className={styles.icon} />
            Subject
          </label>
          <div className={`${styles.inputWrapper} ${focusedField === 'subject' ? styles.focused : ''}`}>
            <input
              id="subject"
              type="text"
              placeholder="How can we help you?"
              {...register('subject', { 
                required: 'Subject is required',
                minLength: {
                  value: 5,
                  message: 'Subject must be at least 5 characters'
                }
              })}
              className={errors.subject ? styles.error : ''}
              onFocus={() => handleFocus('subject')}
              onBlur={handleBlur}
            />
          </div>
          <AnimatePresence>
            {errors.subject && (
              <motion.span 
                className={styles.errorMessage}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {errors.subject.message}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div 
          className={styles.formGroup}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <label htmlFor="message">
            <MessageSquare size={18} className={styles.icon} />
            Message
          </label>
          <div className={`${styles.inputWrapper} ${focusedField === 'message' ? styles.focused : ''}`}>
            <textarea
              id="message"
              placeholder="Write your message here..."
              {...register('message', {
                required: 'Message is required',
                minLength: {
                  value: 10,
                  message: 'Message must be at least 10 characters'
                }
              })}
              rows={5}
              className={errors.message ? styles.error : ''}
              onFocus={() => handleFocus('message')}
              onBlur={handleBlur}
            />
          </div>
          <AnimatePresence>
            {errors.message && (
              <motion.span 
                className={styles.errorMessage}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {errors.message.message}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>
          {submitStatus === 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Alert
                color="success"
                description="Thank you for your message! We'll get back to you soon."
                title="Message Sent"
                variant="faded"
              />
            </motion.div>
          )}

          {submitStatus === 'error' && (
            <motion.div
              className={styles.errorAlert}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              Sorry, there was an error sending your message. Please try again.
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button 
          type="submit" 
          className={styles.submitButton}
          disabled={isSubmitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {isSubmitting ? (
            <>
              <Loader2 className={`${styles.icon} ${styles.spin}`} />
              Sending...
            </>
          ) : (
            <>
              Send Message
              <Send className={styles.icon} />
            </>
          )}
        </motion.button>
      </motion.form>
    </>
  );
}