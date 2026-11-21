import { useEffect } from 'react';

let lockCount = 0;
let savedScrollY = 0;

/**
 * 모달·메뉴가 열려 있는 동안 배경 스크롤을 잠그고,
 * 닫히면 원래 스크롤 위치를 복원한다. (iOS Safari 대응: position fixed 방식)
 */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const body = document.body;
    if (lockCount === 0) {
      savedScrollY = window.scrollY;
      const scrollbar = window.innerWidth - document.documentElement.clientWidth;
      body.style.position = 'fixed';
      body.style.top = `-${savedScrollY}px`;
      body.style.left = '0';
      body.style.right = '0';
      body.style.width = '100%';
      if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
    }
    lockCount += 1;
    return () => {
      lockCount -= 1;
      if (lockCount === 0) {
        body.style.position = '';
        body.style.top = '';
        body.style.left = '';
        body.style.right = '';
        body.style.width = '';
        body.style.paddingRight = '';
        window.scrollTo(0, savedScrollY);
      }
    };
  }, [active]);
}
