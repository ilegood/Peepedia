import { Logo } from '../common/Logo';
import { TEXT } from '../../data/siteConfig';

export function Footer() {
  return (
    <footer className="mt-auto bg-footer">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-4 px-5 py-9 text-center md:grid md:grid-cols-[1fr_auto_1fr] md:gap-6 md:px-9 md:py-7 md:text-left">
        <div className="md:justify-self-start">
          <Logo size="footer" asLink={false} />
        </div>
        <p className="text-[0.9rem] text-muted md:text-[0.82rem]">{TEXT.footerIntro}</p>
        <p className="text-[0.9rem] text-muted md:justify-self-end md:text-[0.82rem]">{TEXT.copyright}</p>
      </div>
    </footer>
  );
}
