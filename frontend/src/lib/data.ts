import { getProject, getProjects, getSubcategories } from '@/lib/api';
import { getMockProjectBySlug, mockProjects, mockSubcategories } from '@/lib/mock-data';
import type { Project, Subcategory } from '@/types';

export function isMockDataEnabled(): boolean {
  return process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';
}

export async function fetchProjects(): Promise<Project[]> {
  if (isMockDataEnabled()) {
    return mockProjects.filter((project) => project.published);
  }

  try {
    return await getProjects();
  } catch {
    return [];
  }
}

export async function fetchSubcategories(): Promise<Subcategory[]> {
  if (isMockDataEnabled()) {
    return mockSubcategories;
  }

  try {
    return await getSubcategories();
  } catch {
    return [];
  }
}

export async function fetchProject(slug: string): Promise<Project | null> {
  if (isMockDataEnabled()) {
    const project = getMockProjectBySlug(slug);
    return project?.published ? project : null;
  }

  try {
    return await getProject(slug);
  } catch {
    return null;
  }
}
