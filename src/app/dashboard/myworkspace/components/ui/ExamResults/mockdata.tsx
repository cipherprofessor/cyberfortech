import { RiJavascriptFill } from "@remixicon/react";
import { GlassWater, Book, RectangleVerticalIcon, BookIcon, Box } from "lucide-react";
import styles from "./ExamResults.module.scss";

export const examResults = [
    {
      id: "8547",
      student: {
        name: "Ion Somer",
        avatar: "/team/mohsin.jpg",
        subject: "Science"
      },
      subject: {
        name: "Science",
        icon: <GlassWater size={16} className={styles.icon} style={{ color: '#0EA5E9' }} />, // Blue
      },
      score: 99
    },
    {
      id: "7564",
      student: {
        name: "Shakira",
        avatar: "/testm/testimonial1.jpg",
        subject: "English"
      },
      subject: {
        name: "English",
        icon: <Book size={16} className={styles.icon} style={{ color: '#F472B6' }} />, // Pink
      },
      score: 78
    },
    {
      id: "8517",
      student: {
        name: "Priyanka",
        avatar: "/testm/testm1.avif",
        subject: "Science"
      },
      subject: {
        name: "Science",
        icon: <RectangleVerticalIcon size={16} className={styles.icon} style={{ color: '#A78BFA' }} />, // Purple
      },
      score: 2
    },
    {
      id: "8548",
      student: {
        name: "Amisha",
        avatar: "/testm/testm4.jpg",
        subject: "Science"
      },
      subject: {
        name: "Science",
        icon: <RiJavascriptFill size={16} className={styles.icon} style={{ color: '#FBBF24' }} />, // Yellow
      },
      score: 82
    },
    {
      id: "8549",
      student: {
        name: "Nagesh",
        avatar: "/testm/testm3.webp",
        subject: "Science"
      },
      subject: {
        name: "Science",
        icon: <BookIcon size={16} className={styles.icon} style={{ color: '#34D399' }} />, // Green
      },
      score: 72
    },
    {
      id: "8540",
      student: {
        name: "Anjali",
        avatar: "/testm/testm2.avif",
        subject: "Science"
      },
      subject: {
        name: "Science",
        icon: <Box size={16} className={styles.icon} style={{ color: '#60A5FA' }} />, // Light Blue
      },
      score: 89
    },
];