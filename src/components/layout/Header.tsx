import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Logo } from '../common/Logo';
import { ThemeToggleButton } from '../common/ThemeToggle';
import { MobileDrawer } from './MobileDrawer';
import { NAV_ITEMS } from './navItems';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/95 backdrop-blur supports-[backdrop-filter]:bg-bg/85">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-5 md:px-9">
        <Logo />

        {/* PC: HOME / BIRDS / FAVORITES / 테마 변경 */}
        <nav aria-label="주요 메뉴" className="hidden items-center gap-1.5 md:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-[0.82rem] font-semibold tracking-[0.06em] transition-colors ${
                  isActive ? 'bg-primary text-on-primary' : 'text-text hover:bg-sage'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <span className="ml-1.5">
            <ThemeToggleButton />
          </span>
        </nav>

        {/* 모바일: 햄버거 버튼 */}
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="메뉴 열기"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          className="grid h-10 w-10 place-items-center rounded-full border border-line bg-surface text-text shadow-soft md:hidden"
        >
          <Menu size={19} aria-hidden />
        </button>
      </div>

      <MobileDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
