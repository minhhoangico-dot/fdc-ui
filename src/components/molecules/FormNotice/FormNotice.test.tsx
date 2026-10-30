import { render, screen } from '@testing-library/react';
import { FormNotice, type FormNoticeValue } from './FormNotice';

describe('FormNotice', () => {
  it('is a status line with its type, unboxed by default', () => {
    render(<FormNotice notice={{ type: 'success', text: 'Đã gửi.' }} />);
    const note = screen.getByRole('status');
    expect(note).toHaveTextContent('Đã gửi.');
    expect(note).toHaveAttribute('data-type', 'success');
    expect(note).not.toHaveAttribute('data-boxed');
  });

  it('boxed: stands alone with the warning type', () => {
    render(<FormNotice boxed notice={{ type: 'warning', text: 'Còn 3 mục còn thiếu.' }} />);
    const note = screen.getByRole('status');
    expect(note).toHaveAttribute('data-boxed', 'true');
    expect(note).toHaveAttribute('data-type', 'warning');
  });

  it('shows the type as a hidden sign before the words: "!" error and warning, "i" info, "✓" success', () => {
    const signs: Array<[NonNullable<FormNoticeValue['type']>, string]> = [
      ['error', '!'],
      ['warning', '!'],
      ['info', 'i'],
      ['success', '✓'],
    ];
    for (const [type, sign] of signs) {
      const { unmount } = render(<FormNotice boxed notice={{ type, text: 'Bị từ chối: Sở trả lại hồ sơ lúc 09:32.' }} />);
      const note = screen.getByRole('status');
      const mark = note.querySelector('[data-part="mark"]');
      expect(mark, type).toHaveTextContent(sign);
      expect(mark, type).toHaveAttribute('aria-hidden', 'true');
      expect(note.firstElementChild, type).toBe(mark);
      unmount();
    }
  });

  it('keeps an empty live region in the page until there is something to say', () => {
    const { rerender } = render(<FormNotice notice={null} />);
    const note = screen.getByRole('status');
    expect(note).toBeEmptyDOMElement();
    rerender(<FormNotice notice={{ type: 'error', text: 'Chưa gửi được.' }} />);
    expect(screen.getByRole('status')).toBe(note);
    expect(note).toHaveTextContent('Chưa gửi được.');
  });
});

it('can stay quiet for text that changes by itself, such as a countdown', () => {
  const { container } = render(<FormNotice live={false} notice={{ text: 'Ngô Văn Nam: chờ gửi lên Sở · còn 22 giây' }} />);
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
  expect(container).toHaveTextContent('còn 22 giây');
});
