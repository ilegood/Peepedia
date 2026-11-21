import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import { ThemeSwitch } from '../common/ThemeToggle';
import { useScrollLock } from '../../hooks/useScrollLock';
import { NAV_ITEMS } from './navItems';

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
}

/**
 * 모바일 메뉴
 * - 오른쪽에서 슬라이드, 화면 너비 약 75%
 * - 배경 어둡게 처리, 바깥 배경 터치 또는 X 버튼으로 닫기
 * - 하단에 테마 변경 스위치
 */
export function MobileDrawer({ open, onClose }: MobileDrawerProps) {
  const location = useLocation();
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  useScrollLock(open);

  // 페이지가 바뀌면 자동으로 닫는다.
  useEffect(() => {
    onClose();
  }, [location.pathname]); // onClose 는 의도적으로 제외 (경로 변경 시에만 실행)

  useEffect(() => {
    if (!open) return;
    closeBtnRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return createPortal(
    <div className={`fixed inset-0 z-50 md:hidden ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
      {/* 어두운 배경 */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-overlay transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* 메뉴 패널 */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="메뉴"
        inert={!open}
        className={`absolute top-0 right-0 flex h-full w-3/4 max-w-sm flex-col border-l border-line bg-bg px-5 pt-5 pb-6 shadow-card transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-end">
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="메뉴 닫기"
            className="grid h-10 w-10 place-items-center rounded-full border border-line bg-surface text-text"
          >
            <X size={18} aria-hidden />
          </button>
        </div>

        <nav aria-label="모바일 메뉴" className="mt-3 flex flex-col gap-1.5">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                `rounded-2xl px-4 py-4 text-[1.05rem] font-medium tracking-[0.03em] transition-colors ${
                  isActive ? 'bg-primary text-on-primary' : 'text-text hover:bg-sage'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto border-t border-line pt-3">
          <ThemeSwitch />
        </div>
      </div>
    </div>,
    document.body,
  );
}
