import { resolveImageUrl } from './images';

export function resolveMediaUrl(url: string): string {
  return resolveImageUrl(url);
}

export function isUploadedAudioPath(url: string): boolean {
  if (!url) return false;
  return url.startsWith('/uploads/');
}
