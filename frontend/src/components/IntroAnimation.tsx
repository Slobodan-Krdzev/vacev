'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useIntro } from '@/lib/intro-context';
import { markIntroSeen } from '@/lib/intro-storage';

const HOLD_MS = 700;
const ANIMATE_MS = 1200;

export default function IntroAnimation() {
  const { introComplete, setIntroComplete, logoRef } = useIntro();
  const groupRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLSpanElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const [phase, setPhase] = useState<'idle' | 'hold' | 'animating' | 'done'>('idle');
  const started = useRef(false);

  useLayoutEffect(() => {
    if (introComplete || started.current) return;
    started.current = true;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      markIntroSeen();
      setIntroComplete(true);
      setPhase('done');
      return;
    }

    setPhase('hold');
  }, [introComplete, setIntroComplete]);

  useEffect(() => {
    if (phase !== 'hold') return;
    const holdTimer = setTimeout(() => setPhase('animating'), HOLD_MS);
    return () => clearTimeout(holdTimer);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'animating' || !groupRef.current || !titleRef.current || !logoRef.current) {
      return;
    }

    const group = groupRef.current;
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    const target = logoRef.current.getBoundingClientRect();
    const titleRect = title.getBoundingClientRect();
    const groupRect = group.getBoundingClientRect();

    const originX = titleRect.left + titleRect.width / 2 - groupRect.left;
    const originY = titleRect.top + titleRect.height / 2 - groupRect.top;

    const scale = target.height / titleRect.height;
    const titleCenterX = titleRect.left + titleRect.width / 2;
    const titleCenterY = titleRect.top + titleRect.height / 2;
    const targetCenterX = target.left + target.width / 2;
    const targetCenterY = target.top + target.height / 2;
    const translateX = targetCenterX - titleCenterX;
    const translateY = targetCenterY - titleCenterY;

    const easing = 'cubic-bezier(0.4, 0, 0.2, 1)';

    requestAnimationFrame(() => {
      group.style.transformOrigin = `${originX}px ${originY}px`;
      group.style.transition = `transform ${ANIMATE_MS}ms ${easing}`;

      if (subtitle) {
        subtitle.style.transition = `opacity ${ANIMATE_MS}ms ${easing}`;
        subtitle.style.opacity = '0';
      }

      group.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    });

    const doneTimer = setTimeout(() => {
      markIntroSeen();
      setPhase('done');
      setIntroComplete(true);
    }, ANIMATE_MS + 80);

    return () => clearTimeout(doneTimer);
  }, [phase, logoRef, setIntroComplete]);

  if (introComplete || phase === 'done') return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-background"
      aria-hidden="true"
    >
      <div
        ref={groupRef}
        className="flex max-w-full flex-col items-center px-5"
        style={{ transform: 'translate(0, 0) scale(1)' }}
      >
        <span
          ref={titleRef}
          className="font-display max-w-full select-none text-[clamp(3.5rem,22vw,24rem)] font-bold leading-none tracking-tight"
        >
          Vacev
        </span>
        <p
          ref={subtitleRef}
          className="mt-1 max-w-full text-center text-[clamp(0.6rem,2.2vw,0.95rem)] font-medium uppercase tracking-[0.15em] text-muted sm:mt-1.5 sm:tracking-[0.3em]"
        >
          Photography / Videography
        </p>
      </div>
    </div>
  );
}
