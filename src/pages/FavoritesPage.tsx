import { useEffect, useMemo, useState } from 'react';
import { BirdCard } from '../components/common/BirdCard';
import { EmptyState } from '../components/common/EmptyState';
import { Container, PageTitle } from '../components/common/Page';
import { getBirdById } from '../data/birdsIndex';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useFavorites, type FavoriteEntry } from '../hooks/useFavorites';
import type { Bird } from '../types/bird';

interface UndoState {
  birdName: string;
  entry: FavoriteEntry;
}

/**
 * FAVORITES (PDF p.6, p.10, p.13 기준)
 * - 브라우저 localStorage 저장 (최근 추가한 새부터 표시)
 * - 첫 번째 카드 '가장 최근' 배지 + 하트 해제 시 '되돌리기' 토스트
 * - 빈 상태: "아직 찜한 새가 없어요!" + "새 구경하러 가기"
 */
export function FavoritesPage() {
  useDocumentTitle('FAVORITES');
  const { entries, remove, restore } = useFavorites();
  const [undo, setUndo] = useState<UndoState | null>(null);

  const favoriteBirds = useMemo(
    () =>
      entries
        .map((e) => getBirdById(e.id))
        .filter((b): b is Bird => b !== undefined),
    [entries],
  );

  // 되돌리기 토스트 자동 닫기 (5초)
  useEffect(() => {
    if (!undo) return;
    const id = window.setTimeout(() => setUndo(null), 5000);
    return () => window.clearTimeout(id);
  }, [undo]);

  const handleRemove = (bird: Bird) => {
    const removed = remove(bird.id);
    if (removed) {
      setUndo({
        birdName: bird.nameKo || bird.nameEn || bird.id,
        entry: removed,
      });
    }
  };

  const handleUndo = () => {
    if (!undo) return;
    restore(undo.entry);
    setUndo(null);
  };

  return (
    <Container>
      <div className="pt-10 pb-20 md:pt-14">
        <PageTitle>FAVORITES</PageTitle>

        {favoriteBirds.length === 0 ? (
          <div className="py-20">
            <EmptyState
              title="아직 찜한 새가 없어요!"
              description="마음에 드는 새의 하트를 눌러 보세요."
              action={{ label: '새 구경하러 가기', to: '/birds' }}
            />
          </div>
        ) : (
          <>
            <p className="mt-2.5 text-[0.9rem] text-muted">
              찜한 새는 이 브라우저에만 저장돼요. 브라우저 데이터를 지우면 사라질 수 있어요.
            </p>
            <div className="mt-3">
              <span className="inline-block rounded-full bg-sage px-3.5 py-1 text-[0.82rem] font-medium text-heading">
                최근에 추가한 새부터 보여요
              </span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-5">
              {favoriteBirds.map((bird, idx) => (
                <BirdCard
                  key={bird.id}
                  bird={bird}
                  badge={idx === 0 ? '가장 최근' : undefined}
                  favoriteControl={{
                    active: true,
                    onToggle: () => handleRemove(bird),
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* 찜 해제 되돌리기 토스트 (PDF p.6, p.10 기준) */}
      {undo && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 rounded-full bg-[#242824] py-2 pr-2 pl-5 text-[0.88rem] text-white shadow-card dark:border dark:border-line"
        >
          <span className="whitespace-nowrap">{undo.birdName}를 찜 목록에서 뺐어요</span>
          <button
            type="button"
            onClick={handleUndo}
            className="rounded-full bg-[#434a43] px-3.5 py-1.5 text-[0.82rem] font-semibold text-white transition-colors hover:bg-[#555e55]"
          >
            되돌리기
          </button>
        </div>
      )}
    </Container>
  );
}
