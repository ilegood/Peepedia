import { Search, ChevronDown } from 'lucide-react';
import { SORT_OPTIONS, type SortKey } from '../../utils/birdFilter';

interface SearchSortBarProps {
  query: string;
  sort: SortKey;
  onQueryChange: (q: string) => void;
  onSortChange: (sort: SortKey) => void;
  onReset: () => void;
}

/**
 * BIRDS 검색 · 초기화 · 정렬 바 (PDF p.2, p.8, p.14, p.16 기준)
 * - PC: 검색 입력창 + 초기화 + 정렬 한 줄 배치
 * - 모바일: 1줄 검색 입력창, 2줄 정렬 + 초기화
 */
export function SearchSortBar({
  query,
  sort,
  onQueryChange,
  onSortChange,
  onReset,
}: SearchSortBarProps) {
  return (
    <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center">
      {/* 검색 입력창 */}
      <div className="relative flex-1">
        <label htmlFor="bird-search" className="sr-only">
          새 검색 (한국어 이름, 영어 이름, 학명)
        </label>
        <Search
          size={17}
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted"
        />
        <input
          id="bird-search"
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="한국어 이름, 영어 이름, 학명으로 검색"
          className="h-11 w-full rounded-full border border-line bg-surface pr-4 pl-11 text-[0.92rem] text-text placeholder:text-muted/80 shadow-soft transition-colors focus:border-primary focus:outline-none"
        />
      </div>

      {/* 초기화 + 정렬 */}
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={onReset}
          className="order-2 h-11 shrink-0 rounded-full border border-line bg-surface px-4 text-[0.88rem] font-medium text-text shadow-soft transition-colors hover:bg-sage md:order-1"
        >
          초기화
        </button>

        <div className="relative order-1 flex-1 md:order-2 md:flex-none">
          <label htmlFor="bird-sort" className="sr-only">
            정렬 기준
          </label>
          <select
            id="bird-sort"
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortKey)}
            className="h-11 w-full appearance-none rounded-full border border-line bg-surface pr-9 pl-4 text-[0.88rem] font-medium text-text shadow-soft transition-colors hover:bg-sage focus:border-primary focus:outline-none md:w-auto"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={15}
            aria-hidden
            className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-muted"
          />
        </div>
      </div>
    </div>
  );
}
