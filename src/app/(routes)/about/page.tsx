"use client"
import Image from 'next/image';
import styles from './about.module.scss';
import { StatsSection } from './StatsSection/StatsSection';
import { TeamMember } from './TeamMember/TeamMember';
import { Timeline } from './Timeline/Timeline';
import { AcUITimeline } from '@/components/ui/AcUI/TimeLine/TimeLineDemo';
import { AcUiBentoGrid } from '@/components/ui/AcUI/BentoGrid/BentoGrid';

export default function AboutPage() {
  const team = [
    {
      name: "Ayan Ali Dar",
      role: "Founder & CEO ",
      image: "/team/ayan.png",
      bio: "7+ years of experience in Marketing and Business Development",
      socialLinks: {
        linkedin: "https://www.linkedin.com/in/cyberfortech/",
        twitter: "https://twitter.com/johndoe",
      },
    },
    {
      name: "Mohsin Manzoor Bhat",
      role: "Instructor - AWS And Full Stack Developer",
      image: "/team/mohsin.jpg",
      bio: "3 Years of Experience in Cloud And Full Stack Development",
      socialLinks: {
        linkedin: "https://www.linkedin.com/in/bhatmohsin1913/",
        twitter: "https://twitter.com/johndoe",
      },
    },
    {
      name: "Priyanka",
      role: "CFO",
      image: "/testm/testm2.avif",
      bio: "5+ years of experience in finance and accounting",
      socialLinks: {
        linkedin: "https://linkedin.com/in/johndoe",
        twitter: "https://twitter.com/johndoe",
      },
    },
  ];

  const timeline = [
    {
      year: "2020",
      title: "Founded CyberForTech",
      description: "Started with a vision to make cybersecurity education accessible to everyone.",
    },
    {
      year: "2021",
      title: "Launched Pro Courses",
      description: "Introduced advanced certification programs for professionals.",
    },
    {
      year: "2022",
      title: "Global Expansion",
      description: "Reached students from over 50 countries worldwide.",
    },
    {
      year: "2023",
      title: "Industry Partnerships",
      description: "Collaborated with leading tech companies for job placements.",
    },
  ];

  return (
    <div className={styles.aboutContainer}>
      {/* <section className={styles.hero}>
        <div className={styles.content}>
          <h1>About CyberForTech</h1>
          <p>
            Empowering the next generation of cybersecurity professionals through
            expert-led education and hands-on training.
          </p>
        </div>
      </section> */}
      

      <section className={styles.mission}>
        <div className={styles.grid}>
          <div className={styles.imageContainer}>
            <Image
              src="/cyber1.png"
              alt="Our Mission"
              fill
              className={styles.image}
            />
          </div>
          <div className={styles.text}>
            <h2>Our Mission</h2>
            <p>
              At CyberForTech, we believe that cybersecurity education should be
              accessible, practical, and up-to-date with the latest industry trends.
              Our mission is to bridge the cybersecurity skills gap by providing
              high-quality training that combines theoretical knowledge with
              hands-on experience.
            </p>
            <div className={styles.values}>
              <div className={styles.value}>
                <h3>Quality Education</h3>
                <p>Expert-led courses with real-world applications</p>
              </div>
              <div className={styles.value}>
                <h3>Practical Experience</h3>
                <p>Hands-on labs and real-world scenarios</p>
              </div>
              <div className={styles.value}>
                <h3>Community Support</h3>
                <p>Active learning community and mentorship</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <StatsSection />

      <section className={styles.BentoGrid}>
      <AcUiBentoGrid/>
      </section>

      <section className={styles.journey}>
        {/* <h2>Our Journey</h2>
        <Timeline events={timeline} /> */}
        <AcUITimeline />
      </section>

      <section className={styles.team}>
        <h2>Meet Our Team</h2>
        <div className={styles.teamGrid}>
          {team.map((member) => (
            <TeamMember key={member.name} member={member} />
          ))}
        </div>
      </section>
    </div>
  );
}