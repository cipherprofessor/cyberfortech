// src/app/(routes)/courses/[courseId]/payment/page.tsx
'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  Clock,
  Shield,
  CreditCard,
  Smartphone,
  BanknoteIcon
} from 'lucide-react';
import { PaymentForm } from '@/components/payment/PaymentForm';
import { OrderSummary } from '@/components/payment/OrderSummary';
import { PaymentMethods } from '@/components/payment/PaymentMethods';

import { PaymentTimeline } from '@/components/payment/PaymentTimeline';
import styles from './page.module.scss';
import { SecurityBadges } from '@/components/payment/SecurityBadges';
import { PaymentMethod, PaymentMethodType } from '@/components/payment/types';

interface CourseDetails {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  level: string;
  price: number;
  features: string[];
  thumbnail?: string;
}

interface PaymentPageProps {
  params: Promise<{ courseId: string }>;
}

const paymentMethods: PaymentMethod[] = [
    {
      id: 'credit_card',
      title: 'Credit/Debit Card',
      description: 'Pay securely with your card',
      icon: <CreditCard className={styles.methodIcon} />,
      logos: ['/visa.svg', '/mastercard.svg', '/amex.svg']
    },
    {
      id: 'upi',
      title: 'UPI Payment',
      description: 'GPay, PhonePe, Paytm & more',
      icon: <Smartphone className={styles.methodIcon} />,
      logos: ['/gpay.svg', '/phonepe.svg', '/paytm.svg']
    },
    {
      id: 'net_banking',
      title: 'Net Banking',
      description: 'All major banks supported',
      icon: <BanknoteIcon className={styles.methodIcon} />
    }
  ];



export default function PaymentPage({ params }: PaymentPageProps) {
  const router = useRouter();
  const { theme } = useTheme();
  const resolvedParams = use(params);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const courseDetails: CourseDetails = {
    id: resolvedParams.courseId,
    title: "Advanced Web Development Masterclass",
    description: "Master modern web development with hands-on projects and real-world applications. Learn the latest technologies and best practices in web development.",
    instructor: "John Doe",
    duration: "12 weeks",
    level: "Advanced",
    price: 499.99,
    features: [
      "Lifetime access to course materials",
      "Certificate of completion",
      "Access to private Discord community",
      "Live Q&A sessions with instructor",
      "24/7 Support",
      "Project-based learning",
      "Industry-standard tools and practices",
      "Regular updates with latest content"
    ]
  };

  const paymentMethods = [
    {
      id: 'credit_card',
      title: 'Credit/Debit Card',
      description: 'Pay securely with your card',
      icon: <CreditCard className={styles.methodIcon} />
    },
    {
      id: 'upi',
      title: 'UPI Payment',
      description: 'GPay, PhonePe, Paytm & more',
      icon: <Smartphone className={styles.methodIcon} />
    },
    {
      id: 'net_banking',
      title: 'Net Banking',
      description: 'All major banks supported',
      icon: <BanknoteIcon className={styles.methodIcon} />
    }
  ];

  const paymentDetails = {
    amount: courseDetails.price,
    currency: 'USD',
    orderId: `ORDER-${Math.random().toString(36).substr(2, 9)}`,
    courseId: courseDetails.id,
    courseName: courseDetails.title
  };

  const handlePaymentComplete = async (paymentId: string) => {
    try {
      setPaymentStatus('processing');
      // Here you would typically make an API call to verify the payment
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulating API call
      setPaymentStatus('success');
      router.push(`/courses/${resolvedParams.courseId}/success?paymentId=${paymentId}`);
    } catch (error) {
      setPaymentStatus('error');
      console.error('Payment verification failed:', error);
    }
  };

  const handlePaymentError = (error: Error) => {
    setPaymentStatus('error');
    console.error('Payment failed:', error);
  };

    return (
      <div className={styles.pageContainer}>
        <div className={styles.contentWrapper}>
          <div className={styles.leftColumn}>
            <div className={styles.courseCard}>
              <div className={styles.courseHeader}>
                <h1>{courseDetails.title}</h1>
                <p className={styles.description}>{courseDetails.description}</p>
              </div>
  
              <div className={styles.courseInfo}>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Instructor</span>
                  <span className={styles.value}>{courseDetails.instructor}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Duration</span>
                  <span className={styles.value}>{courseDetails.duration}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Level</span>
                  <span className={styles.value}>{courseDetails.level}</span>
                </div>
              </div>
  
              <div className={styles.featuresList}>
                <h3>What you'll get</h3>
                <ul>
                  {courseDetails.features.map((feature, index) => (
                    <li key={index}>
                      <CheckCircle className={styles.checkIcon} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
  
          <div className={styles.rightColumn}>
            <PaymentForm
              paymentDetails={paymentDetails}
              onPaymentComplete={handlePaymentComplete}
              onPaymentError={handlePaymentError}
            />
          </div>
        </div>
      </div>
    );
  }