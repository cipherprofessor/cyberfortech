// src/components/payment/PaymentMethods/PaymentMethods.tsx
'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { CreditCard, Smartphone, BanknoteIcon } from 'lucide-react';
import { useState } from 'react';
import styles from './PaymentMethods.module.scss';

export interface PaymentMethod {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  logos?: string[];
}

export interface PaymentMethodsProps {
  methods: PaymentMethod[];
  selectedMethod: string | null;
  onMethodSelect: (method: string) => void;
}

export const PaymentMethods: React.FC<PaymentMethodsProps> = ({
  methods,
  selectedMethod,
  onMethodSelect,
}) => {
  const [savedCards] = useState([
    {
      id: '1',
      type: 'visa',
      last4: '4532',
      expiry: '12/24',
      bank: 'HDFC Bank'
    },
    {
      id: '2',
      type: 'mastercard',
      last4: '8845',
      expiry: '09/25',
      bank: 'ICICI Bank'
    }
  ]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Choose Payment Method</h2>
      
      <div className={styles.methodsGrid}>
        {methods.map((method) => (
          <motion.div
            key={method.id}
            className={`${styles.methodCard} ${selectedMethod === method.id ? styles.selected : ''}`}
            onClick={() => onMethodSelect(method.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className={styles.methodContent}>
              <div className={styles.iconWrapper}>
                {method.icon}
              </div>
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

      {selectedMethod === 'credit_card' && savedCards.length > 0 && (
        <div className={styles.savedCards}>
          <h3>Saved Cards</h3>
          {savedCards.map((card) => (
            <div key={card.id} className={styles.savedCard}>
              <div className={styles.cardLogo}>
                <Image
                  src={`/${card.type}.svg`}
                  alt={card.type}
                  width={32}
                  height={20}
                />
              </div>
              <div className={styles.cardInfo}>
                <div className={styles.cardNumber}>
                  •••• •••• •••• {card.last4}
                </div>
                <div className={styles.cardMeta}>
                  {card.bank} • Expires {card.expiry}
                </div>
              </div>
              <motion.div
                className={styles.radioButton}
                initial={false}
                animate={{
                  backgroundColor: selectedMethod === card.id ? '#4F46E5' : 'transparent',
                  borderColor: selectedMethod === card.id ? '#4F46E5' : '#E5E7EB',
                }}
              >
                {selectedMethod === card.id && (
                  <motion.div
                    className={styles.radioInner}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  />
                )}
              </motion.div>
            </div>
          ))}
        </div>
      )}

      {selectedMethod === 'upi' && (
        <motion.div
          className={styles.upiApps}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className={styles.upiQR}>
            <Image
              src="/upi-qr.png"
              alt="UPI QR Code"
              width={200}
              height={200}
              className={styles.qrCode}
            />
            <p>Scan with any UPI app</p>
          </div>
          
          <div className={styles.upiOptions}>
            <h3>Popular UPI Apps</h3>
            <div className={styles.appGrid}>
              {['GPay', 'PhonePe', 'Paytm'].map((app) => (
                <motion.button
                  key={app}
                  className={styles.appButton}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Image
                    src={`/${app.toLowerCase()}.svg`}
                    alt={app}
                    width={24}
                    height={24}
                  />
                  <span>{app}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {selectedMethod === 'net_banking' && (
        <motion.div
          className={styles.bankingOptions}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className={styles.popularBanks}>
            <h3>Popular Banks</h3>
            <div className={styles.bankGrid}>
              {['HDFC', 'ICICI', 'SBI', 'Axis'].map((bank) => (
                <motion.button
                  key={bank}
                  className={styles.bankButton}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Image
                    src={`/${bank.toLowerCase()}.svg`}
                    alt={bank}
                    width={32}
                    height={32}
                  />
                  <span>{bank} Bank</span>
                </motion.button>
              ))}
            </div>
          </div>

          <div className={styles.otherBanks}>
            <select className={styles.bankSelect}>
              <option value="">Select Other Bank</option>
              <option value="kotak">Kotak Mahindra Bank</option>
              <option value="yes">Yes Bank</option>
              <option value="idfc">IDFC First Bank</option>
              <option value="indian">Indian Bank</option>
            </select>
          </div>
        </motion.div>
      )}
    </div>
  );
};