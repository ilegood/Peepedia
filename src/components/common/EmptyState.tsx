import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { BirdMark } from './BirdMark';

interface EmptyStateProps {
  title: string;
  description?: string;
  /** 버튼: 링크 이동(to) 또는 클릭 동작(onClick) */
  action?: { label: string; to?: string; onClick?: () => void };
  /** 제목 크기: 404 같은 전체 페이지용은 large */
  size?: 'default' | 'large';
  children?: ReactNode;
}

/** 404 / 검색 결과 없음 / 즐겨찾기 빈 상태 공통 화면 */
export function EmptyState({ title, description, action, size = 'default' }: EmptyStateProps) {
  const large = size === 'large';
  const btnClass =
    'inline-flex h-11 items-center rounded-full bg-primary px-6 text-[0.92rem] font-semibold text-on-primary shadow-soft transition-opacity hover:opacity-90';

  return (
    <div className="flex flex-col items-center px-4 text-center">
      <BirdMark size={large ? 128 : 96} />
      <h2
        className={`mt-6 font-serif font-bold text-heading ${
          large ? 'text-[1.9rem] md:text-[2.6rem]' : 'text-[1.4rem] md:text-[1.55rem]'
        }`}
      >
        {title}
      </h2>
      {description && <p className={`mt-2 text-muted ${large ? 'md:text-[1.05rem]' : 'text-[0.95rem]'}`}>{description}</p>}
      {action && (
        <div className="mt-6">
          {action.to ? (
            <Link to={action.to} className={btnClass}>
              {action.label}
            </Link>
          ) : (
            <button type="button" onClick={action.onClick} className={btnClass}>
              {action.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
