import type { Project, Subcategory } from '@/types';

export const mockSubcategories: Subcategory[] = [
  {
    _id: 'mock-sub-portraits',
    name: 'Portraits',
    slug: 'portraits',
    category: 'photography',
    order: 0,
  },
  {
    _id: 'mock-sub-fashion',
    name: 'Fashion',
    slug: 'fashion',
    category: 'photography',
    order: 1,
  },
  {
    _id: 'mock-sub-commercial',
    name: 'Commercial',
    slug: 'commercial',
    category: 'videography',
    order: 0,
  },
  {
    _id: 'mock-sub-brand-films',
    name: 'Brand Films',
    slug: 'brand-films',
    category: 'videography',
    order: 1,
  },
  {
    _id: 'mock-sub-podcast',
    name: 'Podcast',
    slug: 'podcast',
    category: 'audio',
    order: 0,
  },
];

const subcategoryBySlug = Object.fromEntries(
  mockSubcategories.map((item) => [item.slug, item])
);

export const mockProjects: Project[] = [
  {
    _id: 'mock-project-portraits',
    name: 'Portraits',
    slug: 'portraits',
    description:
      'A collection of intimate portrait work exploring light, color, and character. Each session captures the unique essence of the subject through dramatic lighting and bold composition.',
    category: 'photography',
    subcategory: subcategoryBySlug.portraits,
    coverImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80',
    photos: [
      { url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200&q=80', alt: 'Portrait 1', order: 0, span: 'wide' },
      { url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80', alt: 'Portrait 2', order: 1, span: 'normal' },
      { url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80', alt: 'Portrait 3', order: 2, span: 'normal' },
      { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80', alt: 'Portrait 4', order: 3, span: 'tall' },
      { url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&q=80', alt: 'Portrait 5', order: 4, span: 'small' },
      { url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80', alt: 'Portrait 6', order: 5, span: 'small' },
    ],
    order: 0,
    published: true,
  },
  {
    _id: 'mock-project-fashion',
    name: 'Fashion',
    slug: 'fashion',
    description:
      'Editorial fashion photography blending contemporary style with timeless aesthetics. Collaborations with designers, stylists, and models to create striking visual narratives.',
    category: 'photography',
    subcategory: subcategoryBySlug.fashion,
    coverImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
    photos: [
      { url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&q=80', alt: 'Fashion 1', order: 0, span: 'wide' },
      { url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80', alt: 'Fashion 2', order: 1, span: 'normal' },
      { url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80', alt: 'Fashion 3', order: 2, span: 'normal' },
      { url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80', alt: 'Fashion 4', order: 3, span: 'tall' },
    ],
    order: 1,
    published: true,
  },
  {
    _id: 'mock-project-commercial',
    name: 'Commercial',
    slug: 'commercial',
    description:
      'Brand-focused commercial video campaigns. From product launches to lifestyle content, delivering visuals that connect with audiences and elevate brands.',
    category: 'videography',
    subcategory: subcategoryBySlug.commercial,
    coverImage: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&q=80',
    youtubeVideoId: 'LXb3EKWsInQ',
    youtubeLink: 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
    youtubeLinkLabel: 'Check the video on YouTube',
    photos: [
      { url: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200&q=80', alt: 'Behind the scenes 1', order: 0, span: 'wide' },
      { url: 'https://images.unsplash.com/photo-1556745753-b390469bb73c?w=800&q=80', alt: 'Behind the scenes 2', order: 1, span: 'normal' },
    ],
    order: 2,
    published: true,
  },
  {
    _id: 'mock-project-brand-films',
    name: 'Brand Films',
    slug: 'brand-films',
    description:
      'Cinematic brand films crafted to tell authentic stories. Short-form documentaries and hero films for campaigns, events, and digital platforms.',
    category: 'videography',
    subcategory: subcategoryBySlug['brand-films'],
    coverImage: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80',
    youtubeVideoId: 'ScMzIvxBSi4',
    youtubeLink: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
    youtubeLinkLabel: 'Watch the full film on YouTube',
    photos: [],
    order: 3,
    published: true,
  },
  {
    _id: 'mock-project-studio-sessions',
    name: 'Studio Sessions',
    slug: 'studio-sessions',
    description:
      'An intimate audio series capturing conversations with creatives, musicians, and makers. Listen on your favorite platform or play the episode below.',
    category: 'audio',
    subcategory: subcategoryBySlug.podcast,
    coverImage: 'https://images.unsplash.com/photo-1478737270239-2f02ca77fc67?w=800&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    platformLinks: [
      {
        platform: 'youtube',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        label: 'Listen on YouTube',
      },
      {
        platform: 'spotify',
        url: 'https://open.spotify.com/show/4rOoJ6Egrf8K2IrywzwOMk',
        label: 'Listen on Spotify',
      },
    ],
    photos: [
      { url: 'https://images.unsplash.com/photo-1478737270239-2f02ca77fc67?w=800&q=80', alt: 'Studio 1', order: 0, span: 'normal' },
      { url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80', alt: 'Studio 2', order: 1, span: 'normal' },
    ],
    order: 4,
    published: true,
  },
];

export function getMockProjectBySlug(slug: string): Project | undefined {
  return mockProjects.find((project) => project.slug === slug);
}
