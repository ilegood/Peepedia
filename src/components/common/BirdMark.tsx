interface BirdMarkProps {
  /** 원 지름(px) */
  size?: number;
  className?: string;
  /** 장식용이면 true (스크린리더에서 숨김) */
  decorative?: boolean;
}

/**
 * Peepedia 새 심볼: 세이지 원 + 포레스트 그린 새 + 흰 눈.
 * 로고, 404, 빈 상태, 대체 이미지에서 공통으로 사용한다.
 */
export function BirdMark({ size = 32, className = '', decorative = true }: BirdMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      role={decorative ? undefined : 'img'}
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : 'Peepedia 새 일러스트'}
    >
      <circle cx="32" cy="32" r="32" className="fill-sage-strong" />
      <path d="M41 25.5 54 29.5 41 31.5Z" className="fill-[#2f5d3a] dark:fill-[#1e2a20]" />
      <ellipse
        cx="32"
        cy="34"
        rx="13"
        ry="10.5"
        transform="rotate(-18 32 34)"
        className="fill-[#2f5d3a] dark:fill-[#1e2a20]"
      />
      <circle cx="37.5" cy="28" r="2.4" className="fill-[#fffdf6] dark:fill-[#a8cf9e]" />
    </svg>
  );
}
