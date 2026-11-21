import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { HabitatSection } from './HabitatSection';

describe('HabitatSection', () => {
  it('지도에서 서식 국가를 클릭하면 해당 지역 설명을 표시한다', () => {
    render(
      <HabitatSection
        habitatPhoto={null}
        birdName="박새"
        regions={[
          { code: 'KR', name: '대한민국', description: '전국의 숲과 공원에서 흔히 볼 수 있어요.' },
          { code: 'JP', name: '일본', description: '' },
        ]}
      />,
    );

    expect(screen.getByRole('img', { name: '주요 서식 지역 세계지도' })).toBeInTheDocument();
    expect(screen.getByText('전국의 숲과 공원에서 흔히 볼 수 있어요.')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '일본 서식 정보 보기' }));
    expect(screen.getByText('정보를 준비하고 있어요.')).toBeInTheDocument();
  });
});
