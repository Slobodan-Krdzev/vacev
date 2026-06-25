import PageLayout from '@/components/PageLayout';
import HomeProjects from '@/components/HomeProjects';
import { getProjects, getSubcategories } from '@/lib/api';
import type { Project, Subcategory } from '@/types';

export const revalidate = 60;

export default async function HomePage() {
  let projects: Project[] = [];
  let subcategories: Subcategory[] = [];

  try {
    [projects, subcategories] = await Promise.all([getProjects(), getSubcategories()]);
  } catch {
    projects = [];
    subcategories = [];
  }

  return (
    <PageLayout>
      {projects.length > 0 ? (
        <HomeProjects projects={projects} subcategories={subcategories} />
      ) : (
        <div className="mx-auto max-w-[1400px] px-5 py-20 text-center text-muted sm:px-8 lg:px-12">
          <p className="text-lg">No projects yet.</p>
          <p className="mt-2 text-sm">Add projects from the admin dashboard.</p>
        </div>
      )}
    </PageLayout>
  );
}
