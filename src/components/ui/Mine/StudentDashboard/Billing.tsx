'use client'

// src/components/ui/Mine/StudentDashboard/Billing.tsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { motion } from "framer-motion";
import { CreditCard, Download, Clock, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { Button } from '@heroui/button';

interface PaymentMethod {
  id: string;
  last4: string;
  brand: string;
  expiryMonth: number;
  expiryYear: number;
}

interface Invoice {
  id: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  date: string;
  invoiceUrl: string;
}

interface Subscription {
  plan: string;
  status: string;
  nextBillingDate: string;
  amount: number;
}

export const Billing = () => {
  const [paymentMethods, setPaymentMethods] = React.useState<PaymentMethod[]>([]);
  const [invoices, setInvoices] = React.useState<Invoice[]>([]);
  const [subscription, setSubscription] = React.useState<Subscription | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchBillingData = async () => {
      try {
        const [methodsRes, invoicesRes, subscriptionRes] = await Promise.all([
          axios.get('/api/student/payment-methods'),
          axios.get('/api/student/invoices'),
          axios.get('/api/student/subscription')
        ]);

        setPaymentMethods(methodsRes.data);
        setInvoices(invoicesRes.data);
        setSubscription(subscriptionRes.data);
      } catch (error) {
        console.error('Error fetching billing data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBillingData();
  }, []);

  const handleUpdatePaymentMethod = async () => {
    // Implement Stripe or your payment processor's update logic
    console.log('Update payment method');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Current Subscription */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Current Subscription
          </CardTitle>
        </CardHeader>
        <CardContent>
          {subscription ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{subscription.plan}</h3>
                  <p className="text-sm text-gray-500">
                    Next billing date: {new Date(subscription.nextBillingDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${subscription.amount}/month</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                    subscription.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {subscription.status}
                  </span>
                </div>
              </div>
              <Button variant="solid" className="w-full sm:w-auto">
                Manage Subscription
              </Button>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500">No active subscription</p>
              <Button className="mt-2">Subscribe Now</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Payment Methods
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <motion.div
                key={method.id}
                className="flex justify-between items-center p-4 border rounded-lg"
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-center gap-4">
                  <CreditCard className="w-6 h-6 text-gray-500" />
                  <div>
                    <p className="font-medium">{method.brand} •••• {method.last4}</p>
                    <p className="text-sm text-gray-500">
                      Expires {method.expiryMonth}/{method.expiryYear}
                    </p>
                  </div>
                </div>
                <Button variant="solid" size="sm">
                  Edit
                </Button>
              </motion.div>
            ))}
            <Button 
              onClick={handleUpdatePaymentMethod}
              className="w-full sm:w-auto"
            >
              Add Payment Method
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Billing History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {invoices.length > 0 ? (
              invoices.map((invoice) => (
                <motion.div
                  key={invoice.id}
                  className="flex justify-between items-center p-4 border rounded-lg"
                  whileHover={{ scale: 1.01 }}
                >
                  <div>
                    <p className="font-medium">
                      Invoice - {new Date(invoice.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">${invoice.amount}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(invoice.status)}`}>
                      {invoice.status}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(invoice.invoiceUrl)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                No billing history available
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Need Help Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Need Help?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-gray-600">
              If you have any questions about your billing or need assistance, 
              our support team is here to help.
            </p>
            <Button variant="solid" className="w-full sm:w-auto">
              Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};