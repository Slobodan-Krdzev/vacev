'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLayoutEffect, useRef, useState } from 'react';
import { useIntro } from '@/lib/intro-context';
import MobileMenu from './MobileMenu';

const navItems = [
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/', label: 'Work' },
  { href: '/about', label: 'About' },
];

const navLinkClass = (active: boolean) =>
  `text-sm font-medium tracking-wide transition-colors sm:text-base ${
    active
      ? 'text-accent underline decoration-accent decoration-1 underline-offset-8'
      : 'text-foreground hover:text-accent'
  }`;

export default function Header() {
  const pathname = usePathname();
  const { introComplete, logoRef } = useIntro();
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const updateHeight = () => {
      const height = Math.ceil(header.getBoundingClientRect().height);
      document.documentElement.style.setProperty('--site-header-height', `${height}px`);
    };

    updateHeight();
    requestAnimationFrame(updateHeight);

    const observer = new ResizeObserver(updateHeight);
    observer.observe(header);
    window.addEventListener('resize', updateHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateHeight);
    };
  }, [introComplete]);

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/' || pathname.startsWith('/work/');
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      <header
        ref={headerRef}
        className="fixed top-0 right-0 left-0 z-50 w-full overflow-x-hidden bg-background"
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-6 sm:px-8 sm:py-8 lg:px-12">
          <Link
            ref={logoRef}
            href="/"
            className={`font-display text-2xl font-bold tracking-tight sm:text-3xl ${
              introComplete ? 'opacity-100' : 'opacity-0'
            }`}
          >
            Vacev
          </Link>

          <nav
            className={`hidden items-center gap-6 md:flex md:gap-10 ${
              introComplete ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className={navLinkClass(isActive(item.href))}>
                {item.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className={`flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden ${
              introComplete ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <span className="block h-px w-5 bg-heading" />
            <span className="block h-px w-5 bg-heading" />
          </button>
        </div>
      </header>

      <MobileMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        navItems={navItems}
        isActive={isActive}
      />
    </>
  );
}
