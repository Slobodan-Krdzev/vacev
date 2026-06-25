import type { PlatformLink } from '@/types';

interface PlatformLinksProps {
  links: PlatformLink[];
  className?: string;
}

export default function PlatformLinks({ links, className = '' }: PlatformLinksProps) {
  if (!links.length) return null;

  return (
    <nav
      className={`flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-center ${className}`}
      aria-label="Listen on external platforms"
    >
      {links.map((link) => (
        <a
          key={link._id || `${link.platform}-${link.url}`}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-muted underline-offset-4 transition-colors hover:text-accent hover:underline"
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}
