import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ResultLookupForm } from './ResultLookupForm';

describe('ResultLookupForm', () => {
  it('shows a focused error summary and does not submit when empty', async () => {
    const onSubmit = vi.fn();
    render(<ResultLookupForm onSubmit={onSubmit} />);
    await userEvent.click(screen.getByRole('button', { name: 'Xem kết quả' }));
    const summary = screen.getByRole('alert');
    expect(summary).toHaveFocus();
    expect(screen.getAllByRole('link')).toHaveLength(4);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits clean values', async () => {
    const onSubmit = vi.fn();
    render(<ResultLookupForm onSubmit={onSubmit} />);
    await userEvent.type(screen.getByLabelText('Ngày'), '5');
    await userEvent.type(screen.getByLabelText('Tháng'), '10');
    await userEvent.type(screen.getByLabelText('Năm'), '2026');
    await userEvent.type(screen.getByLabelText(/^Năm sinh/), '1958');
    await userEvent.type(screen.getByLabelText(/^Số điện thoại/), '0912 345 678');
    await userEvent.type(screen.getByLabelText(/^Mã bệnh nhân/), 'BN-2041');
    await userEvent.click(screen.getByRole('button', { name: 'Xem kết quả' }));
    expect(onSubmit).toHaveBeenCalledWith({ visitDate: '2026-10-05', birthYear: '1958', phone: '0912345678', patientCode: 'BN-2041' });
  });
});
