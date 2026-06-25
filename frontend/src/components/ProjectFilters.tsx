'use client';

import { useLayoutEffect, useRef } from 'react';
import type { CategoryFilterValue } from '@/lib/categories';
import { ALL_CATEGORY } from '@/lib/categories';
import type { Subcategory } from '@/types';
import CategoryFilter from './CategoryFilter';
import SubcategoryFilter, { ALL_SUBCATEGORY } from './SubcategoryFilter';

interface ProjectFiltersProps {
  category: CategoryFilterValue;
  subcategory: string;
  subcategories: Subcategory[];
  onCategoryChange: (category: CategoryFilterValue) => void;
  onSubcategoryChange: (subcategoryId: string) => void;
  fixed?: boolean;
}

export default function ProjectFilters({
  category,
  subcategory,
  subcategories,
  onCategoryChange,
  onSubcategoryChange,
  fixed = false,
}: ProjectFiltersProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const categorySubcategories =
    category === ALL_CATEGORY
      ? []
      : subcategories.filter((item) => item.category === category);
  const hasSubcategories = categorySubcategories.length > 0;

  useLayoutEffect(() => {
    if (!fixed) {
      document.documentElement.style.removeProperty('--site-filters-height');
      return;
    }

    const bar = barRef.current;
    if (!bar) return;

    const updateHeight = () => {
      document.documentElement.style.setProperty('--site-filters-height', `${bar.offsetHeight}px`);
    };

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(bar);

    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty('--site-filters-height');
    };
  }, [fixed, hasSubcategories, category]);

  const filters = hasSubcategories ? (
    <div className="grid w-full min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-2 sm:flex sm:w-auto sm:gap-3">
      <div className="min-w-0 overflow-x-clip sm:overflow-visible">
        <CategoryFilter active={category} onChange={onCategoryChange} />
      </div>
      <div className="shrink-0 justify-self-end">
        <SubcategoryFilter
          subcategories={categorySubcategories}
          active={subcategory}
          onChange={onSubcategoryChange}
        />
      </div>
    </div>
  ) : (
    <CategoryFilter active={category} onChange={onCategoryChange} />
  );

  if (fixed) {
    return (
      <div
        ref={barRef}
        className="fixed right-0 left-0 z-40 w-full bg-background py-4"
        style={{ top: 'var(--site-header-height, 5.5rem)' }}
      >
        <div className="mx-auto w-full min-w-0 max-w-[1400px] px-5 sm:px-8 lg:px-12">{filters}</div>
      </div>
    );
  }

  return (
    <div ref={barRef} className="mx-auto w-full min-w-0 max-w-[1400px] px-5 pb-8 sm:px-8 lg:px-12">
      {filters}
    </div>
  );
}

export { ALL_SUBCATEGORY, ALL_CATEGORY };
