import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

// 폰트는 프로젝트에 포함(외부 폰트 서비스 미사용). 사용하는 글자 범위만 나눠서 불러온다.
import '@fontsource-variable/noto-sans-kr';
import '@fontsource-variable/noto-serif-kr';
import './styles/global.css';

import { ThemeProvider } from './hooks/useTheme';
import { router } from './router';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
);
