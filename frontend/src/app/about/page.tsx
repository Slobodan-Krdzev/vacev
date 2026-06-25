import PageLayout from '@/components/PageLayout';
import TeamSection from '@/components/TeamSection';

export default function AboutPage() {
  return (
    <PageLayout>
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <h1 className="font-display text-3xl font-bold uppercase tracking-wide sm:text-4xl">
          About
        </h1>
        <div className="mt-8 space-y-5 text-base leading-relaxed text-muted sm:text-lg">
          <p>
            Vacev is a photographer and videographer creating bold, editorial visuals
            for brands, artists, and individuals. Based in the Balkans, the work spans
            portraits, commercial campaigns, and fashion editorials.
          </p>
          <p>
            Every project is approached with a focus on light, composition, and
            storytelling — whether capturing a single portrait or producing a full
            video campaign.
          </p>
          <p>
            For collaborations and inquiries, reach out via email at{' '}
            <a href="mailto:hello@vacev.com" className="text-accent underline hover:text-accent-hover">
              hello@vacev.com
            </a>
            .
          </p>
        </div>

        <TeamSection />
      </div>
    </PageLayout>
  );
}
