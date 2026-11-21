import type { Bird } from '../types/bird';

/** 한국 시간(Asia/Seoul) 기준 날짜 문자열 YYYY-MM-DD */
export function kstDateKey(now: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}

/** 문자열 → 32비트 시드 (FNV-1a) */
function hashString(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** 시드 기반 의사난수 생성기 (mulberry32): 같은 시드 → 항상 같은 수열 */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * 오늘의 새 선정
 * - 한국 시간 날짜를 시드로 사용 → 같은 날에는 모든 방문자에게 같은 새, 같은 순서
 * - 서버 없이 브라우저에서 계산
 * - 파일 로딩 순서에 영향받지 않도록 ID 순으로 정렬한 뒤 섞는다
 */
export function pickTodaysBirds(all: Bird[], count = 5, now: Date = new Date()): Bird[] {
  const pool = [...all].sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  const rand = mulberry32(hashString(`peepedia:${kstDateKey(now)}`));
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, Math.min(count, pool.length));
}
