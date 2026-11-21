/// <reference types="vitest/config" />
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import siteConfig from './site.config.json' with { type: 'json' };

/**
 * 검색 엔진 색인 정책 플러그인
 * - site.config.json 의 allowIndexing 값 하나로 제어한다.
 * - false(기본값): <meta name="robots" content="noindex, nofollow"> + robots.txt 전체 차단
 * - true: 색인 허용 + robots.txt 허용 (siteUrl 이 있으면 sitemap 경로도 기록)
 */
function indexingPolicy(): Plugin {
  const allow = siteConfig.allowIndexing === true;
  return {
    name: 'peepedia-indexing-policy',
    transformIndexHtml(html) {
      return html.replace(
        '<!--ROBOTS_META-->',
        `<meta name="robots" content="${allow ? 'index, follow' : 'noindex, nofollow'}" />`,
      );
    },
    generateBundle() {
      const lines = allow ? ['User-agent: *', 'Allow: /'] : ['User-agent: *', 'Disallow: /'];
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: lines.join('\n') + '\n' });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), indexingPolicy()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
});
