import { Link } from 'react-router-dom';
import type { Bird } from '../../types/bird';
import { BirdImageFrame } from './BirdImageFrame';
import { FavoriteButton } from './FavoriteButton';

interface BirdCardProps {
  bird: Bird;
  /** 상세 페이지 이동 시 전달할 location state (목록 상태·출처 컨텍스트) */
  linkState?: unknown;
  /** 카드 클릭 시 스크롤 저장 등 추가 동작 */
  onNavigate?: () => void;
  /** 좌측 상단 배지 (예: "가장 최근") */
  badge?: string;
  /** 우측 상단 즐겨찾기 하트 버튼 표시 여부 */
  favoriteControl?: {
    active: boolean;
    onToggle: () => void;
  };
}

/** BIRDS · FAVORITES 공용 새 카드 (PDF p.2, p.6, p.8, p.10 기준) */
export function BirdCard({ bird, linkState, onNavigate, badge, favoriteControl }: BirdCardProps) {
  const displayName = bird.nameKo || bird.nameEn || bird.id;

  return (
    <article className="group relative flex flex-col rounded-[1.25rem] border border-line bg-surface p-2.5 shadow-card transition-transform duration-200 hover:-translate-y-0.5 sm:p-3">
      <Link
        to={`/birds/${bird.id}`}
        state={linkState}
        onClick={onNavigate}
        className="flex flex-1 flex-col rounded-xl focus-visible:outline-offset-4"
      >
        <div className="relative overflow-hidden rounded-xl">
          <BirdImageFrame
            src={bird.media.photos[0]}
            alt={displayName}
            hoverZoom={!favoriteControl}
          />
          {badge && (
            <span className="pointer-events-none absolute top-2.5 left-2.5 rounded-full bg-primary px-2.5 py-0.5 text-[0.72rem] font-semibold text-on-primary shadow-soft">
              {badge}
            </span>
          )}
        </div>

        <div className="mt-3 px-1 pb-1">
          <h2 className="truncate text-[1rem] font-bold text-text sm:text-[1.05rem]">
            {bird.nameKo || '이름 준비 중'}
          </h2>
          <p className="mt-0.5 truncate text-[0.82rem] text-muted italic sm:text-[0.85rem]">
            {bird.scientificName || '\u00A0'}
          </p>
        </div>
      </Link>

      {favoriteControl && (
        <div className="absolute top-5 right-5 z-10">
          <FavoriteButton
            active={favoriteControl.active}
            birdName={displayName}
            onToggle={favoriteControl.onToggle}
          />
        </div>
      )}
    </article>
  );
}
