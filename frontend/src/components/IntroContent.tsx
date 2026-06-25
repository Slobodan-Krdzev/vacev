'use client';

import { useIntro } from '@/lib/intro-context';

export default function IntroContent({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { introComplete } = useIntro();

  return (
    <main
      className={`min-w-0 flex-1 pt-[var(--site-header-height,5.5rem)] pb-16 sm:pb-20 ${
        introComplete ? 'opacity-100' : 'opacity-0'
      } ${className}`}
    >
      <div className="min-w-0 overflow-x-hidden">{children}</div>
    </main>
  );
}
