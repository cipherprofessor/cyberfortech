// src/components/Forum/CategoryInfo/CategoryInfo.tsx
import styles from './CategoryInfo.module.scss';

interface CategoryInfoProps {
    category: {
      id: number;
      name: string;
      description: string;
      icon: string;
      rules?: string[];
      moderators?: string[];
    };
  }
  
  export function CategoryInfo({ category }: CategoryInfoProps) {
    return (
      <div className={styles.categoryInfo}>
        <div className={styles.headerSection}>
          <div className={styles.icon}>{category.icon}</div>
          <div className={styles.titleSection}>
            <h1>{category.name}</h1>
            <p>{category.description}</p>
          </div>
        </div>
        
        {category.rules && (
          <div className={styles.rulesSection}>
            <h3>Category Rules</h3>
            <ul>
              {category.rules.map((rule, index) => (
                <li key={index}>{rule}</li>
              ))}
            </ul>
          </div>
        )}
  
        {category.moderators && category.moderators.length > 0 && (
          <div className={styles.moderatorsSection}>
            <h3>Moderators</h3>
            <div className={styles.moderatorsList}>
              {category.moderators.map(mod => (
                <div key={mod} className={styles.moderator}>
                  {mod}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }