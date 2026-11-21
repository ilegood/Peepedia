import { useEffect, useState } from 'react';
import { ZoomIn } from 'lucide-react';
import { TEXT } from '../../data/siteConfig';
import { BirdMark } from './BirdMark';

interface BirdImageFrameProps {
  src?: string | null;
  alt: string;
  /** eager: 첫 화면 대표 이미지 / lazy: 목록 이미지 */
  loading?: 'eager' | 'lazy';
  /** 마우스를 올렸을 때 확대 + 돋보기 아이콘 표시 여부 */
  hoverZoom?: boolean;
  className?: string;
}

/**
 * 사이트 전체 공용 3:2 사진 프레임
 * - 3:2 공간을 먼저 확보해 로딩 중 레이아웃 이동을 막는다.
 * - object-contain 으로 원본 비율을 유지하고 절대 자르거나 찌그러뜨리지 않는다.
 * - 사진이 없거나 불러오기에 실패하면 통일된 대체 이미지를 보여준다.
 */
export function BirdImageFrame({
  src,
  alt,
  loading = 'lazy',
  hoverZoom = false,
  className = '',
}: BirdImageFrameProps) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>(src ? 'loading' : 'error');

  useEffect(() => {
    setStatus(src ? 'loading' : 'error');
  }, [src]);

  const hasPhoto = Boolean(src) && status !== 'error';

  return (
    <div
      className={`group relative aspect-[3/2] w-full overflow-hidden bg-sage select-none ${className}`}
    >
      {/* 로딩 중 스피너 (3:2 공간 확보) */}
      {hasPhoto && status === 'loading' && (
        <div className="absolute inset-0 grid place-items-center" aria-hidden="true">
          <div className="h-7 w-7 animate-spin rounded-full border-[3px] border-sage-strong/40 border-t-primary" />
        </div>
      )}

      {/* 실제 사진 (원본 비율 유지) */}
      {hasPhoto && src && (
        <img
          src={src}
          alt={alt}
          loading={loading}
          decoding="async"
          draggable={false}
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          className={`h-full w-full object-contain transition-all duration-300 ${
            status === 'loaded' ? 'opacity-100' : 'opacity-0'
          } ${hoverZoom ? 'group-hover:scale-[1.03]' : ''}`}
        />
      )}

      {/* 호버 시 돋보기 아이콘 (PC) */}
      {hasPhoto && hoverZoom && status === 'loaded' && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-3 right-3 hidden h-8 w-8 items-center justify-center rounded-full bg-black/45 text-white opacity-0 backdrop-blur-xs transition-opacity duration-200 group-hover:opacity-100 md:flex"
        >
          <ZoomIn size={15} />
        </span>
      )}

      {/* 사진 없음 / 오류 대체 상태 (PDF p.22 기준) */}
      {!hasPhoto && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 px-4 text-center">
          <BirdMark size={48} />
          <span className="text-[0.82rem] text-muted">{TEXT.photoMissing}</span>
        </div>
      )}
    </div>
  );
}
