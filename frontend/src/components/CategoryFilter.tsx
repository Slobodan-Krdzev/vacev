'use client';

import type { CategoryFilterValue } from '@/lib/categories';
import { ALL_CATEGORY, CATEGORY_LABELS, PROJECT_CATEGORIES } from '@/lib/categories';
import SegmentFilter from './SegmentFilter';

interface CategoryFilterProps {
  active: CategoryFilterValue;
  onChange: (category: CategoryFilterValue) => void;
}

export default function CategoryFilter({ active, onChange }: CategoryFilterProps) {
  const items = [
    { value: ALL_CATEGORY, label: 'All' },
    ...PROJECT_CATEGORIES.map((category) => ({
      value: category,
      label: CATEGORY_LABELS[category],
    })),
  ];

  return (
    <SegmentFilter
      items={items}
      active={active}
      onChange={onChange}
      ariaLabel="Filter projects by category"
    />
  );
}
