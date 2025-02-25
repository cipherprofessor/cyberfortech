'use client';

import styles from './StepIndicator.module.scss';
import { Check } from 'lucide-react';

interface Step {
  number: number;
  label: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  isDark?: boolean;
}

export function StepIndicator({ 
  steps, 
  currentStep,
  isDark = false
}: StepIndicatorProps) {
  return (
    <div className={`${styles.container} ${isDark ? styles.dark : ''}`}>
      <div className={styles.stepsWrapper}>
        {steps.map((step, index) => {
          const isActive = currentStep >= step.number;
          const isCompleted = currentStep > step.number;
          
          return (
            <div 
              key={step.number} 
              className={`${styles.step} ${isActive ? styles.active : ''} ${isCompleted ? styles.completed : ''}`}
            >
              <div className={styles.stepIndicator}>
                {isCompleted ? (
                  <Check size={16} className={styles.checkIcon} />
                ) : (
                  <span>{step.number}</span>
                )}
              </div>
              
              <div className={styles.stepLabel}>
                {step.label}
              </div>
              
              {index < steps.length - 1 && (
                <div className={`${styles.connector} ${isCompleted ? styles.completed : ''}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}