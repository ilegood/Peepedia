import { Link } from 'react-router-dom';
import { BirdMark } from './BirdMark';

interface LogoProps {
  /** 헤더(기본) / 푸터 크기 */
  size?: 'header' | 'footer';
  /** 링크로 감쌀지 여부 */
  asLink?: boolean;
}

export function Logo({ size = 'header', asLink = true }: LogoProps) {
  const mark = size === 'header' ? 30 : 28;
  const content = (
    <span className="inline-flex items-center gap-2.5">
      <BirdMark size={mark} />
      <span
        className={`font-serif font-semibold tracking-tight text-heading ${
          size === 'header' ? 'text-[1.35rem] sm:text-[1.4rem]' : 'text-[1.2rem]'
        }`}
      >
        Peepedia
      </span>
    </span>
  );
  if (!asLink) return content;
  return (
    <Link to="/" aria-label="Peepedia 홈으로" className="inline-flex rounded-full">
      {content}
    </Link>
  );
}
