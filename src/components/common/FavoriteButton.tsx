import { Heart } from 'lucide-react';

interface FavoriteButtonProps {
  active: boolean;
  birdName: string;
  onToggle: () => void;
  size?: 'sm' | 'md';
  className?: string;
}

/** 즐겨찾기 하트 토글 버튼 */
export function FavoriteButton({
  active,
  birdName,
  onToggle,
  size = 'sm',
  className = '',
}: FavoriteButtonProps) {
  const dim = size === 'md' ? 'h-10 w-10' : 'h-9 w-9';
  const iconSize = size === 'md' ? 18 : 16;
  const label = active
    ? `${birdName || '이 새'}를 즐겨찾기에서 빼기`
    : `${birdName || '이 새'}를 즐겨찾기에 추가하기`;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle();
      }}
      aria-pressed={active}
      aria-label={label}
      title={label}
      className={`grid ${dim} shrink-0 place-items-center rounded-full border border-line bg-surface text-primary shadow-soft transition-transform hover:scale-105 active:scale-95 ${className}`}
    >
      <Heart size={iconSize} className={active ? 'fill-current' : ''} aria-hidden />
    </button>
  );
}
