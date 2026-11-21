import { useEffect } from 'react';
import { siteConfig } from '../data/siteConfig';

/** 브라우저 탭 제목 설정 */
export function useDocumentTitle(title?: string) {
  useEffect(() => {
    const base = `${siteConfig.siteName} · ${siteConfig.siteNameKo}`;
    document.title = title ? `${title} | ${base}` : base;
  }, [title]);
}
