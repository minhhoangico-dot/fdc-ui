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

  it('shows the error with a sign that screen readers skip', () => {
    const { container } = render(<TextField label="Năm sinh" error="Nhập năm sinh gồm 4 chữ số" />);
    const mark = container.querySelector('[data-part="error"] [data-part="mark"]');
    expect(mark).toHaveTextContent('!');
    expect(mark).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByLabelText('Năm sinh')).toHaveAccessibleDescription('Lỗi: Nhập năm sinh gồm 4 chữ số');
  });

  it('keeps one message line when `reserve` is set: the error takes the hint\'s place', () => {
    const { container, rerender } = render(<TextField label="Mạch" unit="lần/phút" hint="ví dụ 78" reserve={['Chưa điền · ví dụ 78', { error: 'Nhập từ 30 đến 250' }]} />);
    const input = screen.getByLabelText('Mạch');
    const line = container.querySelector('[data-part="hint"]')!;
    expect(input).toHaveAccessibleDescription('lần/phút ví dụ 78');
    // The reserved texts are drawn by CSS from data-text: not page text, not read out.
    expect(line.querySelectorAll('[aria-hidden="true"][data-text]')).toHaveLength(2);
    expect(screen.queryByText('Nhập từ 30 đến 250')).not.toBeInTheDocument();

    rerender(<TextField label="Mạch" unit="lần/phút" hint="ví dụ 78" error="Điền mạch, ví dụ 78" reserve={['Chưa điền · ví dụ 78']} />);
    expect(input).toHaveAccessibleDescription('lần/phút Lỗi: Điền mạch, ví dụ 78');
    expect(container.querySelector('[data-part="error"]')).toBeNull();
    expect(container.querySelectorAll('[data-part="hint"]')).toHaveLength(1);
    expect(screen.queryByText('ví dụ 78')).not.toBeInTheDocument();
  });

  it('keeps the message line even when it has nothing to show', () => {
    const { container } = render(<TextField label="Mạch" reserve={[]} />);
    expect(container.querySelector('[data-part="hint"]')).toBeInTheDocument();
    expect(screen.getByLabelText('Mạch')).not.toHaveAttribute('aria-describedby');
  });

  it('renders a textarea when multiline', () => {
    render(<TextField label="Nội dung" multiline />);
    expect(screen.getByLabelText('Nội dung').tagName).toBe('TEXTAREA');
  });
});
