import { useEffect, useMemo, useRef, useState } from 'react';
import worldMap from '../../data/worldMapPaths.json';
import type { HabitatRegion } from '../../types/bird';

interface WorldHabitatMapProps {
  regions: HabitatRegion[];
  selectedCode: string;
  onSelectRegion: (code: string) => void;
}

interface CountryPath {
  id: string;
  iso: string;
  d: string;
}

const mapData = worldMap as { viewBox: string; countries: CountryPath[] };

/**
 * 평면 SVG 세계지도 (PDF p.4, p.9, p.18 & 기획서 §6-6 기준)
 * - 외부 지도 API 없이 정적 벡터 데이터로 렌더링
 * - 주요 서식 국가는 초록색으로 강조
 * - PC: 마우스를 올리면 지도 위 지역명 뱃지 표시, 클릭 시 설명 표시
 * - 모바일: 터치 시 지역 설명 표시
 */
export function WorldHabitatMap({
  regions,
  selectedCode,
  onSelectRegion,
}: WorldHabitatMapProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [hoveredCode, setHoveredCode] = useState<string | null>(null);
  const [badgePos, setBadgePos] = useState<{ xPct: number; yPct: number } | null>(null);

  const regionMap = useMemo(
    () => new Map(regions.map((r) => [r.code.toUpperCase(), r])),
    [regions],
  );

  const activeBadgeCode = hoveredCode || selectedCode;
  const activeBadgeRegion = activeBadgeCode ? regionMap.get(activeBadgeCode) : undefined;

  // 강조된 국가(호버 또는 선택)의 SVG 바운딩 박스 위치를 계산해 지도 위 말풍선 배지를 배치한다.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || !activeBadgeCode) {
      setBadgePos(null);
      return;
    }
    const target = svg.querySelector<SVGPathElement>(`path[data-iso="${activeBadgeCode}"]`);
    if (!target || typeof target.getBBox !== 'function') {
      setBadgePos(null);
      return;
    }
    try {
      const box = target.getBBox();
      const [, , vbW, vbH] = mapData.viewBox.split(' ').map(Number);
      if (!vbW || !vbH) return;
      const xPct = Math.min(88, Math.max(12, ((box.x + box.width / 2) / vbW) * 100));
      const yPct = Math.min(82, Math.max(14, (box.y / vbH) * 100));
      setBadgePos({ xPct, yPct });
    } catch {
      setBadgePos(null);
    }
  }, [activeBadgeCode]);

  return (
    <div className="relative overflow-hidden rounded-[1.25rem] border border-line bg-surface p-2.5 shadow-soft">
      <svg
        ref={svgRef}
        viewBox={mapData.viewBox}
        role="img"
        aria-label="주요 서식 지역 세계지도"
        className="block h-auto w-full select-none"
      >
        {mapData.countries.map((country, idx) => {
          const region = country.iso ? regionMap.get(country.iso) : undefined;
          const isHabitat = Boolean(region);
          const isSelected = isHabitat && country.iso === selectedCode;
          const isHovered = isHabitat && country.iso === hoveredCode;
          const rowKey = `${country.id}-${idx}`;

          if (!isHabitat) {
            return (
              <path
                key={rowKey}
                d={country.d}
                className="fill-[#e6dfce] stroke-surface stroke-[0.5] dark:fill-[#383a3e]"
              />
            );
          }

          return (
            <path
              key={rowKey}
              d={country.d}
              data-iso={country.iso}
              tabIndex={0}
              role="button"
              aria-label={`${region!.name || country.iso} 서식 정보 보기`}
              aria-pressed={isSelected}
              onMouseEnter={() => setHoveredCode(country.iso)}
              onMouseLeave={() => setHoveredCode((c) => (c === country.iso ? null : c))}
              onFocus={() => setHoveredCode(country.iso)}
              onBlur={() => setHoveredCode((c) => (c === country.iso ? null : c))}
              onClick={() => onSelectRegion(country.iso)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectRegion(country.iso);
                }
              }}
              className={`cursor-pointer stroke-surface stroke-[0.7] transition-colors outline-none ${
                isSelected || isHovered
                  ? 'fill-[#2f5d3a] dark:fill-[#a8cf9e]'
                  : 'fill-[#68996e] hover:fill-[#2f5d3a] dark:fill-[#6f9c73] dark:hover:fill-[#a8cf9e]'
              }`}
            />
          );
        })}
      </svg>

      {/* 지도 위 지역명 배지 (PDF p.4, p.9, p.18 기준) */}
      {activeBadgeRegion && badgePos && (
        <div
          aria-hidden="true"
          style={{ left: `${badgePos.xPct}%`, top: `${badgePos.yPct}%` }}
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-full bg-primary px-3 py-0.5 text-[0.76rem] font-semibold whitespace-nowrap text-on-primary shadow-soft transition-all duration-150"
        >
          {activeBadgeRegion.name || activeBadgeRegion.code}
        </div>
      )}
    </div>
  );
}
