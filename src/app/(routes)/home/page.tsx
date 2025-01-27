// import { HeroSection } from '@/components/home/HeroSection';
// import { ServiceCards } from '@/components/home/ServiceCards';
// import { AboutCompany } from '@/components/home/AboutCompany';
// import { KeyMetrics } from '@/components/home/KeyMetrics';
// import { ServicesSlider } from '@/components/home/ServicesSlider';
// import { ContactSection } from '@/components/home/ContactSection';
// import { TestimonialsSlider } from '@/components/home/TestimonialsSlider';
import { AboutCompany } from '@/components/home/AboutCompany/AboutCompany';
import { ContactSection } from '@/components/home/ContactSection/ContactSection';
import { HeroSection } from '@/components/home/HeroSection/HeroSection';
import { KeyMetrics } from '@/components/home/KeyMetrics/KeyMetrics';
import { ServiceCards } from '@/components/home/ServiceCards/ServiceCards';
import { ServicesSlider } from '@/components/home/ServicesSlider/ServicesSlider';
import { TestimonialsSlider } from '@/components/home/TestimonialsSlider/TestimonialsSlider';
import styles from './page.module.scss';
import { AceternityUIAnimatedTestimonialsUse } from '@/components/ui/AcUI/AnimatedTestimonials/AnimatedTestimonialsUse';
import { AcUIWorldMap } from '@/components/ui/AcUI/WorldMap/WorldMap';
import { BentoGridtextImages } from '@/components/ui/AcUI/BentoGridTxtImg/BentoGridTxtImg';
import { BackgroundBeams } from '@/components/ui/AcUI/BackgroundBeams/background-beams';

export default function HomePage() {
  return (
    <main className={styles.main}>
      <HeroSection />
      <ServiceCards />
      
      <AboutCompany />
      <KeyMetrics />
      <ServicesSlider />
      <BentoGridtextImages />
      {/* <AcUIWorldMap /> */}
      <ContactSection />
      <AceternityUIAnimatedTestimonialsUse /> 
      {/* have to look for above error */}
    </main>
  );
}