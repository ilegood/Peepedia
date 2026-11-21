import { lazy, Suspense } from 'react';
import { createBrowserRouter, ScrollRestoration } from 'react-router-dom';
import { PageLoading } from './components/common/PageLoading';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { BirdsPage } from './pages/BirdsPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { NotFoundPage } from './pages/NotFoundPage';

// 상세 페이지(세계지도 벡터 데이터 포함)는 진입 시점에만 지연 로드해 초기 번들을 가볍게 유지한다.
const BirdDetailPage = lazy(() =>
  import('./pages/BirdDetailPage').then((m) => ({ default: m.BirdDetailPage })),
);

function Root() {
  return (
    <>
      <Layout />
      {/* 새 페이지로 이동하면 맨 위로, 뒤로 가기 시에는 이전 스크롤 위치 복원 */}
      <ScrollRestoration />
    </>
  );
}

export const router = createBrowserRouter([
  {
    element: <Root />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/birds', element: <BirdsPage /> },
      {
        path: '/birds/:id',
        element: (
          <Suspense fallback={<PageLoading />}>
            <BirdDetailPage />
          </Suspense>
        ),
      },
      { path: '/favorites', element: <FavoritesPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
