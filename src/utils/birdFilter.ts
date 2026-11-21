import type { Bird } from '../types/bird';

export type SortKey = 'ko' | 'en';

export const PAGE_SIZE = 20;

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'ko', label: '가나다순' },
  { value: 'en', label: '알파벳순' },
];

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, '');

/** 한국어 이름 · 영어 이름 · 학명 검색 (대소문자·띄어쓰기 무시) */
export function searchBirds(list: Bird[], query: string): Bird[] {
  const q = norm(query);
  if (!q) return list;
  return list.filter((b) => [b.nameKo, b.nameEn, b.scientificName].some((v) => v && norm(v).includes(q)));
}

const koCollator = new Intl.Collator('ko');
const enCollator = new Intl.Collator('en', { sensitivity: 'base' });

/** 정렬: 한국어 이름 가나다순(기본) / 영어 이름 알파벳순. 이름이 비어 있으면 뒤로. */
export function sortBirds(list: Bird[], sort: SortKey): Bird[] {
  const key = sort === 'en' ? 'nameEn' : 'nameKo';
  const collator = sort === 'en' ? enCollator : koCollator;
  return [...list].sort((a, b) => {
    const av = a[key];
    const bv = b[key];
    if (!av && bv) return 1;
    if (av && !bv) return -1;
    return collator.compare(av, bv) || koCollator.compare(a.nameKo, b.nameKo) || (a.id < b.id ? -1 : 1);
  });
}

export function totalPagesOf(count: number, size = PAGE_SIZE): number {
  return Math.max(1, Math.ceil(count / size));
}

export function paginate<T>(list: T[], page: number, size = PAGE_SIZE): T[] {
  return list.slice((page - 1) * size, page * size);
}

/** 페이지 번호 목록: 1 2 3 … 11 형태 ('…' 은 생략 구간) */
export function pageItems(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const set = new Set([1, total, current - 1, current, current + 1]);
  if (current <= 3) [2, 3, 4].forEach((n) => n <= current + 2 && set.add(n));
  if (current >= total - 2) [total - 1, total - 2, total - 3].forEach((n) => n >= current - 2 && set.add(n));
  const nums = [...set].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  const out: (number | '…')[] = [];
  nums.forEach((n, i) => {
    const prev = nums[i - 1];
    if (prev !== undefined) {
      if (n - prev === 2) out.push(prev + 1);
      else if (n - prev > 2) out.push('…');
    }
    out.push(n);
  });
  return out;
}
