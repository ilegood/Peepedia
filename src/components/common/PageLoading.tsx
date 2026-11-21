import { TEXT } from '../../data/siteConfig';

/**
 * 페이지 로딩 중 상태 카드 (PDF p.22 기준)
 */
export function PageLoading() {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-[1200px] items-center justify-center px-5 py-16">
      <div className="flex w-full max-w-sm flex-col items-center justify-center gap-3.5 rounded-[1.25rem] border border-line bg-surface px-8 py-14 shadow-soft">
        <div
          aria-hidden="true"
          className="h-8 w-8 animate-spin rounded-full border-[3px] border-sage-strong/40 border-t-primary"
        />
        <p className="text-[0.92rem] text-muted">{TEXT.loading}</p>
      </div>
    </div>
  );
}
