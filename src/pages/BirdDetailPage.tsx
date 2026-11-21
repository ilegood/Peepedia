import { useParams } from 'react-router-dom';
import { FavoriteButton } from '../components/common/FavoriteButton';
import { Container } from '../components/common/Page';
import { BirdAudioPlayer } from '../components/detail/BirdAudioPlayer';
import { HabitatSection } from '../components/detail/HabitatSection';
import { InfoCardGrid } from '../components/detail/InfoCardGrid';
import { PhotoGallery } from '../components/detail/PhotoGallery';
import { PrevNextNav } from '../components/detail/PrevNextNav';
import { SourcesAccordion } from '../components/detail/SourcesAccordion';
import { getBirdById } from '../data/birdsIndex';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useFavorites } from '../hooks/useFavorites';
import { NotFoundPage } from './NotFoundPage';

/**
 * BIRD DETAIL (PDF p.4, p.5, p.9, p.18, p.19 기준)
 * - 사진 갤러리 (1~5장, 3:2)
 * - 새 이름 (한국어 → 영어 → 학명 이탤릭) + 즐겨찾기 하트
 * - 울음소리 플레이어
 * - 기본 정보 카드 (특징 → 먹이 → 서식지 → 분류)
 * - 서식지 (풍경 사진 + 국가명 + 지도 영역)
 * - 이전 새 / 다음 새
 * - 접이식 출처
 */
export function BirdDetailPage() {
  const { id } = useParams();
  const bird = getBirdById(id);
  const { isFavorite, toggle } = useFavorites();

  useDocumentTitle(bird?.nameKo || undefined);

  if (!bird) return <NotFoundPage />;

  const displayName = bird.nameKo || bird.nameEn || bird.id;
  const favorited = isFavorite(bird.id);

  return (
    <Container narrow>
      <div className="pt-8 pb-20 md:pt-10">
        {/* 사진 갤러리 */}
        <PhotoGallery key={bird.id} photos={bird.media.photos} birdName={displayName} />

        {/* 새 이름 + 즐겨찾기 하트 */}
        <div className="mt-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="font-serif text-[2.1rem] leading-tight font-bold text-heading md:text-[2.4rem]">
              {bird.nameKo || '이름 준비 중'}
            </h1>
            {bird.nameEn && <p className="mt-1 text-[1rem] text-text">{bird.nameEn}</p>}
            {bird.scientificName && (
              <p className="text-[0.95rem] text-muted italic">{bird.scientificName}</p>
            )}
          </div>

          <FavoriteButton
            size="md"
            active={favorited}
            birdName={displayName}
            onToggle={() => toggle(bird.id)}
            className="mt-1"
          />
        </div>

        {/* 새 울음소리 */}
        <BirdAudioPlayer src={bird.media.audio} birdName={displayName} />

        {/* 기본 정보 카드 */}
        <InfoCardGrid info={bird.info} />

        {/* 서식지 */}
        <HabitatSection
          key={bird.id}
          habitatPhoto={bird.media.habitatPhoto}
          regions={bird.habitatRegions}
          birdName={displayName}
        />

        {/* 이전 새 / 다음 새 */}
        <PrevNextNav currentBirdId={bird.id} />

        {/* 출처 */}
        <SourcesAccordion key={`src-${bird.id}`} sources={bird.sources} />
      </div>
    </Container>
  );
}
