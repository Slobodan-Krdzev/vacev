'use client';

import Image from 'next/image';
import { useCallback, useEffect } from 'react';
import { resolveImageUrl } from '@/lib/images';
import type { Photo } from '@/types';

interface PhotoLightboxProps {
  photos: Photo[];
  projectName: string;
  activeIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

function NavButton({
  direction,
  onClick,
}: {
  direction: 'prev' | 'next';
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      aria-label={direction === 'prev' ? 'Previous photo' : 'Next photo'}
      className="flex h-12 w-12 shrink-0 touch-manipulation items-center justify-center rounded-lg border border-border bg-surface text-2xl font-light text-accent transition-colors hover:border-accent hover:bg-accent hover:text-white active:bg-accent-hover sm:h-14 sm:w-14 sm:text-3xl"
    >
      {direction === 'prev' ? '‹' : '›'}
    </button>
  );
}

export default function PhotoLightbox({
  photos,
  projectName,
  activeIndex,
  onClose,
  onNavigate,
}: PhotoLightboxProps) {
  const photo = photos[activeIndex];
  const canLoop = photos.length > 1;

  const goPrev = useCallback(() => {
    if (!canLoop) return;
    onNavigate(activeIndex === 0 ? photos.length - 1 : activeIndex - 1);
  }, [activeIndex, canLoop, onNavigate, photos.length]);

  const goNext = useCallback(() => {
    if (!canLoop) return;
    onNavigate(activeIndex === photos.length - 1 ? 0 : activeIndex + 1);
  }, [activeIndex, canLoop, onNavigate, photos.length]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, goPrev, goNext]);

  if (!photo) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-background/95 px-3 py-16 sm:px-8 sm:py-20"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${projectName} photo gallery`}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close gallery"
        className="absolute right-4 top-5 z-[90] flex h-11 w-11 touch-manipulation items-center justify-center rounded-lg border border-border bg-surface text-heading transition-colors hover:border-accent hover:text-accent sm:right-8 sm:top-8"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path
            d="M1 1L13 13M13 1L1 13"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <div
        className="flex w-full max-w-6xl items-center justify-center gap-2 sm:gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        {canLoop ? (
          <NavButton direction="prev" onClick={goPrev} />
        ) : (
          <div className="hidden w-12 shrink-0 sm:block sm:w-14" aria-hidden="true" />
        )}

        <div className="apple-round relative h-[55vh] min-w-0 flex-1 overflow-hidden sm:h-[70vh]">
          <Image
            key={photo._id || photo.url}
            src={resolveImageUrl(photo.url)}
            alt={photo.alt || `${projectName} photo ${activeIndex + 1}`}
            fill
            className="object-contain"
            sizes="(max-width: 640px) 85vw, 80vw"
            priority
          />
        </div>

        {canLoop ? (
          <NavButton direction="next" onClick={goNext} />
        ) : (
          <div className="hidden w-12 shrink-0 sm:block sm:w-14" aria-hidden="true" />
        )}
      </div>
    </div>
  );
}
