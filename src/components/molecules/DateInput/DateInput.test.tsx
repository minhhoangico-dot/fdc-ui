import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DateInput } from './DateInput';
import { partsToDate, partsToIso } from './dateParts';

describe('DateInput', () => {
  it('is a labelled group of Ngày / Tháng / Năm with birthday autocomplete', () => {
    render(<DateInput label="Ngày sinh" />);
    expect(screen.getByRole('group', { name: 'Ngày sinh' })).toBeInTheDocument();
    expect(screen.getByLabelText('Ngày')).toHaveAttribute('autocomplete', 'bday-day');
    expect(screen.getByLabelText('Năm')).toHaveAttribute('autocomplete', 'bday-year');
  });

  it('keeps digits only and reports changes', async () => {
    const onValueChange = vi.fn();
    render(<DateInput label="Ngày sinh" onValueChange={onValueChange} />);
    await userEvent.type(screen.getByLabelText('Tháng'), '3a');
    expect(screen.getByLabelText('Tháng')).toHaveValue('3');
    expect(onValueChange).toHaveBeenLastCalledWith({ day: '', month: '3', year: '' });
  });

  it('links the hint and the error to the group, with the same error sign as every field', () => {
    const { container } = render(<DateInput label="Ngày sinh" error="Ngày sinh không có thật" errorPrefix="Cần sửa:" />);
    const group = screen.getByRole('group', { name: 'Ngày sinh' });
    expect(group).toHaveAccessibleDescription(/^Ví dụ: 27\s3\s1950 Cần sửa: Ngày sinh không có thật$/);
    const mark = container.querySelector('[data-part="error"] [data-part="mark"]');
    expect(mark).toHaveTextContent('!');
    expect(mark).toHaveAttribute('aria-hidden', 'true');
    for (const box of screen.getAllByRole('textbox')) expect(box).toHaveAttribute('aria-invalid', 'true');
  });

  it('keeps the example date on one line (no-break spaces)', () => {
    render(<DateInput label="Ngày sinh" />);
    expect(screen.getByText(/^Ví dụ:/).textContent).toBe('Ví dụ: 27\u00a03\u00a01950');
  });
});

describe('partsToDate', () => {
  it('accepts real dates and rejects impossible ones', () => {
    expect(partsToDate({ day: '27', month: '3', year: '1950' })).toEqual(new Date(1950, 2, 27));
    expect(partsToDate({ day: '31', month: '2', year: '1950' })).toBeNull();
    expect(partsToDate({ day: '1', month: '1', year: '50' })).toBeNull();
    expect(partsToIso({ day: '7', month: '3', year: '1950' })).toBe('1950-03-07');
  });
});
