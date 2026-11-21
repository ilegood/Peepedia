import { createBrowserRouter, ScrollRestoration } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { BirdsPage } from './pages/BirdsPage';
import { BirdDetailPage } from './pages/BirdDetailPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { NotFoundPage } from './pages/NotFoundPage';

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
      { path: '/birds/:id', element: <BirdDetailPage /> },
      { path: '/favorites', element: <FavoritesPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
