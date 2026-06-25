export interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  description: string;
  avatar: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: '1',
    firstName: 'Viktor',
    lastName: 'Vacev',
    role: 'Founder & Lead Photographer',
    description:
      'Specializes in portrait and editorial photography with a focus on dramatic light and bold composition.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
  },
  {
    id: '2',
    firstName: 'Ana',
    lastName: 'Petrova',
    role: 'Videographer',
    description:
      'Creates cinematic brand films and commercial video content from concept through final edit.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80',
  },
  {
    id: '3',
    firstName: 'Marko',
    lastName: 'Stojanov',
    role: 'Creative Director',
    description:
      'Shapes visual direction across campaigns, ensuring every project tells a cohesive story.',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&q=80',
  },
];
