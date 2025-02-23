// src/components/payment/PaymentTimeline.tsx
import { CreditCard, Clock, CheckCircle } from 'lucide-react';
import type { PaymentTimelineProps } from './types';
import styles from './PaymentTimeline.module.scss';

export const PaymentTimeline: React.FC<PaymentTimelineProps> = ({ currentStep }) => {
  const steps = [
    {
      icon: <CreditCard />,
      title: 'Payment Processing',
      description: 'Your payment is being securely processed'
    },
    {
      icon: <Clock />,
      title: 'Course Access',
      description: 'Instant access after successful payment'
    },
    {
      icon: <CheckCircle />,
      title: 'Ready to Start',
      description: 'Begin your learning journey immediately'
    }
  ];

  return (
    <div className={styles.timeline}>
      {steps.map((step, index) => (
        <div 
          key={index} 
          className={`${styles.step} ${index <= currentStep ? styles.active : ''}`}
        >
          <div className={styles.stepIcon}>{step.icon}</div>
          <div className={styles.stepContent}>
            <h4>{step.title}</h4>
            <p>{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};