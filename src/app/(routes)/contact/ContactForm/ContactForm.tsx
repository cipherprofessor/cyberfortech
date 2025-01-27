"use client"
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Send } from 'lucide-react';
import axios from 'axios';
import styles from './ContactForm.module.scss';
import { Alert } from '@heroui/react';

type FormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

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
      // Replace with your API endpoint
      await axios.post('/api/contact', data);
      setSubmitStatus('success');
      reset();
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.formGroup}>
        <label htmlFor="name">Full Name</label>
        <input
          id="name"
          type="text"
          {...register('name', { 
            required: 'Name is required',
            minLength: {
              value: 2,
              message: 'Name must be at least 2 characters'
            }
          })}
          className={errors.name ? styles.error : ''}
        />
        {errors.name && (
          <span className={styles.errorMessage}>{errors.name.message}</span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="email">Email Address</label>
        <input
          id="email"
          type="email"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address'
            }
          })}
          className={errors.email ? styles.error : ''}
        />
        {errors.email && (
          <span className={styles.errorMessage}>{errors.email.message}</span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="subject">Subject</label>
        <input
          id="subject"
          type="text"
          {...register('subject', { 
            required: 'Subject is required',
            minLength: {
              value: 5,
              message: 'Subject must be at least 5 characters'
            }
          })}
          className={errors.subject ? styles.error : ''}
        />
        {errors.subject && (
          <span className={styles.errorMessage}>{errors.subject.message}</span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          {...register('message', {
            required: 'Message is required',
            minLength: {
              value: 10,
              message: 'Message must be at least 10 characters'
            }
          })}
          rows={5}
          className={errors.message ? styles.error : ''}
        />
        {errors.message && (
          <span className={styles.errorMessage}>{errors.message.message}</span>
        )}
      </div>

      {submitStatus === 'success' && (
        <div className={styles.successMessage}>
           <Alert
          color="success"
          description="Thank you for your message! We'll get back to you soon."
          // isVisible={isVisible}
          title="Message Sent"
          variant="faded"
          // onClose={() => setIsVisible(false)}
        />
        </div>
      )}

      {submitStatus === 'error' && (
        <div className={styles.errorAlert}>
          Sorry, there was an error sending your message. Please try again.
        </div>
      )}

      <button 
        type="submit" 
        className={styles.submitButton}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          'Sending...'
        ) : (
          <>
            Send Message
            <Send className={styles.icon} />
          </>
        )}
      </button>
    </form>
  );
}