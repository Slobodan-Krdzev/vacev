'use client';

import { useCallback, useLayoutEffect, useRef, useState } from 'react';

export interface SegmentItem<T extends string> {
  value: T;
  label: string;
}

interface SegmentFilterProps<T extends string> {
  items: SegmentItem<T>[];
  active: T;
  onChange: (value: T) => void;
  ariaLabel: string;
}

interface IndicatorStyle {
  width: number;
  x: number;
}

export default function SegmentFilter<T extends string>({
  items,
  active,
  onChange,
  ariaLabel,
}: SegmentFilterProps<T>) {
  const trackRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Partial<Record<T, HTMLButtonElement>>>({});
  const [indicator, setIndicator] = useState<IndicatorStyle>({ width: 0, x: 0 });
  const [ready, setReady] = useState(false);

  const updateIndicator = useCallback(() => {
    const track = trackRef.current;
    const button = buttonRefs.current[active];

    if (!track || !button) return;

    const trackRect = track.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();

    setIndicator({
      width: buttonRect.width,
      x: buttonRect.left - trackRect.left,
    });
    setReady(true);
  }, [active]);

  useLayoutEffect(() => {
    updateIndicator();
  }, [updateIndicator, items]);

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const observer = new ResizeObserver(updateIndicator);
    observer.observe(track);
    window.addEventListener('resize', updateIndicator);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateIndicator);
    };
  }, [updateIndicator]);

  if (items.length === 0) return null;

  return (
    <div
      ref={trackRef}
      className="apple-segment-track relative inline-flex max-w-full"
      role="tablist"
      aria-label={ariaLabel}
    >
      <span
        aria-hidden="true"
        className={`apple-segment-indicator apple-pill pointer-events-none absolute top-1 bottom-1 left-0 ${
          ready ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          width: indicator.width,
          transform: `translateX(${indicator.x}px)`,
        }}
      />

      {items.map((item) => {
        const isActive = active === item.value;

        return (
          <button
            key={item.value}
            ref={(node) => {
              if (node) buttonRefs.current[item.value] = node;
            }}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(item.value)}
            className={`apple-pill relative z-10 px-3 py-2.5 text-sm font-medium tracking-wide whitespace-nowrap transition-colors duration-300 sm:px-5 ${
              isActive ? 'text-white' : 'text-heading hover:text-foreground'
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
