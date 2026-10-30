import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PhoneInput } from './PhoneInput';

it('accepts +84 and spaces, reports digits, and tidies on blur', async () => {
  const onPhoneChange = vi.fn();
  render(<PhoneInput onPhoneChange={onPhoneChange} />);
  const input = screen.getByLabelText('Số điện thoại');
  expect(input).toHaveAttribute('type', 'tel');
  expect(input).toHaveAttribute('autocomplete', 'tel');
  await userEvent.type(input, '+84 912.345.678');
  expect(onPhoneChange).toHaveBeenLastCalledWith('0912345678', '+84 912.345.678');
  await userEvent.tab();
  expect(input).toHaveValue('0912 345 678');
});

it('shows an error like every field: the sign, then "Lỗi:" for screen readers', () => {
  const { container } = render(<PhoneInput error="Nhập số điện thoại gồm 10 chữ số" />);
  const mark = container.querySelector('[data-part="error"] [data-part="mark"]');
  expect(mark).toHaveTextContent('!');
  expect(mark).toHaveAttribute('aria-hidden', 'true');
  expect(screen.getByLabelText('Số điện thoại')).toHaveAttribute('aria-invalid', 'true');
  expect(screen.getByLabelText('Số điện thoại')).toHaveAccessibleDescription(/^Ví dụ: 0912\s345\s678 Lỗi: Nhập số điện thoại gồm 10 chữ số$/);
});

it('keeps the example number on one line (no-break spaces)', () => {
  render(<PhoneInput />);
  expect(screen.getByText(/^Ví dụ:/).textContent).toBe('Ví dụ: 0912\u00a0345\u00a0678');
});
