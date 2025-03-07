import { LucideIcon } from 'lucide-react';

export interface BenefitItem {
  title: string;
  description: string;
}

export interface CaseStudyItem {
  title: string;
  description: string;
  link?: string;
}

export interface ServiceDetailProps {
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