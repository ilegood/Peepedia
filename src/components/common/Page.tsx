import type { ReactNode } from 'react';

/** 페이지 공통 본문 폭·여백 */
export function Container({ children, narrow = false }: { children: ReactNode; narrow?: boolean }) {
  return (
    <div className={`mx-auto w-full px-5 md:px-9 ${narrow ? 'max-w-[720px] md:px-0' : 'max-w-[1200px]'}`}>
      {children}
    </div>
  );
}

/** BIRDS / FAVORITES 등 큰 세리프 페이지 제목 */
export function PageTitle({ children }: { children: ReactNode }) {
  return (
    <h1 className="font-serif text-[2.1rem] leading-tight font-bold tracking-tight text-heading md:text-[2.6rem]">
      {children}
    </h1>
  );
}
