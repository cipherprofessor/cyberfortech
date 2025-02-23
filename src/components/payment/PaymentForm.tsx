// src/components/payment/PaymentForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard,
  Smartphone,
  AlertCircle,
  Shield,
  Check,
  ChevronDown
} from 'lucide-react';
import { CreditCard as CreditCardComponent } from './CreditCard/CreditCard';

import styles from './PaymentForm.module.scss';
import { PaymentMethods } from './PaymentMethods';
import { OrderSummary } from './OrderSummary';
import { PaymentTimeline } from './PaymentTimeline';
import { SecurityBadges } from './SecurityBadges';

interface PaymentFormProps {
  paymentDetails: {
    amount: number;
    currency: string;
    orderId: string;
    courseId: string;
    courseName: string;
  };
  onPaymentComplete: (paymentId: string) => void;
  onPaymentError: (error: Error) => void;
  className?: string;
}

interface CardDetails {
  cardNumber: string;
  nameOnCard: string;
  expiryDate: string;
  cvv: string;
}

interface UPIDetails {
  upiId: string;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  paymentDetails,
  onPaymentComplete,
  onPaymentError,
  className = ''
}) => {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState('');
  const [showPromo, setShowPromo] = useState(false);

  const [cardDetails, setCardDetails] = useState<CardDetails>({
    cardNumber: '',
    nameOnCard: '',
    expiryDate: '',
    cvv: ''
  });

  const [upiDetails, setUpiDetails] = useState<UPIDetails>({
    upiId: ''
  });

  // Format card number with spaces
  const formatCardNumber = (value: string): string => {
    // Remove any spaces and non-numeric characters
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    // Split into groups of 4 digits
    const parts: string[] = [];
    for (let i = 0; i < v.length; i += 4) {
      parts.push(v.slice(i, i + 4));
    }
  
    // Join with spaces, or return original value if empty
    return parts.length > 0 ? parts.join(' ') : value;
  };
  
  // Alternative implementation using regex
  const formatCardNumber2 = (value: string): string => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    return v.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
  };

  // Format expiry date
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return `${v.slice(0, 2)}/${v.slice(2, 4)}`;
    }
    return v;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMethod) {
      setError('Please select a payment method');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Validate input based on payment method
      if (selectedMethod === 'credit_card') {
        if (!cardDetails.cardNumber || !cardDetails.nameOnCard || !cardDetails.expiryDate || !cardDetails.cvv) {
          throw new Error('Please fill in all card details');
        }
      } else if (selectedMethod === 'upi') {
        if (!upiDetails.upiId) {
          throw new Error('Please enter UPI ID');
        }
      }

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock payment ID
      const paymentId = `PAY-${Math.random().toString(36).substr(2, 9)}`;
      onPaymentComplete(paymentId);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Payment failed');
      setError(error.message);
      onPaymentError(error);
    } finally {
      setLoading(false);
    }
  };

  // Card validation utilities
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
  
  const isValidCardNumber = (number: string): boolean => {
    const cleaned = number.replace(/\D/g, '');
    
    // Luhn algorithm validation
    let sum = 0;
    let isEven = false;
    
    // Loop through values starting from the rightmost digit
    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned.charAt(i), 10);
  
      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
  
      sum += digit;
      isEven = !isEven;
    }
  
    return sum % 10 === 0;
  };
  

  // Handle card number input
  // Enhanced card number input handling
const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const formatted = formatCardNumber(input);
    
    if (formatted.length <= 19) {
      setCardDetails(prev => ({
        ...prev,
        cardNumber: formatted,
        cardType: getCardType(formatted)
      }));
  
      // Validate complete card numbers
      if (formatted.replace(/\D/g, '').length === 16) {
        setCardErrors(prev => ({
          ...prev,
          cardNumber: !isValidCardNumber(formatted) ? 'Invalid card number' : ''
        }));
      }
    }
  };

  // Handle expiry date input
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatExpiryDate(e.target.value);
    setCardDetails({ ...cardDetails, expiryDate: formattedValue });
  };

  return (
    <div className={`${styles.container} ${className}`}>
      <PaymentMethods
        selectedMethod={selectedMethod}
        onMethodSelect={setSelectedMethod}
      />

      <AnimatePresence mode="wait">
        {selectedMethod && (
          <motion.form
            className={styles.formSection}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
          >
            {(selectedMethod === 'credit_card' || selectedMethod === 'debit_card') && (
              <div className={styles.cardSection}>
                <CreditCardComponent
                  cardNumber={cardDetails.cardNumber}
                  cardHolder={cardDetails.nameOnCard}
                  expiryDate={cardDetails.expiryDate}
                  cvv={cardDetails.cvv}
                  isFlipped={isCardFlipped}
                />

                <div className={styles.inputGroup}>
                  <label htmlFor="nameOnCard">Name on Card</label>
                  <input
                    type="text"
                    id="nameOnCard"
                    placeholder="Enter name as on card"
                    value={cardDetails.nameOnCard}
                    onChange={(e) => setCardDetails({...cardDetails, nameOnCard: e.target.value})}
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="cardNumber">Card Number</label>
                  <input
  type="text"
  id="cardNumber"
  placeholder="1234 5678 9012 3456"
  value={cardDetails.cardNumber}
  onChange={handleCardNumberChange}
  maxLength={19}
  required
/>
                </div>

                <div className={styles.cardInputs}>
                  <div className={styles.inputGroup}>
                    <label htmlFor="expiryDate">Expiry Date</label>
                    <input
                      type="text"
                      id="expiryDate"
                      placeholder="MM/YY"
                      value={cardDetails.expiryDate}
                      onChange={handleExpiryChange}
                      maxLength={5}
                      required
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="cvv">CVV</label>
                    <input
                      type="password"
                      id="cvv"
                      placeholder="123"
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value.slice(0, 4)})}
                      onFocus={() => setIsCardFlipped(true)}
                      onBlur={() => setIsCardFlipped(false)}
                      maxLength={4}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedMethod === 'upi' && (
              <div className={styles.upiSection}>
                <div className={styles.inputGroup}>
                  <label htmlFor="upiId">UPI ID</label>
                  <input
                    type="text"
                    id="upiId"
                    placeholder="username@upi"
                    value={upiDetails.upiId}
                    onChange={(e) => setUpiDetails({...upiDetails, upiId: e.target.value})}
                    required
                  />
                </div>
              </div>
            )}

            <OrderSummary
              courseName={paymentDetails.courseName}
              amount={paymentDetails.amount}
              currency={paymentDetails.currency}
            />

            <PaymentTimeline />

            <SecurityBadges />

            <AnimatePresence>
              {error && (
                <motion.div
                  className={styles.error}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  role="alert"
                >
                  <AlertCircle size={20} />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  Processing Payment...
                </motion.span>
              ) : (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  Pay {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: paymentDetails.currency
                  }).format(paymentDetails.amount)}
                </motion.span>
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};