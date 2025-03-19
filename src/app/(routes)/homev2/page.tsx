"use client";
import { AboutCompany } from "@/components/home/AboutCompany/AboutCompany";
import { ContactSection } from "@/components/home/ContactSection/ContactSection";
import { HeroSection } from "@/components/home/HeroSection/HeroSection";
import { KeyMetrics } from "@/components/home/KeyMetrics/KeyMetrics";
import { ServiceCards } from "@/components/home/ServiceCards/ServiceCards";
import { ServicesSlider } from "@/components/home/ServicesSlider/ServicesSlider";
import { AceternityUIAnimatedTestimonialsUse } from "@/components/ui/AcUI/AnimatedTestimonials/AnimatedTestimonialsUse";
import { BentoGridtextImages } from "@/components/ui/AcUI/BentoGridTxtImg/BentoGridTxtImg";
import styles from "./page.module.scss";
import { TestimonialsSlider } from "@/components/home/TestimonialsSlider/TestimonialsSlider";
import ContactPage from "../contact/page";
import HeroSectionv2 from "@/components/homev2/HeroSection/HeroSection";

export default function HomePagev2() {
  return (
    <main className={styles.main}>
      <HeroSectionv2 />
    </main>
  );
}
