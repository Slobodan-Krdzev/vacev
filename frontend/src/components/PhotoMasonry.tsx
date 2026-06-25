'use client';

import Image from 'next/image';
import { useState } from 'react';
import { resolveImageUrl } from '@/lib/images';
import type { Photo } from '@/types';
import PhotoLightbox from './PhotoLightbox';

interface PhotoMasonryProps {
  photos: Photo[];
  projectName: string;
}

function getSpanClass(span?: Photo['span'], index?: number) {
  if (span === 'wide') return 'col-span-1 sm:col-span-2';
  if (span === 'tall') return 'row-span-2';
  if (span === 'small') return 'col-span-1';
  if (index !== undefined && index % 7 === 6) return 'col-span-1 sm:col-span-2';
  return 'col-span-1';
}

function getAspectClass(span?: Photo['span']) {
  if (span === 'tall') return 'aspect-[3/4] sm:aspect-auto sm:h-full sm:min-h-[320px]';
  if (span === 'small') return 'aspect-[3/4]';
  return 'aspect-[4/3]';
}

export default function PhotoMasonry({ photos, projectName }: PhotoMasonryProps) {
  const sorted = [...photos].sort((a, b) => a.order - b.order);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <>
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <div className="grid auto-rows-auto grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {sorted.map((photo, index) => (
            <button
              key={photo._id || photo.url}
              type="button"
              onClick={() => setLightboxIndex(index)}
              className={`apple-round relative cursor-pointer overflow-hidden bg-surface text-left ${getSpanClass(photo.span, index)} ${getAspectClass(photo.span)}`}
              aria-label={`View ${photo.alt || projectName} photo ${index + 1}`}
            >
              <Image
                src={resolveImageUrl(photo.url)}
                alt={photo.alt || projectName}
                fill
                className="object-cover transition-opacity hover:opacity-90"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </button>
          ))}
        </div>
      </div>

      {lightboxIndex !== null && (
        <PhotoLightbox
          photos={sorted}
          projectName={projectName}
          activeIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </>
  );
}
