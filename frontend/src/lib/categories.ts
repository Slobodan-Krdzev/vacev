export const PROJECT_CATEGORIES = ['photography', 'videography', 'audio'] as const;

export const ALL_CATEGORY = 'all' as const;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export type CategoryFilterValue = typeof ALL_CATEGORY | ProjectCategory;

export const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  photography: 'Photography',
  videography: 'Videography',
  audio: 'Audio',
};
