import { Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

/** PC 헤더용 원형 테마 버튼 */
export function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();
  const label = theme === 'dark' ? '밝은 테마로 변경' : '어두운 테마로 변경';
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className="grid h-10 w-10 place-items-center rounded-full border border-line bg-surface text-text shadow-soft transition-colors hover:bg-sage"
    >
      <Moon size={17} strokeWidth={2} aria-hidden />
    </button>
  );
}

/** 모바일 메뉴 하단용 테마 스위치 */
export function ThemeSwitch() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 px-4 py-3">
      <span className="text-[0.95rem] text-text">테마 변경</span>
      <button
        type="button"
        role="switch"
        aria-checked={isDark}
        aria-label="어두운 테마"
        onClick={toggleTheme}
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
          isDark ? 'bg-primary' : 'bg-sage-strong'
        }`}
      >
        <span
          className={`absolute top-1 left-1 h-5 w-5 rounded-full bg-surface shadow-soft transition-transform duration-200 ${
            isDark ? 'translate-x-5' : ''
          }`}
        />
      </button>
    </label>
  );
}
