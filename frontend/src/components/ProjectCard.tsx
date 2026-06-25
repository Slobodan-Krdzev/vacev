import Image from 'next/image';
import Link from 'next/link';
import { resolveImageUrl } from '@/lib/images';
import type { Project } from '@/types';

interface ProjectCardProps {
  project: Project;
  animationDelay?: number;
  homeTitle?: boolean;
}

export default function ProjectCard({ project, animationDelay, homeTitle = false }: ProjectCardProps) {
  const animate = animationDelay !== undefined;

  return (
    <Link
      href={`/work/${project.slug}`}
      className={`group block ${animate ? 'animate-fade-in-up' : ''}`}
      style={animate ? { animationDelay: `${animationDelay}ms` } : undefined}
    >
      <div className="apple-round relative aspect-square overflow-hidden bg-surface">
        <Image
          src={resolveImageUrl(project.coverImage)}
          alt={project.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <h2
        className={`font-display mt-4 text-lg font-bold uppercase tracking-wide sm:mt-5 sm:text-xl ${
          homeTitle ? 'project-title' : ''
        }`}
      >
        {project.name}
      </h2>
    </Link>
  );
}
