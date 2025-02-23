// src/components/payment/OrderSummary/OrderSummary.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Shield, Check } from 'lucide-react';
import type { OrderSummaryProps } from './types';
import styles from './OrderSummary.module.scss';

export const OrderSummary = ({
  courseName,
  amount,
  currency = 'USD',
  features,
  instructor,
  duration,
  discountAmount = 0,
  taxAmount = 0,
  promoCode,
  onPromoCodeApply
}: OrderSummaryProps) => {
  const [showPromo, setShowPromo] = useState(false);
  const [promoInput, setPromoInput] = useState('');
  const [applying, setApplying] = useState(false);

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  });

  const totalAmount = amount - discountAmount + taxAmount;

  const handlePromoSubmit = async () => {
    if (!promoInput || !onPromoCodeApply) return;
    
    setApplying(true);
    try {
      await onPromoCodeApply(promoInput);
      setPromoInput('');
      setShowPromo(false);
    } catch (error) {
      console.error('Failed to apply promo code:', error);
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Order Summary</h3>

      <div className={styles.courseInfo}>
        <h4>{courseName}</h4>
        {instructor && <p className={styles.instructor}>by {instructor}</p>}
        {duration && <p className={styles.duration}>{duration}</p>}
      </div>

      <div className={styles.priceBreakdown}>
        <div className={styles.priceItem}>
          <span>Original Price</span>
          <span>{formatter.format(amount)}</span>
        </div>

        {discountAmount > 0 && (
          <div className={`${styles.priceItem} ${styles.discount}`}>
            <span>Discount</span>
            <span>-{formatter.format(discountAmount)}</span>
          </div>
        )}

        {taxAmount > 0 && (
          <div className={styles.priceItem}>
            <span>Tax</span>
            <span>{formatter.format(taxAmount)}</span>
          </div>
        )}

        <div className={`${styles.priceItem} ${styles.total}`}>
          <span>Total</span>
          <span>{formatter.format(totalAmount)}</span>
        </div>
      </div>

      {onPromoCodeApply && (
        <div className={styles.promoSection}>
          <button 
            className={styles.promoToggle}
            onClick={() => setShowPromo(!showPromo)}
            type="button"
          >
            <ChevronDown 
              className={`${styles.icon} ${showPromo ? styles.rotated : ''}`}
            />
            Have a promo code?
          </button>

          <AnimatePresence>
            {showPromo && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className={styles.promoForm}
              >
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder="Enter promo code"
                  disabled={applying}
                />
                <button
                  onClick={handlePromoSubmit}
                  disabled={!promoInput || applying}
                  type="button"
                >
                  {applying ? 'Applying...' : 'Apply'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {features && features.length > 0 && (
        <div className={styles.features}>
          <h4>What's included:</h4>
          <ul>
            {features.map((feature, index) => (
              <li key={index}>
                <Check className={styles.checkIcon} size={16} />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className={styles.guarantee}>
        <Shield className={styles.icon} />
        <div>
          <p className={styles.guaranteeTitle}>30-Day Money-Back Guarantee</p>
          <p className={styles.guaranteeText}>Not satisfied? Get a full refund within 30 days</p>
        </div>
      </div>
    </div>
  );
};