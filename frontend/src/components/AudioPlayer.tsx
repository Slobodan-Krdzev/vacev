import { resolveMediaUrl } from '@/lib/media';

interface AudioPlayerProps {
  src: string;
}

export default function AudioPlayer({ src }: AudioPlayerProps) {
  return (
    <audio controls className="w-full" src={resolveMediaUrl(src)}>
      Your browser does not support the audio element.
    </audio>
  );
}
