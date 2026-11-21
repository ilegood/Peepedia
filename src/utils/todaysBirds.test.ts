import { describe, expect, it } from 'vitest';
import { kstDateKey, pickTodaysBirds } from './todaysBirds';
import { normalizeBird } from '../data/birdsIndex';

const make = (n: number) => Array.from({ length: n }, (_, i) => normalizeBird({ id: `b-${i}`, nameKo: `새${i}` }, `b-${i}`));

describe('kstDateKey', () => {
  it('한국 시간 기준으로 날짜가 바뀐다', () => {
    // UTC 14:59 = KST 23:59 (같은 날), UTC 15:00 = KST 다음 날 00:00
    expect(kstDateKey(new Date('2026-11-21T14:59:00Z'))).toBe('2026-11-21');
    expect(kstDateKey(new Date('2026-11-21T15:00:00Z'))).toBe('2026-11-22');
  });
});

describe('pickTodaysBirds', () => {
  const birds = make(40);

  it('같은 날짜에는 시간이 달라도 같은 5종, 같은 순서', () => {
    const morning = pickTodaysBirds(birds, 5, new Date('2026-11-21T00:10:00+09:00')).map((b) => b.id);
    const night = pickTodaysBirds(birds, 5, new Date('2026-11-21T23:50:00+09:00')).map((b) => b.id);
    expect(morning).toHaveLength(5);
    expect(new Set(morning).size).toBe(5);
    expect(night).toEqual(morning);
  });

  it('파일 로딩 순서가 달라도 결과가 같다', () => {
    const d = new Date('2026-11-21T12:00:00+09:00');
    const a = pickTodaysBirds(birds, 5, d).map((b) => b.id);
    const b = pickTodaysBirds([...birds].reverse(), 5, d).map((x) => x.id);
    expect(b).toEqual(a);
  });

  it('날짜가 바뀌면 선정이 바뀐다 (여러 날 중 대부분)', () => {
    const days = ['2026-11-21', '2026-11-22', '2026-11-23', '2026-11-24', '2026-11-25'];
    const picks = days.map((d) => pickTodaysBirds(birds, 5, new Date(`${d}T12:00:00+09:00`)).map((b) => b.id).join());
    expect(new Set(picks).size).toBeGreaterThanOrEqual(4);
  });

  it('새가 5종보다 적으면 있는 만큼만', () => {
    expect(pickTodaysBirds(make(3))).toHaveLength(3);
    expect(pickTodaysBirds([])).toEqual([]);
  });
});
