import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

  it('shows a computed value read-only: focusable and read, but not editable', async () => {
    const user = userEvent.setup();
    render(<TextField label="BMI" readOnly value="24,1" unit="kg/m²" hint="Tự tính từ chiều cao và cân nặng" />);
    const input = screen.getByLabelText('BMI') as HTMLInputElement;
    expect(input.readOnly).toBe(true);
    expect(input).toHaveAttribute('readonly');
    expect(input).not.toBeDisabled();
    expect(input).toHaveAccessibleDescription(/kg\/m².*Tự tính từ chiều cao và cân nặng/);
    await user.click(input);
    expect(input).toHaveFocus();
    await user.keyboard('9');
    expect(input).toHaveValue('24,1');
  });

  it('renders a textarea when multiline', () => {
    render(<TextField label="Nội dung" multiline />);
    expect(screen.getByLabelText('Nội dung').tagName).toBe('TEXTAREA');
  });
});
