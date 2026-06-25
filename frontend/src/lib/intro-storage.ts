export const INTRO_KEY = 'vacev-intro-seen';

export function hasSeenIntro(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    return sessionStorage.getItem(INTRO_KEY) === '1';
  } catch {
    return true;
  }
}

export function markIntroSeen(): void {
  try {
    sessionStorage.setItem(INTRO_KEY, '1');
  } catch {
    // ignore
  }
}
