# Privacy Policy Component for CyberFort Tech

This README provides comprehensive documentation for the Privacy Policy component developed for the CyberFort Tech About Us page. The component offers an interactive, visually appealing way to present privacy policy information with responsive layouts for both desktop and mobile devices.

## Table of Contents

1. [Overview](#overview)
2. [File Structure](#file-structure)
3. [Features](#features)
4. [Implementation Guide](#implementation-guide)
5. [Component Props & Types](#component-props--types)
6. [Styling Structure](#styling-structure)
7. [Mobile Responsiveness](#mobile-responsiveness)
8. [Dark Mode Support](#dark-mode-support)
9. [Animation Details](#animation-details)
10. [Customization Guide](#customization-guide)

## Overview

The Privacy Policy component provides a modern, interactive interface for displaying privacy policy information. It features a tab-based navigation system with themed sections, animated content transitions, and separate optimized layouts for desktop and mobile views.

![Privacy Policy Component](privacy-policy-screenshot.png)

## File Structure

```
components/
└── aboutus/
    └── PrivacyPolicy/
        ├── PrivacyPolicy.tsx       # Main component
        └── PrivacyPolicy.module.scss  # Component styles
```

## Features

- **Themed Sections**: Each policy section has a unique color theme
- **Tab-Based Navigation**: Easy access to all policy sections
- **Responsive Design**: Optimized layouts for both desktop and mobile
- **Dark Mode Support**: Full compatibility with dark theme
- **Animated Transitions**: Smooth animations between sections
- **Detailed Information Cards**: Structured content presentation
- **Accessibility Friendly**: Clear visual hierarchy and navigation
- **Expandable Sections**: On mobile, sections expand in-place

## Implementation Guide

### 1. Component Installation

First, create the necessary files in your project structure:

```bash
mkdir -p components/aboutus/PrivacyPolicy
touch components/aboutus/PrivacyPolicy/PrivacyPolicy.tsx
touch components/aboutus/PrivacyPolicy/PrivacyPolicy.module.scss
```

### 2. Add Component to About Page

Import and add the PrivacyPolicy component to your About page:

```tsx
// about.tsx
import { PrivacyPolicy } from '@/components/aboutus/PrivacyPolicy/PrivacyPolicy';

export default function AboutPage() {
  // Other page content
  
  return (
    <div className={styles.aboutContainer}>
      {/* Other sections */}
      
      {/* Privacy Policy Section */}
      <section className={styles.privacySection}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={styles.sectionHeader}
        >
          <h2>Privacy Policy</h2>
          <p>Our commitment to protecting your data and privacy</p>
        </motion.div>
        
        <PrivacyPolicy />
      </section>
    </div>
  );
}
```

### 3. Update About Page Styles

Make sure to add the privacy section styling to your about.module.scss:

```scss
// about.module.scss

// Privacy Policy Section
.privacySection {
  margin: 6rem 0;
  padding: 3rem 0;
  background-color: #f9fafb;
  border-radius: 1.5rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  position: relative;
  
  @media (max-width: 768px) {
    padding: 2rem 0;
    margin: 4rem 0;
    border-radius: 1rem;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 8px;
    background: linear-gradient(90deg, #3b82f6, #60a5fa);
  }
}

// Dark mode support
:global(.dark) {
  .privacySection {
    background-color: #111827;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    
    &::before {
      background: linear-gradient(90deg, #60a5fa, #93c5fd);
    }
  }
}
```

## Component Props & Types

The Privacy Policy component uses the following TypeScript interfaces:

```typescript
// Theme colors for each section
interface SectionTheme {
  color: string;
  bgColor: string;
}

// Detail items within each section
interface DetailItem {
  title: string;
  description: string;
}

// Main props for each privacy section
interface PrivacySectionProps {
  id: number;
  title: string;
  content: ReactNode;
  icon: ReactNode;
  theme: SectionTheme;
  detailItems: DetailItem[];
}
```

## Styling Structure

The component's SCSS module is organized into several sections:

1. **Container & Header Styles**: Basic layout and header presentation
2. **Responsive Layout Management**: Controls for desktop vs mobile views
3. **Desktop Tab Layout**: Styles for the left sidebar navigation
4. **Mobile Accordion Layout**: Styles for the expandable mobile sections
5. **Content Panels**: Styles for the main content area
6. **Detail Items**: Card styling for the detailed content points
7. **Dark Mode Overrides**: Theme-specific adjustments for dark mode

## Mobile Responsiveness

The component implements two separate views:

### Desktop View (> 940px)
- Left sidebar navigation with tabs
- Content panel on the right
- Two-column grid for detail items

### Mobile View (< 940px)
- Accordion-style expandable sections
- Content appears directly below the expanded section header
- Single-column layout for detail items
- Optimized touch targets and spacing

## Dark Mode Support

The component automatically adapts to dark mode through CSS variables and specific dark mode overrides:

- Background colors adjust for better contrast
- Text colors change for better readability
- Card and border colors are modified for the dark theme
- Hover and active states maintain proper visibility

## Animation Details

Multiple animations enhance the user experience:

1. **Section Transitions**: Smooth fades when switching between tabs
2. **Staggered Content**: Detail items appear sequentially with slight delays
3. **Hover Effects**: Subtle scaling and elevation changes on interaction
4. **Header Animation**: Initial fade-in and slide-up effect
5. **Tab Hover**: Movement animations for tab selection

## Customization Guide

### Modifying Content

To update the privacy policy content, modify the `privacySections` array in the PrivacyPolicy component:

```typescript
const privacySections: PrivacySectionProps[] = [
  {
    id: 1,
    title: "Your Custom Title",
    icon: <YourCustomIcon size={22} />,
    theme: sectionThemes[1],
    detailItems: [
      {
        title: "Custom Detail Title",
        description: "Your custom description text here."
      },
      // Add more detail items as needed
    ],
    content: (
      <p>Your custom introductory content here.</p>
    )
  },
  // Add more sections as needed
];
```

### Modifying Themes

To adjust the color themes, modify the `sectionThemes` object:

```typescript
const sectionThemes = {
  1: { color: '#YOUR_COLOR', bgColor: 'rgba(R, G, B, 0.1)' },
  // Update other themes as needed
};
```

### Adjusting Layout

For layout modifications, edit the relevant sections in the SCSS module:

- Adjust `tabsContainer` width to change the sidebar size
- Modify `detailsList` grid settings to change the card layout
- Update padding and margins as needed for spacing adjustments

## Conclusion

This Privacy Policy component provides a modern, interactive way to present privacy information on your About page. Its responsive design ensures a great user experience across all devices, while the themed sections add visual interest to what could otherwise be a dry legal document.