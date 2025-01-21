import { useState } from 'react';
import { ChevronDown, ChevronUp, Play } from 'lucide-react';
import styles from './CourseContent.module.scss';

type Lesson = {
  title: string;
  duration: string;
};

type Section = {
  title: string;
  lessons: Lesson[];
};

type CourseContentProps = {
  course: {
    topics: string[];
    curriculum: Section[];
  };
};

export function CourseContent({ course }: CourseContentProps) {
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0]));

  const toggleSection = (index: number) => {
    const newExpandedSections = new Set(expandedSections);
    if (expandedSections.has(index)) {
      newExpandedSections.delete(index);
    } else {
      newExpandedSections.add(index);
    }
    setExpandedSections(newExpandedSections);
  };

  return (
    <div className={styles.content}>
      <section className={styles.section}>
        <h2>What You'll Learn</h2>
        <ul className={styles.topicsList}>
          {course.topics.map((topic, index) => (
            <li key={index}>{topic}</li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h2>Course Content</h2>
        <div className={styles.curriculum}>
          {course.curriculum.map((section, sectionIndex) => (
            <div key={sectionIndex} className={styles.curriculumSection}>
              <button
                className={styles.sectionHeader}
                onClick={() => toggleSection(sectionIndex)}
              >
                <div className={styles.sectionTitle}>
                  <span>Section {sectionIndex + 1}: {section.title}</span>
                  <span className={styles.lessonCount}>
                    {section.lessons.length} lessons
                  </span>
                </div>
                {expandedSections.has(sectionIndex) ? (
                  <ChevronUp className={styles.icon} />
                ) : (
                  <ChevronDown className={styles.icon} />
                )}
              </button>
              
              {expandedSections.has(sectionIndex) && (
                <div className={styles.lessons}>
                  {section.lessons.map((lesson, lessonIndex) => (
                    <div key={lessonIndex} className={styles.lesson}>
                      <Play className={styles.playIcon} />
                      <span className={styles.lessonTitle}>{lesson.title}</span>
                      <span className={styles.duration}>{lesson.duration}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}