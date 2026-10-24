import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactForm } from './ContactForm';

it('validates name and phone, then submits normalized values', async () => {
  const onSubmit = vi.fn();
  render(<ContactForm onSubmit={onSubmit} />);
  await userEvent.click(screen.getByRole('button', { name: 'Gửi liên hệ' }));
  expect(screen.getByRole('alert')).toHaveTextContent('Nhập họ và tên');
  await userEvent.type(screen.getByLabelText(/^Họ và tên/), 'Nguyễn Văn Quyết');
  await userEvent.type(screen.getByLabelText(/^Số điện thoại/), '+84912345678');
  await userEvent.click(screen.getByRole('button', { name: 'Gửi liên hệ' }));
  expect(onSubmit).toHaveBeenCalledWith({ name: 'Nguyễn Văn Quyết', phone: '0912345678', message: '' });
});
