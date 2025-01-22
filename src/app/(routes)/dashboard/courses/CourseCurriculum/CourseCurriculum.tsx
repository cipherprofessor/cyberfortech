"use client"
import { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  PlayCircle, 
  FileText, 
  CheckCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './CourseCurriculum.module.scss';

type Module = {
  id: number;
  title: string;
  duration?: string;
  type: 'video' | 'quiz';
  completed: boolean;
};

type Section = {
  id: number;
  title: string;
  modules: Module[];
};

type CourseCurriculumProps = {
  curriculum: Section[];
};

export function CourseCurriculum({ curriculum }: CourseCurriculumProps) {
  const [expandedSections, setExpandedSections] = useState<Set<number>>(
    new Set([curriculum[0]?.id])
  );

  const toggleSection = (sectionId: number) => {
    const newExpanded = new Set(expandedSections);
    if (expandedSections.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const getModuleIcon = (type: string, completed: boolean) => {
    if (completed) {
      return <CheckCircle className={`${styles.icon} ${styles.completed}`} />;
    }
    return type === 'video' ? (
      <PlayCircle className={styles.icon} />
    ) : (
      <FileText className={styles.icon} />
    );
  };

  const calculateSectionProgress = (modules: Module[]) => {
    const completed = modules.filter(module => module.completed).length;
    return Math.round((completed / modules.length) * 100);
  };

  return (
    <div className={styles.curriculum}>
      {curriculum.map((section) => {
        const isExpanded = expandedSections.has(section.id);
        const progress = calculateSectionProgress(section.modules);

        return (
          <div key={section.id} className={styles.section}>
            <button
              className={styles.sectionHeader}
              onClick={() => toggleSection(section.id)}
            >
              <div className={styles.sectionInfo}>
                <h3>{section.title}</h3>
                <div className={styles.sectionMeta}>
                  <span>{section.modules.length} modules</span>
                  <span className={styles.progress}>{progress}% completed</span>
                </div>
              </div>
              {isExpanded ? (
                <ChevronUp className={styles.chevron} />
              ) : (
                <ChevronDown className={styles.chevron} />
              )}
            </button>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={styles.moduleList}
                >
                  {section.modules.map((module) => (
                    <div
                      key={module.id}
                      className={`${styles.module} ${
                        module.completed ? styles.completed : ''
                      }`}
                    >
                      {getModuleIcon(module.type, module.completed)}
                      <div className={styles.moduleInfo}>
                        <span className={styles.moduleTitle}>
                          {module.title}
                        </span>
                        {module.duration && (
                          <span className={styles.duration}>
                            {module.duration}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}