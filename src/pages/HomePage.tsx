import { useMemo } from 'react';
import { Container } from '../components/common/Page';
import { BirdMark } from '../components/common/BirdMark';
import { TodaysBirdsCarousel } from '../components/home/TodaysBirdsCarousel';
import { birds } from '../data/birdsIndex';
import { siteConfig } from '../data/siteConfig';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { pickTodaysBirds } from '../utils/todaysBirds';

/**
 * HOME (PDF p.1, p.7, p.15 기준)
 * - 상단 인사말 (독립 영역)
 * - Today's Birds (KST 날짜 기준 일일 5종 캐러셀)
 * - About Peepedia (사이트 목적과 소개만 표시)
 */
export function HomePage() {
  useDocumentTitle();
  const todaysBirds = useMemo(() => pickTodaysBirds(birds, 5), []);

  return (
    <Container>
      {/* 상단 인사말 */}
      <section className="pt-12 pb-10 text-center md:pt-16 md:pb-12">
        <h1 className="font-serif text-[2.4rem] leading-tight font-bold tracking-tight text-heading md:text-[3.4rem]">
          Hello, little bird!
        </h1>
        <p className="mt-3 text-[1.02rem] text-muted md:text-[1.05rem]">{siteConfig.slogan}</p>
      </section>

      {/* Today's Birds */}
      <TodaysBirdsCarousel birds={todaysBirds} />

      {/* About Peepedia */}
      <section aria-labelledby="about-peepedia-title" className="pb-16 md:pb-20">
        <div className="flex flex-col items-start justify-between gap-6 rounded-[1.5rem] bg-sage px-7 py-8 md:flex-row md:items-center md:px-12 md:py-10">
          <div className="max-w-2xl">
            <h2
              id="about-peepedia-title"
              className="font-serif text-[1.4rem] font-bold text-heading md:text-[1.6rem]"
            >
              About Peepedia
            </h2>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-text md:text-[1rem]">
              Peepedia는 다양한 새의 사진, 울음소리, 생태 정보를 한곳에 모아 보여주는 개인 온라인
              새 도감이에요. 새 목록을 검색하고, 마음에 드는 새는 즐겨찾기에 담아 보세요.
            </p>
          </div>
          <div className="hidden shrink-0 md:block">
            <BirdMark size={136} />
          </div>
        </div>
      </section>
    </Container>
  );
}
