import { useState } from 'react';
import { TEXT } from '../../data/siteConfig';
import type { HabitatRegion } from '../../types/bird';
import { BirdImageFrame } from '../common/BirdImageFrame';

interface HabitatSectionProps {
  habitatPhoto: string | null;
  regions: HabitatRegion[];
  birdName: string;
}

/**
 * BIRD DETAIL - 서식지 섹션 (PDF p.4, p.5, p.9, p.18, p.19 기준)
 * - 2단계: 서식지 풍경 3:2 + 국가/지역명 나열 + 지역 선택 설명 카드
 * - 3단계 예정: 실제 정적 평면 세계지도 SVG + 국가 하이라이트 및 호버/터치 툴팁
 */
export function HabitatSection({ habitatPhoto, regions, birdName }: HabitatSectionProps) {
  const [selectedCode, setSelectedCode] = useState<string>(regions[0]?.code ?? '');
  const selectedRegion = regions.find((r) => r.code === selectedCode) ?? regions[0];

  return (
    <section aria-labelledby="habitat-section-title" className="mt-10">
      <h2
        id="habitat-section-title"
        className="font-serif text-[1.45rem] font-bold text-heading md:text-[1.6rem]"
      >
        서식지
      </h2>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* 대표 서식지 풍경 사진 */}
        <div>
          <div className="overflow-hidden rounded-[1.25rem] border border-line bg-surface shadow-soft">
            <BirdImageFrame src={habitatPhoto} alt={`${birdName} 주요 서식지 풍경`} />
          </div>
          {regions.length > 0 && (
            <p className="mt-2.5 text-[0.9rem] font-medium text-text">
              {regions.map((r) => r.name || r.code).join(' · ')}
            </p>
          )}
        </div>

        {/* 서식 지역 선택 & 지도(3단계에서 평면 세계지도 SVG 연결) */}
        <div className="flex flex-col gap-3">
          <div className="flex min-h-[180px] flex-col justify-between rounded-[1.25rem] border border-line bg-surface p-4 shadow-soft">
            {regions.length > 0 ? (
              <>
                <div className="flex flex-wrap gap-1.5">
                  {regions.map((r) => {
                    const active = r.code === selectedRegion?.code;
                    return (
                      <button
                        key={r.code}
                        type="button"
                        onClick={() => setSelectedCode(r.code)}
                        className={`rounded-full px-3 py-1 text-[0.8rem] font-medium transition-colors ${
                          active
                            ? 'bg-primary text-on-primary'
                            : 'bg-sage text-text hover:bg-sage-strong/40'
                        }`}
                      >
                        {r.name || r.code}
                      </button>
                    );
                  })}
                </div>
                <p className="mt-4 text-center text-[0.82rem] text-muted">
                  평면 세계지도는 3단계에서 연결됩니다.
                </p>
              </>
            ) : (
              <div className="grid flex-1 place-items-center text-center text-[0.88rem] text-muted">
                {TEXT.infoMissing}
              </div>
            )}
          </div>

          {selectedRegion && (
            <div className="rounded-[1.25rem] bg-sage px-4 py-3.5">
              <div className="text-[0.92rem] font-bold text-text">
                {selectedRegion.name || selectedRegion.code}
              </div>
              <p className="mt-0.5 text-[0.86rem] text-muted">
                {selectedRegion.description || TEXT.infoMissing}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
