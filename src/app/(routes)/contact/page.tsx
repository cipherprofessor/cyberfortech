// import { ContactForm } from '@/components/contact/ContactForm';
// import { ContactInfo } from '@/components/contact/ContactInfo';
import { Map } from './Map/Map';
// import { FAQ } from '@/components/contact/FAQ';
import styles from './contact.module.scss';
import { ContactForm } from './ContactForm/ContactForm';
import { ContactInfo } from './ContactInfo/ContactInfo';
import { FAQ } from './FAQ/FAQ';

export default function ContactPage() {
  const contactInfo = [
    {
      title: "Main Office",
      address: "123 Tech Street, Cyber City",
      email: "info@cyberfortech.com",
      phone: "+1 (555) 123-4567",
    },
    {
      title: "Support",
      email: "support@cyberfortech.com",
      phone: "+1 (555) 987-6543",
      hours: "24/7 Support",
    },
  ];

  const faqs = [
    {
      question: "How can I enroll in a course?",
      answer: "You can enroll in any course by visiting the course page and clicking the 'Enroll Now' button. You'll need to create an account or sign in if you haven't already.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. All payments are processed securely.",
    },
    {
      question: "Do you offer refunds?",
      answer: "Yes, we offer a 30-day money-back guarantee for all our courses. If you're not satisfied with the course, you can request a full refund within 30 days of purchase.",
    },
    {
      question: "Are the courses self-paced?",
      answer: "Yes, all our courses are self-paced. You can learn at your own speed and access the course materials 24/7 from anywhere.",
    },
  ];

  return (
    <div className={styles.contactContainer}>
      <section className={styles.hero}>
        <h1>Contact Us</h1>
        <p>Get in touch with our team for any questions or support</p>
      </section>

      <div className={styles.content}>
        <section className={styles.mainSection}>
          <div className={styles.formSection}>
            <h2>Send us a Message</h2>
            <ContactForm />
          </div>

          <div className={styles.infoSection}>
            <ContactInfo locations={contactInfo} />
          </div>
        </section>

        <section className={styles.mapSection}>
          <h2>Visit Our Office</h2>
          <Map />
        </section>

        <section className={styles.faqSection}>
          <h2>Frequently Asked Questions</h2>
          <FAQ questions={faqs} />
        </section>
      </div>
    </div>
  );
}