import { notFound } from 'next/navigation';
import AudioPlayer from '@/components/AudioPlayer';
import PageLayout from '@/components/PageLayout';
import PhotoMasonry from '@/components/PhotoMasonry';
import PlatformLinks from '@/components/PlatformLinks';
import YouTubeEmbed from '@/components/YouTubeEmbed';
import { getProject } from '@/lib/api';

export const revalidate = 60;

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;

  let project;
  try {
    project = await getProject(slug);
  } catch {
    notFound();
  }

  const hasPhotos = project.photos.length > 0;
  const hasYoutubeEmbed = Boolean(project.youtubeVideoId);
  const hasYoutubeLink = Boolean(project.youtubeLink && project.youtubeLinkLabel);
  const hasAudioPlayer = Boolean(project.audioUrl);
  const hasPlatformLinks = Boolean(project.platformLinks?.length);

  return (
    <PageLayout>
      <div className="mx-auto mb-8 max-w-[1400px] px-5 sm:mb-10 sm:px-8 lg:px-12">
        <h1 className="font-display text-3xl font-bold uppercase tracking-wide sm:text-4xl">
          {project.name}
        </h1>
        {project.description && (
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted sm:text-lg">
            {project.description}
          </p>
        )}
        {hasYoutubeLink && (
          <a
            href={project.youtubeLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block text-sm font-medium text-accent transition-colors hover:text-accent-hover"
          >
            {project.youtubeLinkLabel}
          </a>
        )}
      </div>

      {hasYoutubeEmbed && <YouTubeEmbed videoId={project.youtubeVideoId!} />}
      {(hasAudioPlayer || hasPlatformLinks) && (
        <div className="mx-auto mb-10 max-w-3xl px-5 sm:mb-12 sm:px-8 lg:px-12">
          {hasAudioPlayer && <AudioPlayer src={project.audioUrl!} />}
          {hasPlatformLinks && (
            <PlatformLinks
              links={project.platformLinks!}
              className={hasAudioPlayer ? 'mt-5' : ''}
            />
          )}
        </div>
      )}
      {hasPhotos && <PhotoMasonry photos={project.photos} projectName={project.name} />}
    </PageLayout>
  );
}
