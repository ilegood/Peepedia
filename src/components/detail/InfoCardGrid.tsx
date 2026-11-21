import { LayoutGrid, Leaf, MapPin, Star } from 'lucide-react';
import { TEXT } from '../../data/siteConfig';
import type { Bird } from '../../types/bird';

interface InfoCardGridProps {
  info: Bird['info'];
}

const ITEMS = [
  { key: 'features', label: '특징', Icon: Star },
  { key: 'diet', label: '먹이', Icon: Leaf },
  { key: 'habitat', label: '서식지', Icon: MapPin },
  { key: 'taxonomy', label: '분류', Icon: LayoutGrid },
] as const;

/**
 * BIRD DETAIL - 기본 정보 카드 4종 (PDF p.4, p.9, p.18 기준)
 * - 표시 순서: 특징 → 먹이 → 서식지 → 분류
 * - 모두 기본 펼침 상태, 정보가 없으면 "정보를 준비하고 있어요."
 */
export function InfoCardGrid({ info }: InfoCardGridProps) {
  return (
    <section aria-label="기본 정보" className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
      {ITEMS.map(({ key, label, Icon }) => {
        const value = info[key];
        return (
          <div
            key={key}
            className="rounded-[1.25rem] border border-line bg-surface p-5 shadow-soft"
          >
            <div className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-sage text-primary">
                <Icon size={16} aria-hidden />
              </span>
              <h2 className="text-[1rem] font-bold text-text">{label}</h2>
            </div>
            <p className="mt-3 text-[0.93rem] leading-relaxed whitespace-pre-line text-muted">
              {value || TEXT.infoMissing}
            </p>
          </div>
        );
      })}
    </section>
  );
}
