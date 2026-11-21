import { useCallback, useSyncExternalStore } from 'react';
import { STORAGE_KEYS } from '../data/siteConfig';

/**
 * 즐겨찾기 저장소
 * - 로그인 없이 브라우저 localStorage 에만 저장 (기기 간 동기화 없음)
 * - 저장 형식: [{ id, addedAt }] — 최근 추가한 새가 앞
 * - 같은 브라우저의 다른 탭과는 storage 이벤트로 동기화
 */
export interface FavoriteEntry {
  id: string;
  addedAt: number;
}

const EMPTY: FavoriteEntry[] = [];
const listeners = new Set<() => void>();
let cache: FavoriteEntry[] | null = null;

const byRecent = (a: FavoriteEntry, b: FavoriteEntry) => b.addedAt - a.addedAt;

function read(): FavoriteEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.favorites);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    const seen = new Set<string>();
    return parsed
      .filter((e): e is FavoriteEntry => !!e && typeof e === 'object' && typeof (e as FavoriteEntry).id === 'string')
      .map((e) => ({ id: e.id, addedAt: Number(e.addedAt) || 0 }))
      .filter((e) => (seen.has(e.id) ? false : (seen.add(e.id), true)))
      .sort(byRecent);
  } catch {
    return [];
  }
}

function getSnapshot(): FavoriteEntry[] {
  if (cache === null) cache = read();
  return cache;
}

function write(next: FavoriteEntry[]) {
  cache = [...next].sort(byRecent);
  try {
    localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(cache));
  } catch {
    /* 저장 불가(사생활 보호 모드 등): 이번 방문 동안만 유지 */
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEYS.favorites || e.key === null) {
      cache = read();
      listener();
    }
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
}

/** 테스트용: 메모리 캐시 초기화 */
export function __resetFavoritesCache() {
  cache = null;
}

export function useFavorites() {
  const entries = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);

  const isFavorite = useCallback((id: string) => entries.some((e) => e.id === id), [entries]);

  const add = useCallback((id: string) => {
    write([{ id, addedAt: Date.now() }, ...getSnapshot().filter((e) => e.id !== id)]);
  }, []);

  /** 해제하고, 되돌리기에 쓸 수 있도록 원래 항목을 돌려준다 */
  const remove = useCallback((id: string): FavoriteEntry | undefined => {
    const current = getSnapshot();
    const entry = current.find((e) => e.id === id);
    if (entry) write(current.filter((e) => e.id !== id));
    return entry;
  }, []);

  /** 되돌리기: 원래 추가 시각 그대로 복원 → 원래 순서 위치로 돌아간다 */
  const restore = useCallback((entry: FavoriteEntry) => {
    write([...getSnapshot().filter((e) => e.id !== entry.id), entry]);
  }, []);

  const toggle = useCallback(
    (id: string) => (getSnapshot().some((e) => e.id === id) ? (remove(id), false) : (add(id), true)),
    [add, remove],
  );

  return { entries, isFavorite, add, remove, restore, toggle };
}
