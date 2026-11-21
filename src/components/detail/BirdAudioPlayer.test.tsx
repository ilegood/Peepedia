import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { BirdAudioPlayer } from './BirdAudioPlayer';

describe('BirdAudioPlayer', () => {
  it('울음소리가 없으면 안내 문구를 표시한다', () => {
    render(<BirdAudioPlayer src={null} birdName="박새" />);
    expect(screen.getByText('아직 등록된 울음소리가 없어요.')).toBeInTheDocument();
  });

  it('재생 후 다른 새로 바뀌면 기존 오디오를 중단한다', () => {
    const playSpy = vi
      .spyOn(HTMLMediaElement.prototype, 'play')
      .mockImplementation(() => Promise.resolve());
    const pauseSpy = vi
      .spyOn(HTMLMediaElement.prototype, 'pause')
      .mockImplementation(() => {});

    const { rerender } = render(<BirdAudioPlayer src="/sound-a.mp3" birdName="박새" />);

    fireEvent.click(screen.getByRole('button', { name: '박새 울음소리 재생' }));
    expect(playSpy).toHaveBeenCalledTimes(1);

    rerender(<BirdAudioPlayer src="/sound-b.mp3" birdName="참새" />);
    expect(pauseSpy).toHaveBeenCalled();

    playSpy.mockRestore();
    pauseSpy.mockRestore();
  });
});
