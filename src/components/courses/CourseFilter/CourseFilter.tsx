"use client"
import { useState, useEffect } from 'react';
import { Slider, Checkbox, RadioGroup } from '@heroui/react';
import { Star } from 'lucide-react';
import styles from './CourseFilter.module.scss';

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
  onFilterChange?: (filters: FilterState) => void;
  courses?: Course[];
}

export function CourseFilter({ 
  onFilterChange = () => {}, 
  courses = [] 
}: Partial<CourseFilterProps>) {
  const defaultMaxPrice = 1000;
  const [priceRange, setPriceRange] = useState<[number, number]>([0, defaultMaxPrice]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [durationRange, setDurationRange] = useState<string>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [search, setSearch] = useState<string>('');

  // Calculate derived values
  const levels = Array.from(new Set(courses.map(course => course.level)));
  const categories = Array.from(new Set(courses.map(course => course.category.trim())));
  const maxPrice = courses.length > 0
    ? Math.max(...courses.map(course => course.price))
    : defaultMaxPrice;

  useEffect(() => {
    if (maxPrice && maxPrice !== priceRange[1]) {
      setPriceRange([0, maxPrice]);
    }
  }, [maxPrice]);

  useEffect(() => {
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

  const handleDurationChange = (value: string) => {
    setDurationRange(value);
  };

  const handleRatingChange = (value: number) => {
    setMinRating(value);
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

      {/* Search Input */}
      <section className={styles.section}>
        <h3>Search</h3>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search courses..."
          className={styles.searchInput}
        />
      </section>
      
      {/* Price Range */}
      <section className={styles.section}>
        <h3>Price Range</h3>
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

      {/* Rating Filter */}
      <section className={styles.section}>
        <h3>Minimum Rating</h3>
        <div className={styles.ratingContainer}>
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              onClick={() => handleRatingChange(rating)}
              className={`${styles.ratingButton} ${minRating === rating ? styles.active : ''}`}
            >
              {Array.from({ length: rating }).map((_, index) => (
                <Star
                  key={index}
                  size={16}
                  className={styles.star}
                  fill={minRating >= rating ? "gold" : "none"}
                />
              ))}
            </button>
          ))}
        </div>
      </section>

      {/* Duration Filter */}
      <section className={styles.section}>
        <h3>Duration</h3>
        <RadioGroup
          value={durationRange}
          onValueChange={handleDurationChange}
          className={styles.durationGroup}
        >
          <div className={styles.radioOption}>
            <input
              type="radio"
              id="all"
              value="all"
              checked={durationRange === 'all'}
              onChange={() => handleDurationChange('all')}
            />
            <label htmlFor="all">All</label>
          </div>
          <div className={styles.radioOption}>
            <input
              type="radio"
              id="short"
              value="short"
              checked={durationRange === 'short'}
              onChange={() => handleDurationChange('short')}
            />
            <label htmlFor="short">Short (≤ 4 hours)</label>
          </div>
          <div className={styles.radioOption}>
            <input
              type="radio"
              id="medium"
              value="medium"
              checked={durationRange === 'medium'}
              onChange={() => handleDurationChange('medium')}
            />
            <label htmlFor="medium">Medium (4-8 hours)</label>
          </div>
          <div className={styles.radioOption}>
            <input
              type="radio"
              id="long"
              value="long"
              checked={durationRange === 'long'}
              onChange={() => handleDurationChange('long')}
            />
            <label htmlFor="long">Long (&gt; 8 hours)</label>
          </div>
        </RadioGroup>
      </section>

      {/* Level Filter */}
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

      {/* Categories Filter */}
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

      {/* Reset Button */}
      <div className={styles.buttonContainer}>
        <button className={styles.resetButton} onClick={resetFilters}>
          Reset All Filters
        </button>
      </div>
    </div>
  );
}