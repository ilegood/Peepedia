import { describe, expect, it } from 'vitest';
import { birds, getBirdById, normalizeBird } from './birdsIndex';

describe('birdsIndex', () => {
  it('JSON 파일을 자동으로 불러온다', () => {
    expect(birds.length).toBeGreaterThan(20);
    expect(getBirdById('parus-minor')?.nameKo).toBe('박새');
    expect(getBirdById('없는-새')).toBeUndefined();
  });

  it('값이 빠지거나 형식이 틀려도 안전한 기본값으로 정규화한다', () => {
    const b = normalizeBird({ nameKo: '  테스트 ', media: { photos: ['a', '', 3, 'b', 'c', 'd', 'e', 'f'] } }, 'fallback');
    expect(b.id).toBe('fallback');
    expect(b.nameKo).toBe('테스트');
    expect(b.nameEn).toBe('');
    expect(b.info.diet).toBe('');
    expect(b.media.photos).toEqual(['a', 'b', 'c', 'd', 'e']);
    expect(b.media.audio).toBeNull();
    expect(b.habitatRegions).toEqual([]);
    expect(b.sources.audio).toEqual([]);
  });

  it('null 이나 배열 같은 잘못된 입력에도 깨지지 않는다', () => {
    expect(() => normalizeBird(null, 'x')).not.toThrow();
    expect(() => normalizeBird([1, 2], 'y')).not.toThrow();
  });
});
