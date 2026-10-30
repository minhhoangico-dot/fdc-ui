import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { StatusTag, type StatusTagTone } from './StatusTag';

describe('StatusTag', () => {
  it('renders its words with the tone and size as data attributes, and forwards ref', () => {
    const ref = createRef<HTMLSpanElement>();
    render(
      <StatusTag ref={ref} tone="attention" size="sm">
        Cao
      </StatusTag>,
    );
    const tag = screen.getByText('Cao');
    expect(tag).toBe(ref.current);
    expect(tag).toHaveAttribute('data-tone', 'attention');
    expect(tag).toHaveAttribute('data-size', 'sm');
  });

  it('defaults to a neutral, medium tag and passes other attributes through', () => {
    render(<StatusTag title="Trạng thái hồ sơ">Cần điền</StatusTag>);
    const tag = screen.getByText('Cần điền');
    expect(tag).toHaveAttribute('data-tone', 'neutral');
    expect(tag).toHaveAttribute('data-size', 'md');
    expect(tag).toHaveAttribute('title', 'Trạng thái hồ sơ');
  });

  it('marks a state with a hidden dot; muted sources and strong tags have none', () => {
    const tones: Record<StatusTagTone, boolean> = {
      neutral: true,
      info: true,
      success: true,
      error: true,
      attention: true,
      muted: false,
      strong: false,
    };
    for (const [tone, hasDot] of Object.entries(tones) as Array<[StatusTagTone, boolean]>) {
      const { unmount } = render(<StatusTag tone={tone}>Chữ</StatusTag>);
      const tag = screen.getByText('Chữ');
      const dot = tag.querySelector('[data-part="dot"]');
      if (hasDot) expect(dot, tone).toHaveAttribute('aria-hidden', 'true');
      else expect(dot, tone).toBeNull();
      // The dot adds no words: the tag reads exactly as written.
      expect(tag).toHaveTextContent(/^Chữ$/);
      unmount();
    }
  });
});
