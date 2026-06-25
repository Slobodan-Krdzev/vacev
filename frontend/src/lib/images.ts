const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export function resolveImageUrl(url: string): string {
  if (!url) return url;
  if (url.startsWith('blob:') || url.startsWith('data:')) return url;
  if (url.startsWith('/uploads/')) return url;

  try {
    const parsed = new URL(url);
    if (parsed.pathname.startsWith('/uploads/')) {
      return parsed.pathname;
    }
  } catch {
    return url;
  }

  if (url.startsWith(`${API_URL}/uploads/`)) {
    return url.slice(API_URL.length);
  }

  return url;
}
