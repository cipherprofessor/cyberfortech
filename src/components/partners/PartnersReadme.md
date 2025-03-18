# CyberFort Partners Page Components

This directory contains all the reusable components for the CyberFort Partners page. These components are designed to be modular, responsive, and customizable to fit the needs of the partners page.

## Overview

The partners page is built using the following components:

1. **PartnersList** - Displays current partners with filtering options
2. **PartnershipTypeCards** - Shows different partnership opportunities available
3. **PartnershipBenefits** - Highlights the benefits of partnering with CyberFort
4. **PartnershipProcess** - Explains the partnership process step by step
5. **PartnerTestimonials** - Showcases testimonials from existing partners
6. **PartnerContactForm** - A customized contact form for partnership inquiries

## Components

### PartnersList

A grid-based component that displays partner logos, names, descriptions, and additional metadata with filtering capabilities.

**Props:**
None required. The component uses internal data, but could be modified to accept partners data as a prop.

**Features:**
- Partner cards with logo, company name, description
- Category filtering
- Responsive grid layout

### PartnershipTypeCards

Displays different types of partnerships available with CyberFort.

**Props:**
None required. The component uses internal data, but could be modified to accept partnership types as a prop.

**Features:**
- Color-coded cards for different partnership types
- Key benefits list for each partnership type
- Animations on hover

### PartnershipBenefits

Showcases the key benefits of partnering with CyberFort.

**Props:**
None required. The component uses internal data, but could be modified to accept benefits data as a prop.

**Features:**
- Icon-based benefit cards
- Responsive grid layout
- Animation on scroll

### PartnershipProcess

Illustrates the step-by-step process of becoming a partner.

**Props:**
None required. The component uses internal data, but could be modified to accept process steps as a prop.

**Features:**
- Numbered steps with icons
- Animated connecting lines
- Responsive layout that changes orientation on mobile

### PartnerTestimonials

Displays testimonials from current partners in a carousel format.

**Props:**
None required. The component uses internal data, but could be modified to accept testimonials as a prop.

**Features:**
- Animated testimonial carousel
- Navigation controls
- Partner information and logo

### PartnerContactForm

A customized contact form specifically for partnership inquiries.

**Props:**
None required. The component reuses the main ContactForm component.

**Features:**
- Partnership type selector
- Integration with existing ContactForm component
- Next steps sidebar with additional information

## Usage

To use these components in your partners page:

1. Import the components in your partners page file:

```tsx
import { PartnersList } from '@/components/partners/PartnersList/PartnersList';
import { PartnershipTypeCards } from '@/components/partners/PartnershipTypeCards/PartnershipTypeCards';
import { PartnershipBenefits } from '@/components/partners/PartnershipBenefits/PartnershipBenefits';
import { PartnershipProcess } from '@/components/partners/PartnershipProcess/PartnershipProcess';
import { PartnerTestimonials } from '@/components/partners/PartnerTestimonials/PartnerTestimonials';
import { PartnerContactForm } from '@/components/partners/PartnerContactForm/PartnerContactForm';
```

2. Add the components to your JSX:

```tsx
export default function PartnersPage() {
  return (
    <div className={styles.partnersContainer}>
      {/* Hero section */}
      
      {/* Partners section */}
      <section className={styles.partnersSection}>
        <h2>Our Trusted Partners</h2>
        <PartnersList />
      </section>
      
      {/* Other sections using the components */}
      <section className={styles.partnershipTypesSection}>
        <h2>Partnership Opportunities</h2>
        <PartnershipTypeCards />
      </section>
      
      {/* ... */}
      
      <section className={styles.contactSection}>
        <h2>Become a Partner</h2>
        <PartnerContactForm />
      </section>
    </div>
  );
}
```

## Customization

### Styling

Each component has its own SCSS module file for styling. You can customize the appearance by modifying these files.

### Data

Components currently use hardcoded data for demonstration purposes. For production use, you should modify the components to accept data as props or fetch from an API.

### Images

Components reference images from the `/public/partners/` directory. Make sure to add the necessary images:
- Partner logos
- Testimonial profile pictures
- Background patterns for hero and sidebar sections

## Dependencies

These components rely on:
- NextJS for image optimization
- Framer Motion for animations
- Lucide React for icons
- The existing ContactForm component

## Accessibility

All components are built with accessibility in mind:
- Semantic HTML structure
- Proper ARIA labels for interactive elements
- Keyboard navigation support
- Color contrast ratios for readability

## Dark Mode Support

All components include dark mode styles via the `:global(.dark)` selector for compatibility with your theme switching system.