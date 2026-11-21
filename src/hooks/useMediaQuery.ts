import { useEffect, useState } from 'react';

/** CSS 미디어 쿼리 일치 여부 (예: '(min-width: 768px)') */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(query).matches : false,
  );
  useEffect(() => {
    const mq = window.matchMedia?.(query);
    if (!mq) return;
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}

/** PC 레이아웃 기준 (헤더 메뉴가 펼쳐지는 폭과 동일) */
export const useIsDesktop = () => useMediaQuery('(min-width: 768px)');
export const usePrefersReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)');
