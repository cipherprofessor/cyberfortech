// src/components/payment/PaymentForm.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  CreditCard,
  Smartphone,
  BanknoteIcon,
  Shield,
  CheckCircle
} from 'lucide-react';
import styles from './PaymentForm.module.scss';

interface PaymentDetails {
  amount: number;
  currency: string;
  orderId: string;
  courseId: string;
  courseName: string;
}

interface PaymentFormProps {
  paymentDetails: PaymentDetails;
  onPaymentComplete: (paymentId: string) => void;
  onPaymentError: (error: Error) => void;
  className?: string;
}

interface CardDetails {
  cardNumber: string;
  nameOnCard: string;
  expiryDate: string;
  cvv: string;
  cardType?: 'visa' | 'mastercard' | 'amex' | 'unknown';
}

interface PaymentMethod {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  logos?: string[];
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  paymentDetails,
  onPaymentComplete,
  onPaymentError,
  className = ''
}) => {
  const [selectedMethod, setSelectedMethod] = useState<string | null>('credit_card');
  const [loading, setLoading] = useState(false);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [paymentStep, setPaymentStep] = useState(0);

  const [cardDetails, setCardDetails] = useState<CardDetails>({
    cardNumber: '',
    nameOnCard: '',
    expiryDate: '',
    cvv: '',
    cardType: 'unknown'
  });

  const [errors, setErrors] = useState({
    cardNumber: '',
    nameOnCard: '',
    expiryDate: '',
    cvv: ''
  });

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

  const formatCardNumber = (value: string): string => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const parts: string[] = [];
    for (let i = 0; i < v.length; i += 4) {
      parts.push(v.slice(i, i + 4));
    }
    return parts.length > 0 ? parts.join(' ') : value;
  };

  const formatExpiryDate = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  const getCardType = (number: string): 'visa' | 'mastercard' | 'amex' | 'unknown' => {
    const cleaned = number.replace(/\D/g, '');
    
    const patterns = {
      visa: /^4/,
      mastercard: /^5[1-5]/,
      amex: /^3[47]/
    };

    if (patterns.visa.test(cleaned)) return 'visa';
    if (patterns.mastercard.test(cleaned)) return 'mastercard';
    if (patterns.amex.test(cleaned)) return 'amex';
    return 'unknown';
  };

  const validateCardNumber = (number: string): boolean => {
    const cleaned = number.replace(/\D/g, '');
    let sum = 0;
    let isEven = false;
    
    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned.charAt(i), 10);
      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      isEven = !isEven;
    }
    
    return sum % 10 === 0;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const formatted = formatCardNumber(input);
    
    if (formatted.length <= 19) {
      const cardType = getCardType(formatted);
      setCardDetails(prev => ({
        ...prev,
        cardNumber: formatted,
        cardType
      }));

      if (formatted.replace(/\D/g, '').length === 16) {
        setErrors(prev => ({
          ...prev,
          cardNumber: validateCardNumber(formatted) ? '' : 'Invalid card number'
        }));
      }
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    if (formatted.length <= 5) {
      setCardDetails(prev => ({ ...prev, expiryDate: formatted }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors = {
      cardNumber: !validateCardNumber(cardDetails.cardNumber) ? 'Invalid card number' : '',
      nameOnCard: !cardDetails.nameOnCard ? 'Name is required' : '',
      expiryDate: !cardDetails.expiryDate ? 'Expiry date is required' : '',
      cvv: !cardDetails.cvv ? 'CVV is required' : ''
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setPaymentStep(1);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      const paymentId = `PAY-${Math.random().toString(36).substr(2, 9)}`;
      setPaymentStep(2);
      onPaymentComplete(paymentId);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Payment failed');
      setPaymentStep(0);
      onPaymentError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.methodsGrid}>
        {paymentMethods.map((method) => (
          <motion.div
            key={method.id}
            className={`${styles.methodCard} ${selectedMethod === method.id ? styles.selected : ''}`}
            onClick={() => setSelectedMethod(method.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className={styles.methodContent}>
              <div className={styles.iconWrapper}>{method.icon}</div>
              <div className={styles.methodInfo}>
                <h3>{method.title}</h3>
                <p>{method.description}</p>
              </div>
            </div>

            {method.logos && (
              <div className={styles.methodLogos}>
                {method.logos.map((logo, index) => (
                  <div key={index} className={styles.logoWrapper}>
                    <Image
                      src={logo}
                      alt={`${method.title} payment option`}
                      width={32}
                      height={20}
                      className={styles.logo}
                    />
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {selectedMethod && (
          <motion.form
            className={styles.formSection}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
          >
            {selectedMethod === 'credit_card' && (
              <div className={styles.cardSection}>
                <div className={styles.inputGroup}>
                  <label htmlFor="nameOnCard">Name on Card</label>
                  <input
                    type="text"
                    id="nameOnCard"
                    value={cardDetails.nameOnCard}
                    onChange={(e) => setCardDetails({...cardDetails, nameOnCard: e.target.value})}
                    placeholder="Enter name as on card"
                    required
                  />
                  {errors.nameOnCard && <span className={styles.error}>{errors.nameOnCard}</span>}
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="cardNumber">Card Number</label>
                  <input
                    type="text"
                    id="cardNumber"
                    value={cardDetails.cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    required
                  />
                  {errors.cardNumber && <span className={styles.error}>{errors.cardNumber}</span>}
                </div>

                <div className={styles.cardInputs}>
                  <div className={styles.inputGroup}>
                    <label htmlFor="expiryDate">Expiry Date</label>
                    <input
                      type="text"
                      id="expiryDate"
                      value={cardDetails.expiryDate}
                      onChange={handleExpiryChange}
                      placeholder="MM/YY"
                      maxLength={5}
                      required
                    />
                    {errors.expiryDate && <span className={styles.error}>{errors.expiryDate}</span>}
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="cvv">CVV</label>
                    <input
                      type="password"
                      id="cvv"
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value.slice(0, 4)})}
                      onFocus={() => setIsCardFlipped(true)}
                      onBlur={() => setIsCardFlipped(false)}
                      placeholder="123"
                      maxLength={4}
                      required
                    />
                    {errors.cvv && <span className={styles.error}>{errors.cvv}</span>}
                  </div>
                </div>
              </div>
            )}

            <div className={styles.summary}>
              <div className={styles.summaryRow}>
                <span>Amount to Pay</span>
                <span>
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: paymentDetails.currency
                  }).format(paymentDetails.amount)}
                </span>
              </div>
            </div>

            <div className={styles.timeline}>
              {[
                { icon: <CreditCard />, title: 'Enter Payment Details' },
                { icon: <Shield />, title: 'Processing Payment' },
                { icon: <CheckCircle />, title: 'Payment Complete' }
              ].map((step, index) => (
                <div
                  key={index}
                  className={`${styles.timelineStep} ${index <= paymentStep ? styles.active : ''}`}
                >
                  <div className={styles.stepIcon}>{step.icon}</div>
                  <div className={styles.stepTitle}>{step.title}</div>
                </div>
              ))}
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? 'Processing...' : `Pay ${new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: paymentDetails.currency
              }).format(paymentDetails.amount)}`}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};