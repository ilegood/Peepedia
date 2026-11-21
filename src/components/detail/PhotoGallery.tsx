import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BirdImageFrame } from '../common/BirdImageFrame';

interface PhotoGalleryProps {
  photos: string[];
  birdName: string;
  onOpenLightbox?: (index: number) => void;
}

/**
 * BIRD DETAIL - 사진 갤러리 (PDF p.4, p.9, p.18 기준)
 * - 새마다 사진 1~5장, 첫 번째가 대표 사진, 3:2 프레임 원본 비율 유지
 * - 1장 이하일 때는 좌우 화살표와 번호(1/4)를 숨긴다.
 * - 양 끝에서 순환, 자동 재생 없음, PC 마우스 드래그 + 모바일 터치 스와이프
 */
export function PhotoGallery({ photos, birdName, onOpenLightbox }: PhotoGalleryProps) {
  const [index, setIndex] = useState(0);
  const swipeRef = useRef({ active: false, startX: 0, moved: false });

  const total = photos.length;
  const safeIndex = total > 0 ? ((index % total) + total) % total : 0;
  const currentSrc = total > 0 ? photos[safeIndex] : null;
  const multi = total > 1;

  const goPrev = () => setIndex((i) => (i - 1 + total) % total);
  const goNext = () => setIndex((i) => (i + 1) % total);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    swipeRef.current = { active: true, startX: e.clientX, moved: false };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!swipeRef.current.active) return;
    if (Math.abs(e.clientX - swipeRef.current.startX) > 10) {
      swipeRef.current.moved = true;
    }
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!swipeRef.current.active) return;
    const dx = e.clientX - swipeRef.current.startX;
    swipeRef.current.active = false;
    if (multi && Math.abs(dx) >= 40) {
      if (dx < 0) goNext();
      else goPrev();
      return;
    }
    if (!swipeRef.current.moved && currentSrc && onOpenLightbox) {
      onOpenLightbox(safeIndex);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-[1.25rem] border border-line bg-surface shadow-card">
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          swipeRef.current.active = false;
        }}
        role={currentSrc && onOpenLightbox ? 'button' : undefined}
        tabIndex={currentSrc && onOpenLightbox ? 0 : undefined}
        aria-label={currentSrc && onOpenLightbox ? `${birdName} 사진 크게 보기` : undefined}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && currentSrc && onOpenLightbox) {
            e.preventDefault();
            onOpenLightbox(safeIndex);
          }
        }}
        className={`touch-pan-y ${currentSrc && onOpenLightbox ? 'cursor-zoom-in' : ''}`}
      >
        <BirdImageFrame
          key={currentSrc ?? 'empty'}
          src={currentSrc}
          alt={multi ? `${birdName} 사진 ${safeIndex + 1}` : birdName}
          loading="eager"
          hoverZoom={Boolean(currentSrc)}
        />
      </div>

      {multi && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            aria-label="이전 사진"
            className="absolute top-1/2 left-3 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-line bg-surface/90 text-text shadow-soft backdrop-blur-xs transition-transform hover:scale-105"
          >
            <ChevronLeft size={18} aria-hidden />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            aria-label="다음 사진"
            className="absolute top-1/2 right-3 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-line bg-surface/90 text-text shadow-soft backdrop-blur-xs transition-transform hover:scale-105"
          >
            <ChevronRight size={18} aria-hidden />
          </button>

          <span
            aria-live="polite"
            className="pointer-events-none absolute right-3 bottom-3 rounded-full bg-black/65 px-3 py-1 text-[0.78rem] font-medium text-white tabular-nums"
          >
            {safeIndex + 1} / {total}
          </span>
        </>
      )}
    </div>
  );
}
