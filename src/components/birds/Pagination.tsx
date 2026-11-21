import { ChevronLeft, ChevronRight } from 'lucide-react';
import { pageItems } from '../../utils/birdFilter';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/**
 * BIRDS 페이지네이션 (PDF p.3, p.8, p.17 기준)
 * - 이전 / 페이지 번호(1 2 3 ... 11) / 다음
 */
export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;
  const items = pageItems(currentPage, totalPages);

  const circleBase =
    'grid h-10 w-10 place-items-center rounded-full text-[0.9rem] font-medium transition-colors';

  return (
    <nav aria-label="페이지 이동" className="mt-10 flex items-center justify-center gap-1.5 sm:gap-2">
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="이전 페이지"
        className={`${circleBase} border border-line bg-surface text-text shadow-soft hover:bg-sage disabled:cursor-not-allowed disabled:opacity-40`}
      >
        <ChevronLeft size={16} aria-hidden />
      </button>

      {items.map((item, idx) =>
        item === '…' ? (
          <span
            key={`dots-${idx}`}
            aria-hidden="true"
            className="grid h-10 w-8 place-items-center text-[0.9rem] text-muted"
          >
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onPageChange(item)}
            aria-current={item === currentPage ? 'page' : undefined}
            className={`${circleBase} ${
              item === currentPage
                ? 'bg-primary font-semibold text-on-primary shadow-soft'
                : 'border border-line bg-surface text-text shadow-soft hover:bg-sage'
            }`}
          >
            {item}
          </button>
        ),
      )}

      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="다음 페이지"
        className={`${circleBase} border border-line bg-surface text-text shadow-soft hover:bg-sage disabled:cursor-not-allowed disabled:opacity-40`}
      >
        <ChevronRight size={16} aria-hidden />
      </button>
    </nav>
  );
}
