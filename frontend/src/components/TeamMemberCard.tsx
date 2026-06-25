import Image from 'next/image';
import type { TeamMember } from '@/lib/team';

interface TeamMemberCardProps {
  member: TeamMember;
}

export default function TeamMemberCard({ member }: TeamMemberCardProps) {
  const fullName = `${member.firstName} ${member.lastName}`;

  return (
    <article className="flex flex-col items-center text-center sm:items-start sm:text-left">
      <div className="relative h-36 w-36 shrink-0 overflow-hidden rounded-full bg-surface ring-1 ring-border sm:h-40 sm:w-40">
        <Image
          src={member.avatar}
          alt={fullName}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 144px, 160px"
        />
      </div>
      <h3 className="font-display mt-5 text-xl font-bold uppercase tracking-wide text-heading sm:text-2xl">
        {member.firstName}{' '}
        <span className="block sm:inline">{member.lastName}</span>
      </h3>
      <p className="mt-1 text-sm font-medium tracking-wide text-accent">{member.role}</p>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted sm:text-base">
        {member.description}
      </p>
    </article>
  );
}
