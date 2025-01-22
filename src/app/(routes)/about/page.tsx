"use client"
import Image from 'next/image';
import styles from './about.module.scss';
import { StatsSection } from './StatsSection/StatsSection';
import { TeamMember } from './TeamMember/TeamMember';
import { Timeline } from './Timeline/Timeline';

export default function AboutPage() {
  const team = [
    {
      name: "John Doe",
      role: "Founder & Lead Instructor",
      image: "/team/john-doe.jpg",
      bio: "15+ years of experience in cybersecurity",
      socialLinks: {
        linkedin: "https://linkedin.com/in/johndoe",
        twitter: "https://twitter.com/johndoe",
      },
    },
    // Add more team members...
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
      <section className={styles.hero}>
        <div className={styles.content}>
          <h1>About CyberForTech</h1>
          <p>
            Empowering the next generation of cybersecurity professionals through
            expert-led education and hands-on training.
          </p>
        </div>
      </section>

      <section className={styles.mission}>
        <div className={styles.grid}>
          <div className={styles.imageContainer}>
            <Image
              src="/about/mission.jpg"
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

      <section className={styles.journey}>
        <h2>Our Journey</h2>
        <Timeline events={timeline} />
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