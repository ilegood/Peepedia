import { describe, expect, it } from 'vitest';
import { normalizeBird } from '../data/birdsIndex';
import { pageItems, paginate, searchBirds, sortBirds, totalPagesOf } from './birdFilter';

const b = (id: string, nameKo: string, nameEn: string, scientificName: string) =>
  normalizeBird({ id, nameKo, nameEn, scientificName }, id);

const list = [
  b('pica-serica', '까치', 'Oriental Magpie', 'Pica serica'),
  b('parus-minor', '박새', 'Japanese Tit', 'Parus minor'),
  b('passer-montanus', '참새', 'Eurasian Tree Sparrow', 'Passer montanus'),
  b('alcedo-atthis', '물총새', 'Common Kingfisher', 'Alcedo atthis'),
  b('no-en', '가마우지', '', ''),
];

describe('searchBirds', () => {
  it('한국어 이름 / 영어 이름 / 학명으로 검색', () => {
    expect(searchBirds(list, '박새').map((x) => x.id)).toEqual(['parus-minor']);
    expect(searchBirds(list, 'kingfisher').map((x) => x.id)).toEqual(['alcedo-atthis']);
    expect(searchBirds(list, 'PASSER').map((x) => x.id)).toEqual(['passer-montanus']);
  });
  it('띄어쓰기 무시, 빈 검색어는 전체', () => {
    expect(searchBirds(list, 'tree sparrow').map((x) => x.id)).toEqual(['passer-montanus']);
    expect(searchBirds(list, 'treesparrow').map((x) => x.id)).toEqual(['passer-montanus']);
    expect(searchBirds(list, '   ')).toHaveLength(list.length);
  });
  it('결과 없음', () => {
    expect(searchBirds(list, '앵무')).toEqual([]);
  });
});

describe('sortBirds', () => {
  it('기본: 한국어 가나다순', () => {
    expect(sortBirds(list, 'ko').map((x) => x.nameKo)).toEqual(['가마우지', '까치', '물총새', '박새', '참새']);
  });
  it('영어 이름 알파벳순, 영어 이름 없는 새는 뒤로', () => {
    expect(sortBirds(list, 'en').map((x) => x.id)).toEqual([
      'alcedo-atthis',
      'passer-montanus',
      'parus-minor',
      'pica-serica',
      'no-en',
    ]);
  });
});

describe('pagination', () => {
  it('20개 단위로 자동 계산', () => {
    expect(totalPagesOf(0)).toBe(1);
    expect(totalPagesOf(20)).toBe(1);
    expect(totalPagesOf(21)).toBe(2);
    expect(totalPagesOf(45)).toBe(3);
    const nums = Array.from({ length: 45 }, (_, i) => i);
    expect(paginate(nums, 3)).toEqual([40, 41, 42, 43, 44]);
  });
  it('페이지 번호 표시', () => {
    expect(pageItems(1, 3)).toEqual([1, 2, 3]);
    expect(pageItems(1, 11)).toEqual([1, 2, 3, '…', 11]);
    expect(pageItems(6, 11)).toEqual([1, '…', 5, 6, 7, '…', 11]);
    expect(pageItems(11, 11)).toEqual([1, '…', 9, 10, 11]);
    expect(pageItems(4, 11)).toEqual([1, 2, 3, 4, 5, '…', 11]);
  });
});
