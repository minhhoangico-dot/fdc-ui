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
