import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { StatusTag } from './StatusTag';

describe('StatusTag', () => {
  it('renders its words with the tone and size as data attributes, and forwards ref', () => {
    const ref = createRef<HTMLSpanElement>();
    render(
      <StatusTag ref={ref} tone="error" size="sm">
        Cao
      </StatusTag>,
    );
    const tag = screen.getByText('Cao');
    expect(tag).toBe(ref.current);
    expect(tag).toHaveAttribute('data-tone', 'error');
    expect(tag).toHaveAttribute('data-size', 'sm');
  });

  it('defaults to a neutral, medium tag and passes other attributes through', () => {
    render(<StatusTag title="Nguồn dữ liệu">Nhập tay</StatusTag>);
    const tag = screen.getByText('Nhập tay');
    expect(tag).toHaveAttribute('data-tone', 'neutral');
    expect(tag).toHaveAttribute('data-size', 'md');
    expect(tag).toHaveAttribute('title', 'Nguồn dữ liệu');
  });
});
