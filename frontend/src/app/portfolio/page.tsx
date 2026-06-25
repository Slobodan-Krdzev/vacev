import PageLayout from '@/components/PageLayout';
import ProjectGrid from '@/components/ProjectGrid';
import { fetchProjects } from '@/lib/data';

export const revalidate = 60;

export default async function PortfolioPage() {
  const projects = await fetchProjects();

  return (
    <PageLayout>
      <div className="mx-auto mb-10 max-w-[1400px] px-5 sm:mb-12 sm:px-8 lg:px-12">
        <h1 className="font-display text-3xl font-bold uppercase tracking-wide sm:text-4xl">
          Portfolio
        </h1>
        <p className="mt-3 max-w-2xl text-muted">
          A curated selection of photography, videography, and audio work across portraits,
          commercial, fashion, and studio sessions.
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
