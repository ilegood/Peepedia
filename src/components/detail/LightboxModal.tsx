import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useScrollLock } from '../../hooks/useScrollLock';

interface LightboxModalProps {
  open: boolean;
  photos: string[];
  index: number;
  birdName: string;
  onIndexChange: (nextIndex: number) => void;
  onClose: () => void;
}

/**
 * BIRD DETAIL - 사진 확대 라이트박스 (PDF p.20, p.21 & 기획서 §6-2 기준)
 * - 전체 어두운 배경, 사진 중앙 정렬, 원본 비율 유지(자르기 금지)
 * - 우측 상단 X 버튼, 좌우 이동(양 끝 순환), 사진 번호 표시
 * - 배경 클릭 닫기, 배경 스크롤 잠금 및 닫을 때 위치 복원
 */
export function LightboxModal({
  open,
  photos,
  index,
  birdName,
  onIndexChange,
  onClose,
}: LightboxModalProps) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const swipeRef = useRef({ active: false, startX: 0 });
  useScrollLock(open);

  const total = photos.length;
  const safeIndex = total > 0 ? ((index % total) + total) % total : 0;
  const multi = total > 1;

  const goPrev = () => onIndexChange((safeIndex - 1 + total) % total);
  const goNext = () => onIndexChange((safeIndex + 1) % total);

  useEffect(() => {
    if (!open) return;
    closeBtnRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open || total === 0) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${birdName} 사진 크게 보기`}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-xs"
    >
      {/* 우측 상단 닫기 버튼 */}
      <button
        ref={closeBtnRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="사진 확대 닫기"
        className="fixed top-4 right-4 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25 md:top-6 md:right-6"
      >
        <X size={20} aria-hidden />
      </button>

      {/* 중앙 사진 영역 (클릭 시 닫히지 않음) */}
      <div
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => {
          swipeRef.current = { active: true, startX: e.clientX };
        }}
        onPointerUp={(e) => {
          if (!swipeRef.current.active) return;
          const dx = e.clientX - swipeRef.current.startX;
          swipeRef.current.active = false;
          if (multi && Math.abs(dx) >= 40) {
            if (dx < 0) goNext();
            else goPrev();
          }
        }}
        onPointerCancel={() => {
          swipeRef.current.active = false;
        }}
        className="relative flex max-h-[84vh] max-w-[92vw] touch-pan-y items-center justify-center select-none"
      >
        <img
          key={photos[safeIndex]}
          src={photos[safeIndex]}
          alt={multi ? `${birdName} 사진 ${safeIndex + 1}` : birdName}
          draggable={false}
          className="max-h-[84vh] max-w-[92vw] rounded-2xl object-contain shadow-2xl"
        />

        {multi && (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label="이전 사진"
              className="absolute top-1/2 left-3 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/20 text-white backdrop-blur-xs transition-colors hover:bg-white/35 md:left-4 md:h-11 md:w-11"
            >
              <ChevronLeft size={20} aria-hidden />
            </button>

            <button
              type="button"
              onClick={goNext}
              aria-label="다음 사진"
              className="absolute top-1/2 right-3 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/20 text-white backdrop-blur-xs transition-colors hover:bg-white/35 md:right-4 md:h-11 md:w-11"
            >
              <ChevronRight size={20} aria-hidden />
            </button>

            <span
              aria-live="polite"
              className="pointer-events-none absolute right-3 bottom-3 rounded-full bg-black/70 px-3 py-1 text-[0.82rem] font-medium text-white tabular-nums md:right-4 md:bottom-4"
            >
              {safeIndex + 1} / {total}
            </span>
          </>
        )}
      </div>
    </div>,
    document.body,
  );
}
