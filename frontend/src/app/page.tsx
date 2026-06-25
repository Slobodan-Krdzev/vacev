import PageLayout from '@/components/PageLayout';
import HomeProjects from '@/components/HomeProjects';
import { fetchProjects, fetchSubcategories } from '@/lib/data';

export const revalidate = 60;

export default async function HomePage() {
  const [projects, subcategories] = await Promise.all([fetchProjects(), fetchSubcategories()]);

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
