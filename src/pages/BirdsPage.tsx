import { Container, PageTitle } from '../components/common/Page';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

/**
 * BIRDS
 * 2~3단계 예정: 검색·정렬, 새 카드 그리드, 페이지네이션, 상태 복원
 */
export function BirdsPage() {
  useDocumentTitle('BIRDS');
  return (
    <Container>
      <div className="pt-10 pb-16 md:pt-14">
        <PageTitle>BIRDS</PageTitle>
      </div>
    </Container>
  );
}
