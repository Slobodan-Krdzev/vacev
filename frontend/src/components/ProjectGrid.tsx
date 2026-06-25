'use client';

import { useEffect, useState } from 'react';
import { useIntro } from '@/lib/intro-context';
import type { Project } from '@/types';
import ProjectCard from './ProjectCard';

interface ProjectGridProps {
  projects: Project[];
  fadeIn?: boolean;
}

export default function ProjectGrid({ projects, fadeIn = false }: ProjectGridProps) {
  const { introComplete } = useIntro();
  const [animate, setAnimate] = useState(!fadeIn);

  useEffect(() => {
    if (fadeIn && introComplete) {
      setAnimate(true);
    }
  }, [fadeIn, introComplete]);

  return (
    <div className="mx-auto grid w-full min-w-0 max-w-[1400px] grid-cols-1 gap-x-5 gap-y-10 overflow-x-hidden px-5 sm:grid-cols-2 sm:gap-x-6 sm:px-8 lg:grid-cols-3 lg:gap-x-8 lg:px-12">
      {projects.map((project, index) => (
        <ProjectCard
          key={project._id}
          project={project}
          homeTitle={fadeIn}
          animationDelay={fadeIn && animate ? index * 120 : undefined}
        />
      ))}
    </div>
  );
}
