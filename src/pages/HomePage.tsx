import { Container } from '../components/common/Page';
import { siteConfig } from '../data/siteConfig';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

/**
 * HOME
 * 1단계: 상단 인사말
 * 2단계 예정: Today's Birds 캐러셀, About Peepedia
 */
export function HomePage() {
  useDocumentTitle();
  return (
    <Container>
      <section className="pt-14 pb-10 text-center md:pt-20 md:pb-14">
        <h1 className="font-serif text-[2.4rem] leading-tight font-bold tracking-tight text-heading md:text-[3.4rem]">
          Hello, little bird!
        </h1>
        <p className="mt-3 text-[1.02rem] text-muted md:text-[1.05rem]">{siteConfig.slogan}</p>
      </section>
    </Container>
  );
}
