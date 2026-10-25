import { render, screen } from '@testing-library/react';
import { FormNotice } from './FormNotice';

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
});
