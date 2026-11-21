import { EmptyState } from '../components/common/EmptyState';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export function NotFoundPage() {
  useDocumentTitle('페이지를 찾을 수 없어요');
  return (
    <div className="flex min-h-[60vh] items-center justify-center py-16">
      <EmptyState
        size="large"
        title="앗! 길을 잃었나 봐요."
        description="찾는 페이지가 없어요. 주소를 다시 확인하거나 홈으로 돌아가 주세요."
        action={{ label: '홈으로 가기', to: '/' }}
      />
    </div>
  );
}
