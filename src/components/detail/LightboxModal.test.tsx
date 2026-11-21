import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { LightboxModal } from './LightboxModal';

describe('LightboxModal', () => {
  it('여러 장일 때 순환 이동하고 배경/X 클릭으로 닫힌다', () => {
    const onIndexChange = vi.fn();
    const onClose = vi.fn();

    render(
      <LightboxModal
        open={true}
        photos={['/a.webp', '/b.webp', '/c.webp']}
        index={2}
        birdName="박새"
        onIndexChange={onIndexChange}
        onClose={onClose}
      />,
    );

    expect(screen.getByText('3 / 3')).toBeInTheDocument();
    expect(document.body.style.position).toBe('fixed');

    // 마지막 사진에서 다음 → 첫 사진(0) 순환
    fireEvent.click(screen.getByRole('button', { name: '다음 사진' }));
    expect(onIndexChange).toHaveBeenCalledWith(0);

    // 이전 사진 → 1
    fireEvent.click(screen.getByRole('button', { name: '이전 사진' }));
    expect(onIndexChange).toHaveBeenCalledWith(1);

    // 배경 클릭 닫기
    fireEvent.click(screen.getByRole('dialog'));
    expect(onClose).toHaveBeenCalledTimes(1);

    // X 버튼 닫기
    fireEvent.click(screen.getByRole('button', { name: '사진 확대 닫기' }));
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it('사진이 1장뿐이면 화살표와 번호를 숨긴다', () => {
    render(
      <LightboxModal
        open={true}
        photos={['/only.webp']}
        index={0}
        birdName="참새"
        onIndexChange={() => {}}
        onClose={() => {}}
      />,
    );

    expect(screen.queryByRole('button', { name: '이전 사진' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '다음 사진' })).not.toBeInTheDocument();
    expect(screen.queryByText('1 / 1')).not.toBeInTheDocument();
  });
});
