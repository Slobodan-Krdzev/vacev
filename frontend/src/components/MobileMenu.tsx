'use client';

import Link from 'next/link';
import { useEffect } from 'react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: { href: string; label: string }[];
  isActive: (href: string) => boolean;
}

export default function MobileMenu({ isOpen, onClose, navItems, isActive }: MobileMenuProps) {
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-background md:hidden">
      <div className="flex items-center justify-between px-5 py-6 sm:px-8">
        <Link href="/" onClick={onClose} className="font-display text-2xl font-bold tracking-tight">
          Vacev
        </Link>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-heading transition-colors hover:border-accent hover:text-accent"
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
      </div>

      <nav className="flex flex-1 flex-col items-center justify-center gap-10 pb-24">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={`text-lg font-medium tracking-wide transition-colors ${
              isActive(item.href)
                ? 'text-accent underline decoration-accent decoration-1 underline-offset-8'
                : 'text-foreground hover:text-accent'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
