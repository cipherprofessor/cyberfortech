# Service Pages Implementation Guide

This comprehensive guide provides detailed instructions on implementing the service pages for your NextJS learning management system. This implementation includes a centralized reusable component architecture with proper TypeScript typing, SCSS module styling, and responsive design.

## Table of Contents

1. [Project Structure](#project-structure)
2. [Component Architecture](#component-architecture)
3. [Installation & Setup](#installation--setup)
4. [Core Components](#core-components)
   - [ServiceDetail Component](#servicedetail-component)
   - [ServiceNavigation Component](#servicenavigation-component)
   - [ServiceCards Component](#servicecards-component)
5. [Page Components](#page-components)
   - [Main Services Page](#main-services-page)
   - [Dynamic Service Pages](#dynamic-service-pages)
6. [Utility Functions](#utility-functions)
7. [Styling System](#styling-system)
8. [Routing & Navigation](#routing--navigation)
9. [Adding New Services](#adding-new-services)
10. [Performance Considerations](#performance-considerations)
11. [Accessibility Features](#accessibility-features)
12. [Testing](#testing)

## Project Structure

```
/app
  /services
    page.tsx                  # Main services page
    layout.tsx                # Layout for service pages
    /[serviceName]            # Dynamic route for service pages
      page.tsx                # Dynamic service page component
/components
  /ServiceDetail              # Main service detail component
    ServiceDetail.tsx         # Component implementation
    ServiceDetail.module.scss # Component styles
    types.ts                  # TypeScript types and interfaces
  /ServiceNavigation          # Service navigation component
    ServiceNavigation.tsx     # Component implementation
    ServiceNavigation.module.scss # Component styles
  /ServiceCards               # Service cards grid component
    ServiceCards.tsx          # Component implementation (updated with links)
    ServiceCards.module.scss  # Component styles
  /services                   # Individual service page components
    NetworkSecurityPage.tsx
    ApplicationSecurityPage.tsx
    CloudSecurityPage.tsx
    PenetrationTestingPage.tsx
    SecurityCompliancePage.tsx
    IncidentResponsePage.tsx
    AWSCloudSecurityPage.tsx
    FullStackDevelopmentPage.tsx
    index.ts                  # Barrel file for exports
/utils
  colorUtils.ts               # Utility functions for color processing
```

## Component Architecture

The architecture follows a modular approach with these key concepts:

1. **Core Reusable Components**: `ServiceDetail` serves as the foundation for all service pages
2. **Type-Safety**: Strong TypeScript typing with interfaces for all components
3. **Style Isolation**: SCSS modules for component-scoped styles
4. **Responsive Design**: Mobile-first approach with appropriate breakpoints
5. **Performance**: Dynamic imports for code splitting
6. **Accessibility**: ARIA attributes and semantic HTML throughout

## Installation & Setup

1. Make sure to have the required dependencies:

```bash
npm install framer-motion lucide-react react-countup
```

2. Copy the provided component files to their respective directories in your project
3. Update your file paths if your project structure differs
4. Ensure your Next.js app router is correctly configured

## Core Components

### ServiceDetail Component

This is the primary reusable component that powers all individual service pages.

#### Key Files:
- `ServiceDetail.tsx`: Main component implementation
- `ServiceDetail.module.scss`: SCSS module for styling
- `types.ts`: TypeScript interfaces

#### Component Props:

```typescript
interface ServiceDetailProps {
  /**
   * The title of the service
   */
  title: string;
  
  /**
   * A detailed description of the service
   */
  description: string;
  
  /**
   * The main icon representing the service
   */
  icon?: LucideIcon;
  
  /**
   * Primary color for the service (used for accents and highlights)
   * @default "#007bff"
   */
  color?: string;
  
  /**
   * List of features offered as part of this service
   */
  features?: string[];
  
  /**
   * List of benefits that clients can expect
   */
  benefits?: BenefitItem[];
  
  /**
   * Case studies demonstrating service effectiveness
   */
  caseStudies?: CaseStudyItem[];
  
  /**
   * Call-to-action button text
   * @default "Get a Free Consultation"
   */
  contactCTA?: string;
  
  /**
   * Additional CSS class names
   */
  className?: string;
}
```

#### Usage Example:

```tsx
import { Network } from 'lucide-react';
import ServiceDetail from '@/components/ServiceDetail/ServiceDetail';

const NetworkSecurityPage = () => {
  return (
    <ServiceDetail
      title="Network Security"
      description="Comprehensive network security services..."
      icon={Network}
      color="#007bff"
      features={[
        "Network Vulnerability Assessments",
        "Penetration Testing",
        // More features...
      ]}
      benefits={[
        {
          title: "Proactive Protection",
          description: "Identify vulnerabilities before they're exploited"
        },
        // More benefits...
      ]}
      caseStudies={[
        {
          title: "Financial Institution Security",
          description: "Helped a regional bank improve security...",
          link: "/case-studies/financial-security"
        },
        // More case studies...
      ]}
    />
  );
};
```

#### Key Features:

- **Section Layout**: Organized into header, features, benefits, case studies, and CTA
- **Animations**: Smooth reveal animations using Framer Motion
- **Customization**: Color theming using CSS variables
- **Responsive Design**: Adapts to all screen sizes
- **Accessibility**: Proper ARIA attributes and semantic HTML

### ServiceNavigation Component

This component provides navigation across different service pages.

#### Key Files:
- `ServiceNavigation.tsx`: Component implementation
- `ServiceNavigation.module.scss`: Styling for the navigation

#### Features:

- **Active State**: Highlights the current service page
- **Responsive**: Collapses to vertical layout on mobile
- **Animated**: Smooth reveal animations
- **Themeable**: Respects light/dark mode
- **Custom Icons**: Each service has its own icon

### ServiceCards Component

Grid display of all services on the main services page.

#### Key Files:
- `ServiceCards.tsx`: Updated component with service links
- `ServiceCards.module.scss`: Existing styles

#### Updates Made:

- Added proper links to each service page
- Enhanced with CSS RGB variables for better transitions
- Improved accessibility

## Page Components

### Main Services Page

Located at `/app/services/page.tsx`, this page displays the `ServiceCards` component showcasing all available services.

### Dynamic Service Pages

The dynamic route `/app/services/[serviceName]/page.tsx` handles all individual service pages through:

1. Dynamic imports of service components for code splitting
2. Path-based component resolution
3. Loading and error states
4. Integration with `ServiceNavigation`

## Utility Functions

### Color Utilities

Located in `utils/colorUtils.ts`, these functions help with color manipulation:

```typescript
/**
 * Converts a hex color string to RGB values for CSS variables
 */
export const hexToRgb = (hex: string): string => {
  // Implementation...
};

/**
 * Creates CSS variables for a color and its RGB values
 */
export const createColorVars = (color: string): React.CSSProperties => {
  // Implementation...
};
```

## Styling System

The styling system uses:

1. **SCSS Modules**: Component-scoped styles
2. **CSS Variables**: Dynamic theming via `--service-color` and `--service-color-rgb`
3. **Light/Dark Mode**: Support via `:global(.dark)` selectors
4. **Responsive Breakpoints**:
   - Mobile: Up to 480px
   - Tablet: 481px to 768px
   - Desktop: 769px and above
5. **Animations**: Mix of Framer Motion and CSS animations

### CSS Variables Example:

```scss
.benefitCard {
  border-top: 3px solid var(--service-color, #007bff);
  
  :global(.dark) & {
    background: rgb(31, 41, 55);
  }
}
```

## Routing & Navigation

The routing structure follows Next.js app router conventions:

1. **Main Services Page**: `/services`
2. **Individual Service Pages**: `/services/[serviceName]`
   - network-security
   - application-security
   - cloud-security
   - penetration-testing
   - security-compliance
   - incident-response
   - aws-cloud-security
   - full-stack-development

The `ServiceNavigation` component provides a consistent navigation experience between these pages.

## Adding New Services

To add a new service:

1. **Create Service Component**:
   ```tsx
   // NewServicePage.tsx
   import React from 'react';
   import { Icon } from 'lucide-react';
   import ServiceDetail from '@/components/ServiceDetail/ServiceDetail';
   
   const NewServicePage = () => {
     return (
       <ServiceDetail
         title="New Service"
         description="Description of the new service"
         icon={Icon}
         color="#hexcolor"
         // Add features, benefits, case studies...
       />
     );
   };
   
   export default NewServicePage;
   ```

2. **Update ServiceCards Component**:
   ```tsx
   // Add to services array
   {
     title: "New Service",
     description: "Brief description...",
     icon: Icon,
     decorativeIcon: Icon,
     link: "/services/new-service",
     color: "#hexcolor"
   }
   ```

3. **Update Dynamic Page Component**:
   ```tsx
   // Add to serviceComponents object
   '/services/new-service': dynamic(() => import('@/components/services/NewServicePage'), {
     loading: () => <LoadingComponent />
   })
   ```

4. **Update Navigation**:
   ```tsx
   // Add to serviceNavItems array
   {
     name: 'New Service',
     path: '/services/new-service',
     icon: Icon,
     color: '#hexcolor'
   }
   ```

5. **Update Barrel File**:
   ```tsx
   // Add to index.ts in /components/services
   export { default as NewServicePage } from './NewServicePage';
   ```

## Performance Considerations

The implementation includes several performance optimizations:

1. **Code Splitting**: Dynamic imports for individual service pages
2. **Lazy Loading**: Components loaded only when needed
3. **Image Optimization**: SVG icons for crisp display without extra downloads
4. **CSS Optimization**: Scoped styles to prevent global CSS bloat
5. **Animations**: Hardware-accelerated animations with minimal repaints
6. **Loading States**: Placeholders during dynamic imports

## Accessibility Features

The components include these accessibility enhancements:

1. **Semantic HTML**: Proper heading hierarchy and landmark regions
2. **ARIA Attributes**: Appropriate labels and roles
3. **Keyboard Navigation**: Focusable interactive elements
4. **Color Contrast**: Sufficient contrast for text readability
5. **Screen Reader Support**: Descriptive text and hidden helper elements

## Testing

To ensure reliability, test the implementation:

1. **Component Testing**:
   - Verify each service page renders correctly
   - Test responsive breakpoints
   - Check light/dark mode transitions

2. **Navigation Testing**:
   - Confirm links work between services
   - Validate active state in navigation
   - Test browser back/forward navigation

3. **Accessibility Testing**:
   - Run automated tools like Lighthouse or axe
   - Test with screen readers
   - Verify keyboard navigation

## Code Deep Dive

### ServiceDetail Component Structure

The `ServiceDetail` component is structured into several key sections:

```jsx
<section className={styles.serviceDetailSection}>
  {/* Breadcrumb Navigation */}
  <motion.nav className={styles.breadcrumb}>...</motion.nav>
  
  {/* Back Button */}
  <motion.div className={styles.backButtonContainer}>...</motion.div>
  
  {/* Header Section */}
  <div className={styles.header}>
    <div className={styles.headerContent}>
      {/* Glow Circle Background */}
      <div className={styles.glowCircle} />
      
      {/* Title Container */}
      <motion.div className={styles.titleContainer}>
        {/* Service Icon */}
        <div className={styles.iconContainer}>...</div>
        
        {/* Title and Underline */}
        <h1 className={styles.title}>...</h1>
        <div className={styles.underline} />
      </motion.div>
      
      {/* Description */}
      <motion.div className={styles.descriptionContainer}>...</motion.div>
    </div>
  </div>
  
  {/* Main Content Grid */}
  <div className={styles.contentGrid}>
    {/* Features Section (conditional) */}
    {features.length > 0 && (
      <motion.div className={styles.featuresContainer}>...</motion.div>
    )}
    
    {/* Benefits Section (conditional) */}
    {benefits.length > 0 && (
      <motion.div className={styles.benefitsContainer}>...</motion.div>
    )}
    
    {/* Case Studies Section (conditional) */}
    {caseStudies.length > 0 && (
      <motion.div className={styles.caseStudiesContainer}>...</motion.div>
    )}
  </div>
  
  {/* CTA Section */}
  <motion.div className={styles.ctaContainer}>...</motion.div>
</section>
```

### Dynamic Page Resolution

The dynamic service page resolution works by:

1. Getting the current path using `usePathname()`
2. Looking up the corresponding component in a mapping object
3. Dynamically importing that component with loading states
4. Rendering a "Not Found" component if no match exists

This approach ensures efficient code splitting while maintaining a consistent UI.

### Animation Logic

Animations are implemented using Framer Motion with:

1. Initial states (hidden, transformed)
2. Animated states (visible, positioned)
3. Transition parameters (duration, delay, easing)
4. Viewport detection for scroll-based reveals
5. Sequential animations via custom indices

Example:
```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: 0.3 }}
>
  Content here...
</motion.div>
```

### Style Architecture

The SCSS modules follow a structured approach:

1. **Global Variables**: Theme colors, spacing, typography
2. **Component Styles**: Layout, appearance, states
3. **Responsive Rules**: Media queries for different devices
4. **Theme Variations**: Light/dark mode adaptations
5. **State Modifiers**: Hover, active, and focus states
6. **Animations**: Keyframes and transitions

This comprehensive guide should provide all the information needed to understand, implement, and extend the service pages in your NextJS learning management system.





# Step-by-Step Implementation Guide

Follow these steps to implement the service pages in your NextJS learning management system:

## 1. Create Directory Structure

First, set up the necessary directory structure:

```bash
# Create component directories
mkdir -p components/ServiceDetail
mkdir -p components/ServiceNavigation
mkdir -p components/services

# Create app router directories
mkdir -p app/services/[serviceName]

# Create utils directory
mkdir -p utils
```

## 2. Install Dependencies

Install the required dependencies:

```bash
npm install framer-motion lucide-react react-countup
# or with yarn
yarn add framer-motion lucide-react react-countup
```

## 3. Create Utility Files

Create the color utilities file:

```bash
# Create the color utilities file
touch utils/colorUtils.ts
```

Copy the content from the `colorUtils.ts` artifact into this file.

## 4. Create Core Components

### Service Detail Component

Create the following files:

```bash
touch components/ServiceDetail/ServiceDetail.tsx
touch components/ServiceDetail/ServiceDetail.module.scss
touch components/ServiceDetail/types.ts
```

Copy the content from the corresponding artifacts into these files.

### Service Navigation Component

Create the following files:

```bash
touch components/ServiceNavigation/ServiceNavigation.tsx
touch components/ServiceNavigation/ServiceNavigation.module.scss
```

Copy the content from the corresponding artifacts into these files.

### Update Service Cards Component

Update your existing ServiceCards component with the provided code from the `service-updated-cards` artifact.

## 5. Create Service Page Components

For each service, create a component file:

```bash
touch components/services/NetworkSecurityPage.tsx
touch components/services/ApplicationSecurityPage.tsx
touch components/services/CloudSecurityPage.tsx
touch components/services/PenetrationTestingPage.tsx
touch components/services/SecurityCompliancePage.tsx
touch components/services/IncidentResponsePage.tsx
touch components/services/AWSCloudSecurityPage.tsx
touch components/services/FullStackDevelopmentPage.tsx
touch components/services/index.ts
```

Copy the content from the corresponding artifacts into each file.

## 6. Create App Router Pages

### Main Services Page

Create the main services page:

```bash
touch app/services/page.tsx
```

Copy the content from the `services-index-page` artifact.

### Dynamic Service Pages

Create the layout and page for the dynamic service routes:

```bash
touch app/services/layout.tsx
touch app/services/[serviceName]/page.tsx
```

Copy the content from the corresponding artifacts.

## 7. Test the Implementation

1. Start your development server:

```bash
npm run dev
# or with yarn
yarn dev
```

2. Navigate to `/services` to verify the main services page
3. Click on each service card to test navigation
4. Verify that the back navigation works
5. Test the responsive layout on different screen sizes

## 8. Customize Content

Customize the content of each service page according to your specific requirements. You can:

- Update service descriptions
- Change icons or colors
- Add more detailed features, benefits, and case studies
- Modify the CTA text or links

## 9. Adding a New Service (Example)

To add a new service (e.g., "Data Protection"):

1. Create the service page component:

```tsx
// components/services/DataProtectionPage.tsx
"use client";

import React from 'react';
import { Shield } from 'lucide-react';
import ServiceDetail from '@/components/ServiceDetail/ServiceDetail';

const DataProtectionPage = () => {
  return (
    <ServiceDetail
      title="Data Protection"
      description="Comprehensive data protection services to safeguard your sensitive information and ensure compliance with regulations."
      icon={Shield}
      color="#9c27b0"
      features={[
        "Data encryption and secure storage solutions",
        "Access control and data loss prevention",
        "Compliance with GDPR, HIPAA, and other regulations",
        "Data backup and recovery planning"
      ]}
      benefits={[
        {
          title: "Reduced Risk",
          description: "Minimize the risk of data breaches and unauthorized access"
        },
        {
          title: "Regulatory Compliance",
          description: "Meet all legal requirements for data protection"
        }
      ]}
      caseStudies={[
        {
          title: "Healthcare Data Security",
          description: "Implemented comprehensive data protection for a healthcare provider, ensuring patient data security and HIPAA compliance.",
          link: "/case-studies/healthcare-data-protection"
        }
      ]}
    />
  );
};

export default DataProtectionPage;
```

2. Update the barrel file:

```tsx
// components/services/index.ts
// Add this line
export { default as DataProtectionPage } from './DataProtectionPage';
```

3. Update the `ServiceNavigation` component:

```tsx
// Add to serviceNavItems array in ServiceNavigation.tsx
{
  name: 'Data Protection',
  path: '/services/data-protection',
  icon: Shield,
  color: '#9c27b0'
}
```

4. Update the `ServiceCards` component:

```tsx
// Add to services array in ServiceCards.tsx
{
  title: "Data Protection",
  description: "Comprehensive data protection services to safeguard your sensitive information.",
  icon: Shield,
  decorativeIcon: Shield,
  link: "/services/data-protection",
  color: "#9c27b0"
}
```

5. Update the dynamic page resolution:

```tsx
// Add to serviceComponents object in [serviceName]/page.tsx
'/services/data-protection': dynamic(() => import('@/components/services/DataProtectionPage'), {
  loading: () => <LoadingComponent />
})
```

## 10. Troubleshooting Common Issues

### Styling Issues

If styles aren't applying correctly:

1. Make sure you're importing the SCSS modules correctly
2. Check that you've set up Next.js to support SCSS modules
3. Verify the class names match between your JSX and SCSS files

### Navigation Issues

If navigation isn't working:

1. Check that your route paths match exactly in all places
2. Verify that the Next.js app router is configured correctly
3. Ensure dynamic imports are correctly set up

### Animation Issues

If animations aren't working:

1. Verify that Framer Motion is installed correctly
2. Check browser console for any errors
3. Ensure you've wrapped your component with motion components

### Component Reuse Issues

If you're having trouble reusing components:

1. Check that props are passed correctly
2. Verify that all required props are provided
3. Make sure imported components have the correct paths

## Conclusion

Following these steps should give you a fully functional service page implementation with a consistent design, smooth animations, and proper routing. The modular architecture makes it easy to maintain and extend as your project grows.