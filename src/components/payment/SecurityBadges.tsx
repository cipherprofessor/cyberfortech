// src/components/payment/SecurityBadges.tsx
import { Shield, Lock, CheckCircle } from 'lucide-react';
import styles from './PaymentForm.module.scss';

export const SecurityBadges = () => (
  <div className={styles.securityBadges}>
    <div className={styles.badge}>
      <Shield size={16} />
      <span>Secure Payment</span>
    </div>
    <div className={styles.badge}>
      <Lock size={16} />
      <span>Encrypted Data</span>
    </div>
    <div className={styles.badge}>
      <CheckCircle size={16} />
      <span>Money Back Guarantee</span>
    </div>
  </div>
);

