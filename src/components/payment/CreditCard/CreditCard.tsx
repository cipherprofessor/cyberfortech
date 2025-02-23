// src/components/payment/CreditCard/CreditCard.tsx
'use client';

import { FC } from 'react';
import { motion } from 'framer-motion';
import styles from './CreditCard.module.scss';

interface CreditCardProps {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
  isFlipped: boolean;
  cardType?: 'visa' | 'mastercard' | 'amex' | 'default';
  className?: string;
}

const formatCardNumber = (value: string) => {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  const matches = v.match(/\d{4,16}/g);
  const match = (matches && matches[0]) || '';
  const parts: string[] = [];

  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4));
  }

  if (parts.length) {
    return parts.join(' ');
  } else {
    return value;
  }
};

const getCardType = (number: string): 'visa' | 'mastercard' | 'amex' | 'default' => {
  const re = {
    visa: /^4/,
    mastercard: /^5[1-5]/,
    amex: /^3[47]/
  };

  if (re.visa.test(number)) return 'visa';
  if (re.mastercard.test(number)) return 'mastercard';
  if (re.amex.test(number)) return 'amex';
  return 'default';
};

export const CreditCard: FC<CreditCardProps> = ({
  cardNumber,
  cardHolder,
  expiryDate,
  cvv,
  isFlipped,
  className = ''
}) => {
  const cardType = getCardType(cardNumber.replace(/\s/g, ''));

  return (
    <div className={`${styles.cardWrapper} ${className}`}>
      <motion.div 
        className={styles.card}
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className={`${styles.cardFace} ${styles.cardFront}`}>
          <div className={styles.cardLogo}>
            {cardType === 'visa' && <span className={styles.visa}>VISA</span>}
            {cardType === 'mastercard' && <span className={styles.mastercard}>MC</span>}
            {cardType === 'amex' && <span className={styles.amex}>AMEX</span>}
          </div>
          
          <div className={styles.cardChip} />
          
          <div className={styles.cardNumber}>
            {formatCardNumber(cardNumber) || '•••• •••• •••• ••••'}
          </div>
          
          <div className={styles.cardDetails}>
            <div className={styles.cardHolder}>
              <label>Card Holder</label>
              <div>{cardHolder || 'YOUR NAME'}</div>
            </div>
            
            <div className={styles.cardExpiry}>
              <label>Expires</label>
              <div>{expiryDate || 'MM/YY'}</div>
            </div>
          </div>
        </div>

        <div className={`${styles.cardFace} ${styles.cardBack}`}>
          <div className={styles.cardStrip} />
          
          <div className={styles.cardCvv}>
            <label>CVV</label>
            <div className={styles.cvvBand}>
              {cvv || '•••'}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};