import { TEAM_MEMBERS } from '@/lib/team';
import TeamMemberCard from './TeamMemberCard';

export default function TeamSection() {
  return (
    <section className="mt-16 border-t border-border pt-16 sm:mt-20 sm:pt-20">
      <div className="mb-10 sm:mb-12">
        <h2 className="font-display text-2xl font-bold uppercase tracking-wide sm:text-3xl">
          Our Team
        </h2>
        <p className="mt-3 text-muted">
          The people behind the lens — photographers, filmmakers, and creatives bringing
          every project to life.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 sm:gap-10 lg:grid-cols-3 lg:gap-12">
        {TEAM_MEMBERS.map((member) => (
          <TeamMemberCard key={member.id} member={member} />
        ))}
      </div>
    </section>
  );
}
