import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TimeSlotPicker } from './TimeSlotPicker';

const slots = [{ time: '08:00' }, { time: '08:30', taken: true }, { time: '09:00' }];

describe('TimeSlotPicker', () => {
  it('is a radio group; taken slots are disabled and say so in words', () => {
    render(<TimeSlotPicker label="Chọn giờ khám" slots={slots} />);
    expect(screen.getByRole('group', { name: 'Chọn giờ khám' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /08:30/ })).toBeDisabled();
    expect(screen.getByText('Đã kín')).toBeInTheDocument();
  });

  it('selects uncontrolled and reports the time', async () => {
    const onValueChange = vi.fn();
    render(<TimeSlotPicker label="Chọn giờ khám" slots={slots} onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole('radio', { name: '09:00' }));
    expect(screen.getByRole('radio', { name: '09:00' })).toBeChecked();
    expect(onValueChange).toHaveBeenCalledWith('09:00');
  });

  it('explains a fully booked day', () => {
    render(<TimeSlotPicker label="Chọn giờ khám" slots={[{ time: '08:00', taken: true }]} />);
    expect(screen.getByRole('status')).toHaveTextContent('Ngày này đã kín lịch');
  });

  it('puts the given id on the first free slot for error-summary links', () => {
    render(<TimeSlotPicker id="slot-first" label="Chọn giờ khám" slots={[{ time: '07:30', taken: true }, ...slots]} />);
    expect(document.getElementById('slot-first')).toHaveAttribute('value', '08:00');
  });

  it('shows an error with the same sign as every field, read as "Lỗi:"', () => {
    const { container } = render(<TimeSlotPicker label="Chọn giờ khám" slots={slots} error="Chọn một giờ khám" />);
    expect(screen.getByRole('group', { name: 'Chọn giờ khám' })).toHaveAccessibleDescription('Lỗi: Chọn một giờ khám');
    const mark = container.querySelector('[data-part="error"] [data-part="mark"]');
    expect(mark).toHaveTextContent('!');
    expect(mark).toHaveAttribute('aria-hidden', 'true');
  });
});
