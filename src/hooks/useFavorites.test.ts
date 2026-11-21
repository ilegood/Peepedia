import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { __resetFavoritesCache, useFavorites } from './useFavorites';

describe('useFavorites', () => {
  beforeEach(() => {
    localStorage.clear();
    __resetFavoritesCache();
    vi.useRealTimers();
  });

  it('추가하면 최근 추가순으로 저장되고 localStorage 에 남는다', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useFavorites());
    vi.setSystemTime(1000);
    act(() => result.current.add('a'));
    vi.setSystemTime(2000);
    act(() => result.current.add('b'));
    expect(result.current.entries.map((e) => e.id)).toEqual(['b', 'a']);
    expect(JSON.parse(localStorage.getItem('peepedia-favorites')!)).toHaveLength(2);
    expect(result.current.isFavorite('a')).toBe(true);
  });

  it('해제 후 되돌리기하면 원래 위치로 돌아온다', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useFavorites());
    ['a', 'b', 'c'].forEach((id, i) => {
      vi.setSystemTime(1000 * (i + 1));
      act(() => result.current.add(id));
    });
    let removed: ReturnType<typeof result.current.remove>;
    act(() => {
      removed = result.current.remove('b');
    });
    expect(result.current.entries.map((e) => e.id)).toEqual(['c', 'a']);
    act(() => result.current.restore(removed!));
    expect(result.current.entries.map((e) => e.id)).toEqual(['c', 'b', 'a']);
  });

  it('toggle', () => {
    const { result } = renderHook(() => useFavorites());
    act(() => {
      result.current.toggle('x');
    });
    expect(result.current.isFavorite('x')).toBe(true);
    act(() => {
      result.current.toggle('x');
    });
    expect(result.current.isFavorite('x')).toBe(false);
  });

  it('저장값이 손상돼도 깨지지 않는다', () => {
    localStorage.setItem('peepedia-favorites', '{broken');
    const { result } = renderHook(() => useFavorites());
    expect(result.current.entries).toEqual([]);
  });
});
