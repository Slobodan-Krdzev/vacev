'use client';

import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import type { CategoryFilterValue } from '@/lib/categories';
import { ALL_CATEGORY } from '@/lib/categories';
import type { Project, Subcategory } from '@/types';
import ProjectFilters, { ALL_SUBCATEGORY } from './ProjectFilters';
import ProjectGrid from './ProjectGrid';

interface HomeProjectsProps {
  projects: Project[];
  subcategories: Subcategory[];
}

function getSubcategoryId(project: Project): string | null {
  if (!project.subcategory) return null;
  if (typeof project.subcategory === 'string') return project.subcategory;
  return project.subcategory._id;
}

export default function HomeProjects({ projects, subcategories }: HomeProjectsProps) {
  const [category, setCategory] = useState<CategoryFilterValue>(ALL_CATEGORY);
  const [subcategory, setSubcategory] = useState(ALL_SUBCATEGORY);
  const [filterSlot, setFilterSlot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setFilterSlot(document.getElementById('site-filter-slot'));
  }, []);

  useEffect(() => {
    setSubcategory(ALL_SUBCATEGORY);
  }, [category]);

  const filtered = useMemo(() => {
    return projects.filter((project) => {
      const matchesCategory =
        category === ALL_CATEGORY || (project.category || 'photography') === category;
      if (!matchesCategory) return false;

      if (subcategory === ALL_SUBCATEGORY) return true;
      return getSubcategoryId(project) === subcategory;
    });
  }, [projects, category, subcategory]);

  const filters = (
    <ProjectFilters
      fixed
      category={category}
      subcategory={subcategory}
      subcategories={subcategories}
      onCategoryChange={setCategory}
      onSubcategoryChange={setSubcategory}
    />
  );

  return (
    <>
      {filterSlot ? createPortal(filters, filterSlot) : null}
      <div className="pt-[var(--site-filters-height,5rem)]">
        {filtered.length > 0 ? (
          <ProjectGrid projects={filtered} fadeIn />
        ) : (
          <div className="mx-auto max-w-[1400px] px-5 py-12 text-center text-muted sm:px-8 lg:px-12">
            <p>No projects in this category yet.</p>
          </div>
        )}
      </div>
    </>
  );
}
