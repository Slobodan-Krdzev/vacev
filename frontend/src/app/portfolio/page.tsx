import PageLayout from '@/components/PageLayout';
import ProjectGrid from '@/components/ProjectGrid';
import { getProjects } from '@/lib/api';
import type { Project } from '@/types';

export const revalidate = 60;

export default async function PortfolioPage() {
  let projects: Project[] = [];

  try {
    projects = await getProjects();
  } catch {
    projects = [];
  }

  return (
    <PageLayout>
      <div className="mx-auto mb-10 max-w-[1400px] px-5 sm:mb-12 sm:px-8 lg:px-12">
        <h1 className="font-display text-3xl font-bold uppercase tracking-wide sm:text-4xl">
          Portfolio
        </h1>
        <p className="mt-3 max-w-2xl text-muted">
          A curated selection of photography and videography work across portraits,
          commercial, and fashion.
        </p>
      </div>
      {projects.length > 0 ? (
        <ProjectGrid projects={projects} />
      ) : (
        <div className="mx-auto max-w-[1400px] px-5 py-20 text-center text-muted sm:px-8 lg:px-12">
          <p>No projects available.</p>
        </div>
      )}
    </PageLayout>
  );
}
