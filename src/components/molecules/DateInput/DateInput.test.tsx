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
});

describe('partsToDate', () => {
  it('accepts real dates and rejects impossible ones', () => {
    expect(partsToDate({ day: '27', month: '3', year: '1950' })).toEqual(new Date(1950, 2, 27));
    expect(partsToDate({ day: '31', month: '2', year: '1950' })).toBeNull();
    expect(partsToDate({ day: '1', month: '1', year: '50' })).toBeNull();
    expect(partsToIso({ day: '7', month: '3', year: '1950' })).toBe('1950-03-07');
  });
});
