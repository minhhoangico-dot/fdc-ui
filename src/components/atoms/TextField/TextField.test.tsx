import { render, screen } from '@testing-library/react';
import { TextField } from './TextField';

describe('TextField', () => {
  it('links label, hint and error to the input', () => {
    render(<TextField label="Năm sinh" hint="Ví dụ 1958" error="Nhập năm sinh gồm 4 chữ số" />);
    const input = screen.getByLabelText('Năm sinh');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription(/Ví dụ 1958.*Lỗi: Nhập năm sinh gồm 4 chữ số/);
  });

  it('keeps a hidden label available to screen readers', () => {
    render(<TextField label="Tìm kiếm" hideLabel />);
    expect(screen.getByLabelText('Tìm kiếm')).toBeInTheDocument();
  });

  it('renders a textarea when multiline', () => {
    render(<TextField label="Nội dung" multiline />);
    expect(screen.getByLabelText('Nội dung').tagName).toBe('TEXTAREA');
  });
});
