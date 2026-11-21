import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { birds } from '../../data/birdsIndex';
import { searchBirds, sortBirds, type SortKey } from '../../utils/birdFilter';

interface PrevNextNavProps {
  currentBirdId: string;
}

interface BirdsContextState {
  q: string;
  sort: SortKey;
}

function readBirdsContext(locationState: unknown): BirdsContextState {
  if (locationState && typeof locationState === 'object' && 'fromBirds' in locationState) {
    const s = locationState as { q?: unknown; sort?: unknown };
    return {
      q: typeof s.q === 'string' ? s.q : '',
      sort: s.sort === 'en' ? 'en' : 'ko',
    };
  }
  try {
    const raw = sessionStorage.getItem('peepedia-birds-context');
    if (raw) {
      const parsed = JSON.parse(raw) as { q?: unknown; sort?: unknown };
      return {
        q: typeof parsed.q === 'string' ? parsed.q : '',
        sort: parsed.sort === 'en' ? 'en' : 'ko',
      };
    }
  } catch {
    /* ignore */
  }
  return { q: '', sort: 'ko' };
}

/**
 * BIRD DETAIL - 이전 새 / 다음 새 (PDF p.5, p.9, p.19 기준)
 * - 현재 BIRDS 목록의 검색·정렬 결과 순서를 기준으로 이동
 * - 첫 번째에서는 이전 비활성화, 마지막에서는 다음 비활성화
 * - 이동 시 페이지 상단으로 스크롤
 */
export function PrevNextNav({ currentBirdId }: PrevNextNavProps) {
  const location = useLocation();
  const ctx = readBirdsContext(location.state);

  const { ordered, index } = useMemo(() => {
    const searched = searchBirds(birds, ctx.q);
    const sorted = sortBirds(searched, ctx.sort);
    const idx = sorted.findIndex((b) => b.id === currentBirdId);
    // 현재 새가 검색 결과에 없으면 전체 가나다순으로 대체
    if (idx === -1) {
      const fallback = sortBirds(birds, 'ko');
      return { ordered: fallback, index: fallback.findIndex((b) => b.id === currentBirdId) };
    }
    return { ordered: sorted, index: idx };
  }, [ctx.q, ctx.sort, currentBirdId]);

  if (index === -1) return null;

  const prevBird = index > 0 ? ordered[index - 1] : null;
  const nextBird = index < ordered.length - 1 ? ordered[index + 1] : null;
  const sortLabel = ctx.sort === 'en' ? '알파벳순' : '가나다순';
  const contextLabel = `BIRDS 목록 기준 · ${sortLabel}${ctx.q ? ` · 검색어 '${ctx.q}'` : ''} · ${index + 1} / ${ordered.length}`;

  const cardClass =
    'flex items-center gap-3 rounded-[1.25rem] border border-line bg-surface px-4 py-4 shadow-soft transition-colors';

  return (
    <section aria-labelledby="prev-next-title" className="mt-12">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2
          id="prev-next-title"
          className="font-serif text-[1.4rem] font-bold text-heading md:text-[1.55rem]"
        >
          이전 새 · 다음 새
        </h2>
        <span className="inline-block w-fit rounded-full bg-sage px-3.5 py-1 text-[0.78rem] font-medium text-heading">
          {contextLabel}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {/* 이전 새 */}
        {prevBird ? (
          <Link
            to={`/birds/${prevBird.id}`}
            state={{ fromBirds: true, q: ctx.q, sort: ctx.sort }}
            onClick={() => window.scrollTo({ top: 0 })}
            className={`${cardClass} hover:bg-sage/60`}
          >
            <ChevronLeft size={18} className="shrink-0 text-muted" aria-hidden />
            <div className="min-w-0">
              <div className="text-[0.75rem] text-muted">이전 새</div>
              <div className="truncate font-bold text-text">{prevBird.nameKo || prevBird.id}</div>
              {prevBird.nameEn && (
                <div className="truncate text-[0.8rem] text-muted">{prevBird.nameEn}</div>
              )}
            </div>
          </Link>
        ) : (
          <div aria-disabled="true" className={`${cardClass} cursor-not-allowed opacity-45`}>
            <ChevronLeft size={18} className="shrink-0 text-muted" aria-hidden />
            <div className="min-w-0">
              <div className="text-[0.75rem] text-muted">이전 새</div>
              <div className="truncate text-[0.9rem] text-muted">첫 번째 새예요</div>
            </div>
          </div>
        )}

        {/* 다음 새 */}
        {nextBird ? (
          <Link
            to={`/birds/${nextBird.id}`}
            state={{ fromBirds: true, q: ctx.q, sort: ctx.sort }}
            onClick={() => window.scrollTo({ top: 0 })}
            className={`${cardClass} justify-end text-right hover:bg-sage/60`}
          >
            <div className="min-w-0">
              <div className="text-[0.75rem] text-muted">다음 새</div>
              <div className="truncate font-bold text-text">{nextBird.nameKo || nextBird.id}</div>
              {nextBird.nameEn && (
                <div className="truncate text-[0.8rem] text-muted">{nextBird.nameEn}</div>
              )}
            </div>
            <ChevronRight size={18} className="shrink-0 text-muted" aria-hidden />
          </Link>
        ) : (
          <div
            aria-disabled="true"
            className={`${cardClass} cursor-not-allowed justify-end text-right opacity-45`}
          >
            <div className="min-w-0">
              <div className="text-[0.75rem] text-muted">다음 새</div>
              <div className="truncate text-[0.9rem] text-muted">마지막 새예요</div>
            </div>
            <ChevronRight size={18} className="shrink-0 text-muted" aria-hidden />
          </div>
        )}
      </div>

      <p className="mt-2.5 text-[0.78rem] text-muted">
        현재 검색·정렬 결과 순서대로 이동해요. 첫 새에서는 이전, 마지막 새에서는 다음이 비활성화되고,
        이동 후 페이지 상단으로 올라가요.
      </p>
    </section>
  );
}
