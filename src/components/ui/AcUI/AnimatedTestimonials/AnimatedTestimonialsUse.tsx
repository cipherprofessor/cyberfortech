"use client";
import { motion } from 'framer-motion';
// import { AnimatedTestimonials } from "./animated-testimonials";
import dynamic from 'next/dynamic';

// Dynamically import the AnimatedTestimonials component
const AnimatedTestimonials = dynamic(
  () => import('./animated-testimonials').then(mod => mod.AnimatedTestimonials),
  { ssr: false } // Disable server-side rendering
);



export function AceternityUIAnimatedTestimonialsUse() {
  const testimonials = [
    {
      quote:
        "I particularly appreciated the depth of knowledge shared in the advanced penetration testing course. The instructors are clearly experts in their field and provide valuable insights beyond just the theoretical concepts.",
      name: "Sarah Chen",
      designation: "Network Security Engineer",
      src: "/testm/testimonial1.jpg",
    },
    {
      quote:
        "After completing multiple certifications through CyberForTech, I was able to secure a senior position in cybersecurity. The curriculum is comprehensive and up-to-date with current industry trends.",
      name: "Michael Rodriguez",
      designation: "Information Security Manager",
      src: "/testm/testm1.avif",
    },
    {
      quote:
        "The cloud security certification program exceeded my expectations. It provided deep insights into securing cloud infrastructure and helped me transition into cloud security architecture.",
      name: "Emily Watson",
      designation: "Cloud Security Architect",
      src: "/testm/testm2.avif",
    },
    {
      quote:
        "Outstanding support and robust features. It's rare to find a product that delivers on all its promises.",
      name: "James Kim",
      designation: "Engineering Lead at DataPro",
      src: "/testm/testm3.webp",
    },
    {
      quote:
        "The scalability and performance have been game-changing for our organization. Highly recommend to any growing business.",
      name: "Lisa Thompson",
      designation: "VP of Technology at FutureNet",
      src: "/testm/testm4.jpg",
    },
  ];
  return (
    <div className="flex flex-col items-center justify-center">
      <motion.div 
        className="text-center max-w-2xl mx-auto mb-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-bold mb-4">What Our Students Say</h2>
        <p className="text-gray-600">
          Hear from our successful graduates about their learning experience
        </p>
      </motion.div>
      <AnimatedTestimonials testimonials={testimonials} />
    </div>
  );
}
