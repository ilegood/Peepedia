import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Bird } from '../../types/bird';
import { BirdImageFrame } from '../common/BirdImageFrame';
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery';

interface TodaysBirdsCarouselProps {
  birds: Bird[];
}

/**
 * HOME - Today's Birds 가로형 캐러셀 (PDF p.1, p.7, p.15 기준)
 * - PC: 좌우 화살표 및 마우스 드래그
 * - 모바일: 터치 스와이프
 * - 약 6초마다 옆으로 한 장씩 이동 (호버/드래그 중 일시정지, 모션 감소 설정 시 정지)
 * - 카드 하단: 한국어 이름 + 학명 (영어 이름 미표시), 하단 그라데이션 적용
 */
export function TodaysBirdsCarousel({ birds }: TodaysBirdsCarouselProps) {
  const navigate = useNavigate();
  const reducedMotion = usePrefersReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  // 마우스 드래그 상태
  const dragRef = useRef({ active: false, startX: 0, startScroll: 0, moved: false });

  const getStep = useCallback(() => {
    const track = trackRef.current;
    if (!track) return 320;
    const first = track.firstElementChild as HTMLElement | null;
    if (!first) return track.clientWidth * 0.8;
    const gap = parseFloat(getComputedStyle(track).columnGap || '20') || 20;
    return first.getBoundingClientRect().width + gap;
  }, []);

  const scrollNext = useCallback(() => {
    const track = trackRef.current;
    if (!track || birds.length <= 1) return;
    const maxScroll = track.scrollWidth - track.clientWidth;
    if (maxScroll <= 4) return;
    if (track.scrollLeft >= maxScroll - 8) {
      track.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      track.scrollBy({ left: getStep(), behavior: 'smooth' });
    }
  }, [birds.length, getStep]);

  const scrollPrev = useCallback(() => {
    const track = trackRef.current;
    if (!track || birds.length <= 1) return;
    const maxScroll = track.scrollWidth - track.clientWidth;
    if (track.scrollLeft <= 8) {
      track.scrollTo({ left: maxScroll, behavior: 'smooth' });
    } else {
      track.scrollBy({ left: -getStep(), behavior: 'smooth' });
    }
  }, [birds.length, getStep]);

  // 약 6초마다 자동 전환
  useEffect(() => {
    if (paused || reducedMotion || birds.length <= 1) return;
    const id = window.setInterval(scrollNext, 6000);
    return () => window.clearInterval(id);
  }, [paused, reducedMotion, birds.length, scrollNext]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // 터치 기기는 네이티브 스와이프에 맡긴다.
    if (e.pointerType !== 'mouse') return;
    const track = trackRef.current;
    if (!track) return;
    dragRef.current = {
      active: true,
      startX: e.clientX,
      startScroll: track.scrollLeft,
      moved: false,
    };
    setPaused(true);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active || e.pointerType !== 'mouse') return;
    const track = trackRef.current;
    if (!track) return;
    const dx = e.clientX - dragRef.current.startX;
    if (Math.abs(dx) > 6) dragRef.current.moved = true;
    if (dragRef.current.moved) {
      track.scrollLeft = dragRef.current.startScroll - dx;
    }
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    dragRef.current.active = false;
    setPaused(false);
  };

  if (birds.length === 0) return null;

  return (
    <section aria-labelledby="todays-birds-title" className="pb-12 md:pb-16">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2
            id="todays-birds-title"
            className="font-serif text-[1.45rem] font-bold text-heading md:text-[1.7rem]"
          >
            Today&apos;s Birds
          </h2>
          <p className="mt-1 text-[0.85rem] text-muted md:text-[0.9rem]">
            오늘의 새 5종이에요. 같은 날에는 같은 새가 나오고, 날짜가 바뀌면 새로 뽑혀요.
          </p>
        </div>

        {/* PC 좌우 화살표 */}
        <div className="hidden shrink-0 items-center gap-2 md:flex">
          <button
            type="button"
            onClick={scrollPrev}
            aria-label="이전 새 보기"
            className="grid h-10 w-10 place-items-center rounded-full border border-line bg-surface text-text shadow-soft transition-colors hover:bg-sage"
          >
            <ChevronLeft size={18} aria-hidden />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            aria-label="다음 새 보기"
            className="grid h-10 w-10 place-items-center rounded-full border border-line bg-surface text-text shadow-soft transition-colors hover:bg-sage"
          >
            <ChevronRight size={18} aria-hidden />
          </button>
        </div>
      </div>

      {/* 가로 캐러셀 트랙 */}
      <div
        ref={trackRef}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => {
          dragRef.current.active = false;
          setPaused(false);
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 select-none [scrollbar-width:none] md:cursor-grab md:gap-5 md:active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
      >
        {birds.map((bird, idx) => {
          const displayName = bird.nameKo || bird.nameEn || bird.id;
          return (
            <div
              key={bird.id}
              className="w-[82%] shrink-0 snap-start sm:w-[56%] md:w-[46%] lg:w-[44%]"
            >
              <button
                type="button"
                onClick={() => {
                  if (dragRef.current.moved) {
                    dragRef.current.moved = false;
                    return;
                  }
                  navigate(`/birds/${bird.id}`);
                }}
                className="group relative block w-full overflow-hidden rounded-[1.25rem] border border-line bg-surface text-left shadow-card focus-visible:outline-offset-2"
              >
                <BirdImageFrame
                  src={bird.media.photos[0]}
                  alt={displayName}
                  loading={idx < 2 ? 'eager' : 'lazy'}
                  hoverZoom
                />
                {/* 하단 가독성 그라데이션 + 한국어 이름·학명 */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent px-4 pt-10 pb-4 text-white sm:px-5 sm:pb-5">
                  <div className="text-[1.15rem] leading-snug font-bold sm:text-[1.25rem]">
                    {bird.nameKo || '이름 준비 중'}
                  </div>
                  {bird.scientificName && (
                    <div className="mt-0.5 text-[0.82rem] text-white/85 italic sm:text-[0.88rem]">
                      {bird.scientificName}
                    </div>
                  )}
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* 하단 안내 문구 (PDF p.1, p.7 기준) */}
      <p className="mt-2.5 text-center text-[0.8rem] text-muted">
        <span className="hidden md:inline">
          약 6초마다 옆으로 한 장씩 넘어가요. 화살표나 드래그로도 넘길 수 있어요.
        </span>
        <span className="md:hidden">약 6초마다 옆으로 넘어가고, 밀어서도 넘길 수 있어요.</span>
      </p>
    </section>
  );
}
