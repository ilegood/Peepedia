import config from '../../site.config.json';

export const siteConfig = config;

/** 화면 공통 문구 (기획서·PDF 기준) */
export const TEXT = {
  footerIntro: '작은 새들을 모아 둔 나만의 온라인 새 도감, 짹과사전이에요.',
  copyright: 'Copyright © Peepedia',
  infoMissing: '정보를 준비하고 있어요.',
  audioMissing: '아직 등록된 울음소리가 없어요.',
  photoMissing: '사진을 준비하고 있어요',
  loading: '불러오는 중이에요',
} as const;

/** 브라우저 저장소 키 */
export const STORAGE_KEYS = {
  theme: 'peepedia-theme',
  favorites: 'peepedia-favorites',
} as const;
