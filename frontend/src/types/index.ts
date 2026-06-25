export interface Photo {
  _id?: string;
  url: string;
  alt?: string;
  order: number;
  span?: 'normal' | 'wide' | 'tall' | 'small';
}

export type ProjectCategory = 'photography' | 'videography' | 'audio';

export type PlatformType = 'youtube' | 'spotify';

export interface PlatformLink {
  _id?: string;
  platform: PlatformType;
  url: string;
  label: string;
}

export interface Subcategory {
  _id: string;
  name: string;
  slug: string;
  category: ProjectCategory;
  order: number;
}

export interface Project {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: ProjectCategory;
  subcategory?: Subcategory | string | null;
  coverImage: string;
  youtubeVideoId?: string;
  youtubeLink?: string;
  youtubeLinkLabel?: string;
  platformLinks?: PlatformLink[];
  audioUrl?: string;
  photos: Photo[];
  order: number;
  published: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}
