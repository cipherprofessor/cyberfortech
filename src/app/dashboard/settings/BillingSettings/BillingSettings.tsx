// src/components/dashboard/settings/BillingSettings/BillingSettings.tsx
import { useState } from 'react';
import { 
  CreditCard, 
  DollarSign, 
  FileText, 
  Calendar,
  CheckCircle,
  AlertTriangle,
  Download,
  Trash2,
  Star,
  StarOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import styles from './BillingSettings.module.scss';

type PaymentMethod = {
  id: string;
  type: 'card';
  last4: string;
  expiry: string;
  brand: string;
  isDefault: boolean;
};

type Invoice = {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  downloadUrl: string;
};

type Subscription = {
  plan: string;
  status: 'active' | 'cancelled' | 'expired';
  renewalDate?: string;
  price: number;
  interval: 'month' | 'year';
};

export function BillingSettings() {
  const [showAddCard, setShowAddCard] = useState(false);
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: '',
  });

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'card',
      last4: '4242',
      expiry: '12/24',
      brand: 'visa',
      isDefault: true,
    },
    {
      id: '2',
      type: 'card',
      last4: '5555',
      expiry: '10/25',
      brand: 'mastercard',
      isDefault: false,
    },
  ]);

  const [subscription] = useState<Subscription>({
    plan: 'Professional',
    status: 'active',
    renewalDate: '2024-02-22',
    price: 49.99,
    interval: 'month',
  });

  const [invoices] = useState<Invoice[]>([
    {
      id: 'INV-001',
      date: '2024-01-20',
      amount: 49.99,
      status: 'paid',
      downloadUrl: '/invoices/INV-001.pdf',
    },
    {
      id: 'INV-002',
      date: '2024-12-20',
      amount: 49.99,
      status: 'paid',
      downloadUrl: '/invoices/INV-002.pdf',
    },
  ]);

  const handleSetDefaultCard = (cardId: string) => {
    setPaymentMethods(methods =>
      methods.map(method => ({
        ...method,
        isDefault: method.id === cardId,
      }))
    );
  };

  const handleRemoveCard = (cardId: string) => {
    if (paymentMethods.length <= 1) {
      alert('You must have at least one payment method');
      return;
    }
    setPaymentMethods(methods =>
      methods.filter(method => method.id !== cardId)
    );
  };

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    // Add card logic here
    setShowAddCard(false);
    setCardData({
      number: '',
      expiry: '',
      cvc: '',
      name: '',
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getCardIcon = (brand: string) => {
    switch (brand.toLowerCase()) {
      case 'visa':
        return '💳';
      case 'mastercard':
        return '💳';
      default:
        return '💳';
    }
  };

  return (
    <div className={styles.billingSettings}>
      <div className={styles.header}>
        <h2>Billing Settings</h2>
        <p>Manage your subscription and payment methods</p>
      </div>

      {/* Current Plan Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitle}>
            <DollarSign className={styles.icon} />
            <h3>Current Plan</h3>
          </div>
          {subscription.status === 'active' && (
            <Button variant="outline">Change Plan</Button>
          )}
        </div>

        <div className={styles.planInfo}>
          <div className={styles.planDetails}>
            <h4>{subscription.plan} Plan</h4>
            <p className={styles.price}>
              {formatCurrency(subscription.price)}/{subscription.interval}
            </p>
          </div>

          <div className={styles.planStatus}>
            <div className={`${styles.badge} ${styles[subscription.status]}`}>
              {subscription.status === 'active' && (
                <CheckCircle className={styles.statusIcon} />
              )}
              {subscription.status === 'cancelled' && (
                <AlertTriangle className={styles.statusIcon} />
              )}
              <span>{subscription.status}</span>
            </div>
            {subscription.renewalDate && subscription.status === 'active' && (
              <p className={styles.renewal}>
                Next renewal on {formatDate(subscription.renewalDate)}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Payment Methods Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitle}>
            <CreditCard className={styles.icon} />
            <h3>Payment Methods</h3>
          </div>
          <Button 
            variant="outline"
            onClick={() => setShowAddCard(true)}
          >
            Add Payment Method
          </Button>
        </div>

        <div className={styles.paymentMethods}>
          {paymentMethods.map((method) => (
            <div key={method.id} className={styles.paymentMethod}>
              <div className={styles.cardInfo}>
                <span className={styles.cardIcon}>
                  {getCardIcon(method.brand)}
                </span>
                <div className={styles.cardDetails}>
                  <span className={styles.cardNumber}>
                    •••• {method.last4}
                  </span>
                  <span className={styles.cardMeta}>
                    Expires {method.expiry}
                  </span>
                </div>
              </div>
              <div className={styles.cardActions}>
                {method.isDefault ? (
                  <div className={styles.defaultBadge}>
                    <Star className={styles.starIcon} />
                    Default
                  </div>
                ) : (
                  <button
                    className={styles.actionButton}
                    onClick={() => handleSetDefaultCard(method.id)}
                  >
                    <StarOff className={styles.actionIcon} />
                    Set as Default
                  </button>
                )}
                <button
                  className={`${styles.actionButton} ${styles.deleteButton}`}
                  onClick={() => handleRemoveCard(method.id)}
                >
                  <Trash2 className={styles.actionIcon} />
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Billing History Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitle}>
            <FileText className={styles.icon} />
            <h3>Billing History</h3>
          </div>
        </div>

        <div className={styles.invoices}>
          {invoices.map((invoice) => (
            <div key={invoice.id} className={styles.invoice}>
              <div className={styles.invoiceInfo}>
                <div className={styles.invoiceMain}>
                  <span className={styles.invoiceId}>{invoice.id}</span>
                  <span className={styles.invoiceDate}>
                    {formatDate(invoice.date)}
                  </span>
                </div>
                <span className={styles.invoiceAmount}>
                  {formatCurrency(invoice.amount)}
                </span>
              </div>
              <div className={styles.invoiceActions}>
                <div className={`${styles.badge} ${styles[invoice.status]}`}>
                  {invoice.status}
                </div>
                <a 
                  href={invoice.downloadUrl}
                  className={styles.downloadButton}
                  download
                >
                  <Download className={styles.downloadIcon} />
                  Download
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Add Card Dialog */}
      <Dialog open={showAddCard} onOpenChange={setShowAddCard}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Payment Method</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddCard} className={styles.addCardForm}>
            <div className={styles.formGroup}>
              <label htmlFor="cardName">Cardholder Name</label>
              <input
                id="cardName"
                type="text"
                value={cardData.name}
                onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="cardNumber">Card Number</label>
              <input
                id="cardNumber"
                type="text"
                value={cardData.number}
                onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                required
                maxLength={16}
              />
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="cardExpiry">Expiry Date</label>
                <input
                  id="cardExpiry"
                  type="text"
                  value={cardData.expiry}
                  onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                  placeholder="MM/YY"
                  required
                  maxLength={5}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="cardCvc">CVC</label>
                <input
                  id="cardCvc"
                  type="text"
                  value={cardData.cvc}
                  onChange={(e) => setCardData({ ...cardData, cvc: e.target.value })}
                  required
                  maxLength={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAddCard(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Card</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}