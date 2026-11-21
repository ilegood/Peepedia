import { useParams } from 'react-router-dom';
import { Container } from '../components/common/Page';
import { getBirdById } from '../data/birdsIndex';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { NotFoundPage } from './NotFoundPage';

/**
 * BIRD DETAIL
 * 1단계: 데이터 연결 + 이름 영역
 * 2~3단계 예정: 사진 갤러리, 라이트박스, 즐겨찾기, 울음소리, 정보 카드, 서식지 지도, 이전/다음 새, 출처
 */
export function BirdDetailPage() {
  const { id } = useParams();
  const bird = getBirdById(id);
  useDocumentTitle(bird?.nameKo || undefined);

  if (!bird) return <NotFoundPage />;

  return (
    <Container narrow>
      <div className="pt-8 pb-16 md:pt-10">
        <h1 className="font-serif text-[2.1rem] leading-tight font-bold text-heading md:text-[2.3rem]">
          {bird.nameKo}
        </h1>
        {bird.nameEn && <p className="mt-1 text-text">{bird.nameEn}</p>}
        {bird.scientificName && <p className="text-muted italic">{bird.scientificName}</p>}
      </div>
    </Container>
  );
}
