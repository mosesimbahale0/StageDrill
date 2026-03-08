import { Heart } from 'lucide-react';

interface LikeButtonProps {
  initialLikeCount: number;
}

export function LikeButton({ initialLikeCount }: LikeButtonProps) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary border border-tertiary text-text2 text-sm">
      <Heart size={16} className="text-accent" />
      <span>{initialLikeCount}</span>
    </div>
  );
}
