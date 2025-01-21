import { useState } from 'react';
// import { Slider } from '@/components/ui/slider';
// import { Checkbox } from '@/components/ui/checkbox';
import styles from './CourseFilter.module.scss';
import { Slider, Checkbox } from '@heroui/react';

const levels = ['Beginner', 'Intermediate', 'Advanced'];
const categories = [
  'Network Security',
  'Web Security',
  'Malware Analysis',
  'Penetration Testing',
  'Cryptography',
  'Incident Response',
];

export function CourseFilter() {
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleLevelChange = (level: string) => {
    setSelectedLevels(prev =>
      prev.includes(level)
        ? prev.filter(l => l !== level)
        : [...prev, level]
    );
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className={styles.filterContainer}>
      <h2>Filters</h2>
      
      <section className={styles.section}>
        <h3>Price Range</h3>
        <Slider
          defaultValue={[0, 1000]}
          maxValue={1000}
          step={10}
          value={priceRange}
          onChange={(value) => setPriceRange(Array.isArray(value) ? value : [value, value])}
        />
        <div className={styles.priceInputs}>
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </section>

      <section className={styles.section}>
        <h3>Level</h3>
        {levels.map(level => (
          <div key={level} className={styles.checkboxItem}>
            <Checkbox
              id={`level-${level}`}
              checked={selectedLevels.includes(level)}
              onChange={() => handleLevelChange(level)}
            />
            <label htmlFor={`level-${level}`}>{level}</label>
          </div>
        ))}
      </section>

      <section className={styles.section}>
        <h3>Categories</h3>
        {categories.map(category => (
          <div key={category} className={styles.checkboxItem}>
            <Checkbox
              id={`category-${category}`}
              checked={selectedCategories.includes(category)}
              onChange={() => handleCategoryChange(category)}
            />
            <label htmlFor={`category-${category}`}>{category}</label>
          </div>
        ))}
      </section>

      <button className={styles.applyButton}>
        Apply Filters
      </button>
    </div>
  );
}