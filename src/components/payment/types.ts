import { JSX } from "react";


// export interface PaymentDetails {
//   amount: number;
//   currency: string;
//   orderId: string;
//   courseId: string;
//   courseName: string;
//   platformFee: number;
//   totalAmount: number;
// }

export interface CardDetails {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  nameOnCard: string;
}

export interface UPIDetails {
  upiId: string;
}

// export interface PaymentFormProps {
//   paymentDetails: PaymentDetails;
//   onPaymentComplete: (paymentId: string) => void;
//   onPaymentError: (error: Error) => void;
//   className?: string;
//   customTheme?: {
//     primary: string;
//     secondary: string;
//     background: string;
//     text: string;
//   };

//   paymentMethod: string;

// }

export interface PaymentMethodCardProps {
  method: PaymentMethod;
  icon: React.ReactNode;
  title: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
  className?: string;
}

export interface PaymentFormState {
  selectedMethod: PaymentMethod | null;
  loading: boolean;
  error: string | null;
  cardDetails: CardDetails;
  upiDetails: UPIDetails;
}


// src/components/payment/PaymentMethods/types.ts

export interface SavedCard {
    id: string;
    type: 'visa' | 'mastercard' | 'amex';
    last4: string;
    expiry: string;
    bank: string;
  }
  
  export interface PaymentMethod {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    logos?: string[];
  }
  
//   export interface PaymentMethodType {
//     id: string;
//     title: string;
//     description: string;
//     icon: JSX.Element;
//     logos?: string[];
//   }
  
//   export interface PaymentMethodsProps {
//     methods: PaymentMethodType[];
//     selectedMethod: string | null;
//     onMethodSelect: (method: string) => void;
//     className?: string;
//   }
  
  export interface UPIApp {
    id: string;
    name: string;
    logo: string;
  }
  
  export interface Bank {
    id: string;
    name: string;
    logo: string;
    isPopular?: boolean;
  }

  export interface OrderSummaryProps {
    courseName: string;
    amount: number;
    currency?: string;
    features?: string[];
    instructor?: string;
    duration?: string;
    discountAmount?: number;
    taxAmount?: number;
    promoCode?: string;
    onPromoCodeApply?: (code: string) => Promise<void>;
  }
  
  export interface PriceBreakdownItem {
    label: string;
    amount: number;
    type?: 'regular' | 'discount' | 'tax' | 'total';
  }



  // src/components/payment/types.ts

export interface PaymentDetails {
    amount: number;
    currency: string;
    orderId: string;
    courseId: string;
    courseName: string;
  }
  
  export interface PaymentMethodType {
    id: string;
    title: string;
    description: string;
    icon: JSX.Element;
    logos?: string[];
  }
  
  export interface PaymentFormProps {
    paymentDetails: PaymentDetails;
    paymentMethod: string;
    onPaymentComplete: (paymentId: string) => void;
    onPaymentError: (error: Error) => void;
    className?: string;
  }
  
  export interface PaymentMethodsProps {
    methods: PaymentMethodType[];
    selectedMethod: string | null;
    onMethodSelect: (method: string) => void;
    className?: string;
  }
  
  export interface PaymentTimelineProps {
    currentStep: number;
  }
  
  export interface SecurityBadgeProps {
    className?: string;
  }