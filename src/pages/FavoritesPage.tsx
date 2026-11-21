import { Container, PageTitle } from '../components/common/Page';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

/**
 * FAVORITES
 * 2~3단계 예정: localStorage 즐겨찾기 목록, 빈 상태, 되돌리기
 */
export function FavoritesPage() {
  useDocumentTitle('FAVORITES');
  return (
    <Container>
      <div className="pt-10 pb-16 md:pt-14">
        <PageTitle>FAVORITES</PageTitle>
      </div>
    </Container>
  );
}
