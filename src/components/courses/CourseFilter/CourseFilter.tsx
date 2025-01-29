"use client"
import { useState, useEffect } from 'react';
import { Slider, Checkbox } from '@heroui/react';
import styles from './CourseFilter.module.scss';

// Types
type Course = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  duration: string;
  level: string;
  price: number;
  average_rating: number;
  total_students: number;
  instructor_name: string;
  category: string;
  instructor_avatar?: string;
  total_reviews?: number;
  created_at?: string;
  updated_at?: string;
  instructor_id?: string;
};

type FilterState = {
  priceRange: number[];
  selectedLevels: string[];
  selectedCategories: string[];
  durationRange: string;
  minRating: number;
  search: string;
};

interface CourseFilterProps {
  onFilterChange?: (filters: FilterState) => void; // Make it optional
  courses?: Course[];  // Make it optional
}

export function CourseFilter({ 
  onFilterChange = () => {}, // Add default empty function
  courses = [] 
}: Partial<CourseFilterProps>) {
  // Initialize with safe default values
  const defaultMaxPrice = 1000;
  const [priceRange, setPriceRange] = useState<[number, number]>([0, defaultMaxPrice]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [durationRange, setDurationRange] = useState<string>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [search, setSearch] = useState<string>('');

  const levels = Array.from(new Set((courses || []).map(course => course.level)));
  const categories = Array.from(new Set((courses || []).map(course => course.category)));
  
  // Safely calculate maxPrice
  const maxPrice = courses?.length > 0
    ? Math.max(...courses.map(course => course.price))
    : defaultMaxPrice;


  // Update price range when maxPrice changes
  useEffect(() => {
    if (maxPrice && maxPrice !== priceRange[1]) {
      setPriceRange([0, maxPrice]);
    }
  }, [maxPrice]);

  // Update filters
  useEffect(() => {
    // Only call onFilterChange if it's provided
    if (onFilterChange) {
      const filters: FilterState = {
        priceRange,
        selectedLevels,
        selectedCategories,
        durationRange,
        minRating,
        search
      };
      onFilterChange(filters);
    }
  }, [priceRange, selectedLevels, selectedCategories, durationRange, minRating, search, onFilterChange]);

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

  const resetFilters = () => {
    setPriceRange([0, maxPrice]);
    setSelectedLevels([]);
    setSelectedCategories([]);
    setDurationRange('all');
    setMinRating(0);
    setSearch('');
  };

  return (
    <div className={styles.filterContainer}>
    <h2>Filters</h2>
    
    <section className={styles.section}>
      <h3>Price Range111</h3>
      <Slider
        value={priceRange}
        minValue={0}
        maxValue={maxPrice}
        step={10}
        onChange={(value) => setPriceRange(Array.isArray(value) ? value as [number, number] : [value, value] as [number, number])}
      />
      <div className={styles.priceInputs}>
        <span>${priceRange[0]}</span>
        <span>${priceRange[1]}</span>
      </div>
    </section>

    {/* Only render level section if there are levels */}
    {levels.length > 0 && (
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
    )}

    {/* Only render category section if there are categories */}
    {categories.length > 0 && (
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
    )}

    <div className={styles.buttonContainer}>
      <button className={styles.resetButton} onClick={resetFilters}>
        Reset
      </button>
    </div>
  </div>
);
}