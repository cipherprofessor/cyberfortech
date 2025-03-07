import { ServiceCards } from '@/components/home/ServiceCards/ServiceCards';
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'Our Services | Cyberfort Technologies',
  description: 'Explore our comprehensive cybersecurity and development services designed to protect your digital assets and accelerate your business growth.',
  openGraph: {
    title: 'Our Services | Cyberfort Technologies',
    description: 'Explore our comprehensive cybersecurity and development services designed to protect your digital assets and accelerate your business growth.',
    type: 'website',
    siteName: 'Cyberfort Technologies',
  },
};

export default function ServicesPage() {
  return (
    <div>
      <ServiceCards />
    </div>
  );
}