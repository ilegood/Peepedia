import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BirdCard } from '../components/common/BirdCard';
import { EmptyState } from '../components/common/EmptyState';
import { Container, PageTitle } from '../components/common/Page';
import { Pagination } from '../components/birds/Pagination';
import { SearchSortBar } from '../components/birds/SearchSortBar';
import { birds } from '../data/birdsIndex';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import {
  PAGE_SIZE,
  paginate,
  searchBirds,
  sortBirds,
  totalPagesOf,
  type SortKey,
} from '../utils/birdFilter';

const CONTEXT_KEY = 'peepedia-birds-context';
const SCROLL_KEY = 'peepedia-birds-scroll';

/**
 * BIRDS (PDF p.2, p.3, p.8, p.14, p.16, p.17 기준)
 * - 검색(한국어·영어·학명) + 초기화 + 정렬(가나다순 / 알파벳순)
 * - PC 4열 / 모바일 2열 반응형 그리드, 페이지당 20종
 * - 상세 페이지에서 돌아왔을 때 검색어·정렬·페이지·스크롤 위치 복원
 */
export function BirdsPage() {
  useDocumentTitle('BIRDS');
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get('q') ?? '';
  const sort: SortKey = searchParams.get('sort') === 'en' ? 'en' : 'ko';
  const rawPage = Number(searchParams.get('page') ?? '1');

  const filtered = useMemo(() => {
    const searched = searchBirds(birds, query);
    return sortBirds(searched, sort);
  }, [query, sort]);

  const totalPages = totalPagesOf(filtered.length, PAGE_SIZE);
  const currentPage =
    Number.isFinite(rawPage) && rawPage >= 1 ? Math.min(Math.floor(rawPage), totalPages) : 1;

  const pageBirds = useMemo(
    () => paginate(filtered, currentPage, PAGE_SIZE),
    [filtered, currentPage],
  );

  // 현재 검색/정렬 맥락을 저장해 상세 페이지의 이전/다음 새가 같은 기준을 쓰도록 한다.
  useEffect(() => {
    try {
      sessionStorage.setItem(CONTEXT_KEY, JSON.stringify({ q: query, sort }));
    } catch {
      /* ignore */
    }
  }, [query, sort]);

  // 상세 페이지에서 돌아왔을 때 스크롤 위치 복원
  useEffect(() => {
    let timer: number | undefined;
    try {
      const saved = sessionStorage.getItem(SCROLL_KEY);
      if (!saved) return;
      const parsed = JSON.parse(saved) as { search: string; y: number };
      if (parsed.search === searchParams.toString() && typeof parsed.y === 'number') {
        sessionStorage.removeItem(SCROLL_KEY);
        // React Router ScrollRestoration 보다 뒤에서 확실히 복원한다.
        timer = window.setTimeout(() => {
          requestAnimationFrame(() => window.scrollTo(0, parsed.y));
        }, 40);
      }
    } catch {
      /* ignore */
    }
    return () => {
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [searchParams]);

  const updateParams = (next: { q?: string; sort?: SortKey; page?: number }) => {
    const params = new URLSearchParams();
    const qVal = next.q !== undefined ? next.q : query;
    const sVal = next.sort !== undefined ? next.sort : sort;
    const pVal = next.page !== undefined ? next.page : currentPage;
    if (qVal) params.set('q', qVal);
    if (sVal !== 'ko') params.set('sort', sVal);
    if (pVal > 1) params.set('page', String(pVal));
    setSearchParams(params, { replace: true });
  };

  const handleQueryChange = (q: string) => updateParams({ q, page: 1 });
  const handleSortChange = (nextSort: SortKey) => updateParams({ sort: nextSort, page: 1 });
  const handleReset = () => updateParams({ q: '', sort: 'ko', page: 1 });
  const handlePageChange = (page: number) => {
    updateParams({ page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const saveScrollBeforeDetail = () => {
    try {
      sessionStorage.setItem(
        SCROLL_KEY,
        JSON.stringify({ search: searchParams.toString(), y: window.scrollY }),
      );
    } catch {
      /* ignore */
    }
  };

  return (
    <Container>
      <div className="pt-10 pb-16 md:pt-14 md:pb-20">
        <PageTitle>BIRDS</PageTitle>

        <SearchSortBar
          query={query}
          sort={sort}
          onQueryChange={handleQueryChange}
          onSortChange={handleSortChange}
          onReset={handleReset}
        />

        {filtered.length === 0 ? (
          <div className="py-20">
            <EmptyState
              title="앗! 찾는 새가 아직 없어요."
              description="다른 이름이나 학명으로 다시 검색해 보세요."
              action={{ label: '검색 초기화', onClick: handleReset }}
            />
          </div>
        ) : (
          <>
            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-5">
              {pageBirds.map((bird) => (
                <BirdCard
                  key={bird.id}
                  bird={bird}
                  linkState={{ fromBirds: true, q: query, sort }}
                  onNavigate={saveScrollBeforeDetail}
                />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </Container>
  );
}
