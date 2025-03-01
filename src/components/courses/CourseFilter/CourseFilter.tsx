"use client";
import { useState, useEffect, useMemo } from "react";
import { Slider, Checkbox, RadioGroup } from "@heroui/react";
import {
  Star,
  Search,
  Clock,
  Wallet,
  GraduationCap,
  RefreshCcw,
  Tag,
  ArrowUpDown,
  SortAsc,
  SortDesc,
  X,
  FilterIcon,
  DollarSign,
  DollarSignIcon,
  TimerIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import styles from "./CourseFilter.module.scss";
import { CourseFilterProps, CourseLevel, FilterState } from "../types";
import { LucideIcon } from "lucide-react";

type SortOption = "rating" | "newest" | "price" | "duration";

interface SortOptionType {
  value: SortOption;
  label: string;
  icon: LucideIcon;
}

export function CourseFilter({
  onFilterChange,
  courses = [],
}: CourseFilterProps) {
  const defaultMaxPrice = 1000;
  const [priceRange, setPriceRange] = useState<[number, number]>([
    0,
    defaultMaxPrice,
  ]);
  // const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [durationRange, setDurationRange] = useState<"all" | "short" | "medium" | "long">("all");
  const [minRating, setMinRating] = useState<number>(0);
  const [search, setSearch] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortOption>("rating");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const levels: CourseLevel[] = ['Beginner', 'Intermediate', 'Advanced'];
  const [selectedLevels, setSelectedLevels] = useState<CourseLevel[]>([]);
  // const levels: CourseLevel[] = [...]; // Your levels array

  // Calculate derived values using useMemo
  const { maxPrice, categories } = useMemo(() => {
    const calculatedMaxPrice =
      courses.length > 0
        ? Math.max(...courses.map((course) => course.price || 0)) // Add fallback value
        : defaultMaxPrice;
  
    const uniqueCategories = Array.from(
      new Set(courses.map((course) => (course.category ?? "").trim()))
    );
  
    return {
      maxPrice: calculatedMaxPrice,
      categories: uniqueCategories,
    };
  }, [courses, defaultMaxPrice]);

  const sortOptions: SortOptionType[] = [
    { value: "rating", label: "Rating", icon: Star },
    { value: "newest", label: "Newest", icon: Clock },
    { value: "price", label: "Price", icon: DollarSignIcon },
    { value: "duration", label: "Duration", icon: TimerIcon }
  ] as const;

  useEffect(() => {
    if (maxPrice !== priceRange[1]) {
      setPriceRange([0, maxPrice]);
    }
  }, [maxPrice]);

  const handlePriceRangeChange = (value: number | number[]) => {
    if (Array.isArray(value) && value.length === 2) {
      setPriceRange([value[0], value[1]]);
    }
  };

  const handleSortChange = (value: SortOption) => {
    if (sortBy === value) {
      setSortOrder(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortBy(value);
      setSortOrder("desc");
    }
};

  const handleRatingChange = (rating: number) => {
    setMinRating(rating === minRating ? 0 : rating);
  };

  const handleLevelChange = (level: CourseLevel) => {
    setSelectedLevels(prev => 
      prev.includes(level) 
        ? prev.filter(l => l !== level)
        : [...prev, level]
    );
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const resetFilters = () => {
    // Reset all state values
    setPriceRange([0, maxPrice]);
    setSelectedLevels([]);
    setSelectedCategories([]);
    setDurationRange('all');
    setMinRating(0);
    setSearch('');
    setSortBy('newest');
    setSortOrder('desc');
  
    // Update the filter state immediately
    const resetFilterState: FilterState = {
      priceRange: [0, maxPrice],
      selectedLevels: [],
      selectedCategories: [],
      durationRange: 'all',
      minRating: 0,
      search: '',
      sortBy: 'newest',
      sortOrder: 'desc'
    };
    
    onFilterChange?.(resetFilterState);
  };

  useEffect(() => {
    const filters: FilterState = {
      priceRange: [priceRange[0], priceRange[1]],
      selectedLevels,
      selectedCategories,
      durationRange,
      minRating,
      search,
      sortBy,
      sortOrder
    };
    onFilterChange?.(filters);
  }, [priceRange, selectedLevels, selectedCategories, durationRange, minRating, search, sortBy, sortOrder]);

  return (
    <motion.div
      className={styles.filterContainer}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
     {/* // Update the Search Input section */}
<section className={styles.section}>
  <div className={styles.searchWrapper}>
    <Search size={16} className={styles.searchIcon} />
    <input
      type="text"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search courses..."
      className={styles.searchInput}
    />
    {search && (
      <button
        className={styles.clearSearch}
        onClick={() => setSearch('')}
        aria-label="Clear search"
      >
        <X size={16} />
      </button>
    )}
  </div>
</section>

      {/* Sort Options */}
      <section className={styles.section}>
        <h3>
          <ArrowUpDown size={16} /> Sort By
        </h3>
        <div className={styles.sortButtons}>


          
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSortChange(option.value)}
              className={`${styles.sortButton} ${
                sortBy === option.value ? styles.active : ""
              }`}
            >
              <option.icon size={16} />
              <span>{option.label}</span>
              {sortBy === option.value && (
                <span className={styles.sortOrderIcon}>
                  {sortOrder === "asc" ? (
                    <SortAsc size={14} />
                  ) : (
                    <SortDesc size={14} />
                  )}
                </span>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Price Range */}
      <section className={styles.section}>
        <h3>
          <Wallet size={16} /> Price Range
        </h3>
        <Slider
          value={priceRange}
          minValue={0}
          maxValue={maxPrice}
          step={10}
          onChange={handlePriceRangeChange}
        />
        <div className={styles.priceInputs}>
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </section>

      {/* Rating Filter */}
      <section className={styles.section}>
        <h3>
          <Star size={16} /> Minimum Rating
        </h3>
        <div className={styles.ratingContainer}>
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              onClick={() => handleRatingChange(rating)}
              className={`${styles.ratingButton} ${
                minRating === rating ? styles.active : ""
              }`}
            >
              {Array.from({ length: rating }).map((_, index) => (
                <Star
                  key={index}
                  size={16}
                  className={styles.star}
                  fill={minRating >= rating ? "currentColor" : "none"}
                />
              ))}
            </button>
          ))}
        </div>
      </section>

   

{/* Level Filter */}
{levels.length > 0 && (
      <section className={styles.section}>
        <h3><GraduationCap size={16} /> Level</h3>
        {levels.map((level) => (
          <label 
            key={level} 
            className={styles.checkboxItem}
            htmlFor={`level-${level}`}
          >
            <div className={styles.checkboxWrapper}>
              <input
                type="checkbox"
                id={`level-${level}`}
                checked={selectedLevels.includes(level)}
                onChange={() => handleLevelChange(level)}
                className={styles.checkbox}
              />
              <span className={styles.checkboxLabel}>{level}</span>
            </div>
          </label>
        ))}
      </section>
    )}

{/* Categories Filter */}
{categories.length > 0 && (
  <section className={styles.section}>
    <h3><Tag size={16} /> Categories</h3>
    {categories.map((category: string) => (
      <label 
        key={category} 
        className={styles.checkboxItem}
        htmlFor={`category-${category}`}
      >
        <div className={styles.checkboxWrapper}>
          <input
            type="checkbox"
            id={`category-${category}`}
            checked={selectedCategories.includes(category)}
            onChange={() => handleCategoryChange(category)}
            className={styles.checkbox}
          />
          <span className={styles.checkboxLabel}>{category}</span>
        </div>
      </label>
    ))}
  </section>
)}

      {/* Reset Button */}
      <motion.div
        className={styles.buttonContainer}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <button className={styles.resetButton} onClick={resetFilters}>
          <RefreshCcw size={16} />
          Reset All Filters
        </button>
      </motion.div>
    </motion.div>
  );
}
