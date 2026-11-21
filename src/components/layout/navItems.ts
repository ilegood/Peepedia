/** 공통 네비게이션 항목 (헤더·모바일 메뉴 공용) */
export const NAV_ITEMS = [
  { to: '/', label: 'HOME', end: true },
  { to: '/birds', label: 'BIRDS', end: false },
  { to: '/favorites', label: 'FAVORITES', end: false },
] as const;
