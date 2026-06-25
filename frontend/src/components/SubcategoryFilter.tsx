'use client';

import { useEffect, useRef, useState } from 'react';
import type { Subcategory } from '@/types';

export const ALL_SUBCATEGORY = 'all';

interface SubcategoryFilterProps {
  subcategories: Subcategory[];
  active: string;
  onChange: (subcategoryId: string) => void;
}

function SlidersIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 7h10" />
      <circle cx="17" cy="7" r="2" />
      <path d="M4 12h12" />
      <circle cx="7" cy="12" r="2" />
      <path d="M4 17h10" />
      <circle cx="17" cy="17" r="2" />
    </svg>
  );
}

export default function SubcategoryFilter({
  subcategories,
  active,
  onChange,
}: SubcategoryFilterProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const items = [
    { value: ALL_SUBCATEGORY, label: 'All' },
    ...subcategories.map((subcategory) => ({
      value: subcategory._id,
      label: subcategory.name,
    })),
  ];

  const activeLabel = items.find((item) => item.value === active)?.label ?? 'All';
  const hasActiveFilter = active !== ALL_SUBCATEGORY;

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  function handleSelect(value: string) {
    onChange(value);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative inline-flex">
      <div className="apple-segment-track inline-flex">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-label={`Filter by subcategory${hasActiveFilter ? `: ${activeLabel}` : ''}`}
          className={`apple-pill relative inline-flex items-center justify-center px-3 py-2.5 transition-colors duration-300 sm:px-3.5 ${
            open ? 'bg-accent' : 'hover:bg-black/3'
          }`}
        >
          <SlidersIcon
            className={`h-[17px] w-[17px] shrink-0 transition-colors duration-300 ${
              open ? 'text-white' : 'text-accent'
            }`}
          />
        </button>
      </div>

      {open && (
        <ul
          role="listbox"
          aria-label="Subcategory filter"
          className="filter-dropdown absolute right-0 top-[calc(100%+6px)] z-[60] min-w-[168px]"
        >
          {items.map((item) => {
            const isActive = active === item.value;

            return (
              <li key={item.value} role="option" aria-selected={isActive}>
                <button
                  type="button"
                  onClick={() => handleSelect(item.value)}
                  className={`filter-dropdown-item flex w-full items-center justify-between gap-3 px-3.5 py-2 text-left ${
                    isActive ? 'filter-dropdown-item-active' : ''
                  }`}
                >
                  <span className="truncate">{item.label}</span>
                  {isActive && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                      className="h-3.5 w-3.5 shrink-0"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
