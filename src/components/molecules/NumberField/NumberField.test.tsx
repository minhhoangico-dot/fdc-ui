import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NumberField } from './NumberField';

describe('NumberField', () => {
  it('reads the unit and a neutral hint while empty', () => {
    render(<NumberField label="Mạch" unit="lần/phút" example="78" />);
    const input = screen.getByRole('textbox', { name: 'Mạch' });
    expect(input).toHaveAccessibleDescription('lần/phút Chưa điền · ví dụ 78');
    expect(input).toHaveAttribute('inputmode', 'numeric');
    expect(input).not.toHaveAttribute('aria-invalid');
  });

  it('accepts a decimal comma and tidies a dot on blur', async () => {
    const onValueChange = vi.fn();
    render(<NumberField label="Cân nặng" unit="kg" decimals={1} onValueChange={onValueChange} />);
    const input = screen.getByRole('textbox', { name: 'Cân nặng' });
    await userEvent.type(input, '52.5');
    expect(onValueChange).toHaveBeenLastCalledWith(52.5, '52.5');
    await userEvent.tab();
    expect(input).toHaveValue('52,5');
  });

  it('checks the range only after leaving the field', async () => {
    render(<NumberField label="Mạch" unit="lần/phút" min={30} max={250} />);
    const input = screen.getByRole('textbox', { name: 'Mạch' });
    await userEvent.type(input, '300');
    expect(input).not.toHaveAttribute('aria-invalid');
    await userEvent.tab();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription(/Lỗi: Mạch từ 30 đến 250 lần\/phút\./);
    await userEvent.clear(input);
    await userEvent.type(input, '78');
    expect(input).not.toHaveAttribute('aria-invalid');
  });

  it('says what to type when the text is not a number', async () => {
    render(<NumberField label="Mạch" example="78" />);
    await userEvent.type(screen.getByRole('textbox'), '120/80');
    await userEvent.tab();
    expect(screen.getByText('Nhập một số, ví dụ 78.')).toBeInTheDocument();
  });

  it('flags a value outside the normal range with a word, not an error', async () => {
    render(<NumberField label="Glucose máu" unit="mmol/L" decimals={1} normalRange={[3.9, 6.4]} defaultValue="7,2" />);
    expect(screen.getByText('Cao')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-invalid');
  });

  it('lets the page error win', () => {
    render(<NumberField label="Mạch" error="Điền mạch trước khi xem lại" />);
    expect(screen.getByRole('textbox')).toHaveAccessibleDescription(/Lỗi: Điền mạch trước khi xem lại/);
  });
});

describe('NumberField v2.4 hint', () => {
  it('drops "Chưa điền" next to an error, keeping only the example', () => {
    render(<NumberField label="Mạch" unit="lần/phút" example="78" error="Điền mạch" />);
    expect(screen.queryByText(/Chưa điền/)).not.toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveAccessibleDescription('lần/phút ví dụ 78 Lỗi: Điền mạch');
  });

  it('shows no hint at all next to an error when there is no example', () => {
    render(<NumberField label="Mạch" unit="lần/phút" error="Điền mạch" />);
    expect(screen.getByRole('textbox')).toHaveAccessibleDescription('lần/phút Lỗi: Điền mạch');
  });

  it("keeps only the example next to the field's own range error", async () => {
    render(<NumberField label="Mạch" unit="lần/phút" example="78" min={30} max={250} />);
    const input = screen.getByRole('textbox');
    await userEvent.type(input, '300');
    await userEvent.tab();
    expect(input).toHaveAccessibleDescription('lần/phút ví dụ 78 Lỗi: Mạch từ 30 đến 250 lần/phút.');
  });

  it('keeps the example while typing, then drops the hint once filled and left', async () => {
    render(<NumberField label="Chiều cao" unit="cm" example="158" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAccessibleDescription('cm Chưa điền · ví dụ 158');
    await userEvent.type(input, '1');
    // Still one line of hint while typing, so the box does not move under the cursor.
    expect(input).toHaveAccessibleDescription('cm ví dụ 158');
    await userEvent.type(input, '62');
    await userEvent.tab();
    expect(screen.queryByText(/ví dụ 158/)).not.toBeInTheDocument();
    expect(input).toHaveAccessibleDescription('cm');
    // Back into the filled field to change it: the example comes back.
    await userEvent.click(input);
    expect(input).toHaveAccessibleDescription('cm ví dụ 158');
  });

  it('shows no hint for a value that was already filled in', () => {
    render(<NumberField label="Cân nặng" unit="kg" decimals={1} example="52,5" defaultValue="52,5" />);
    expect(screen.getByRole('textbox')).toHaveAccessibleDescription('kg');
  });

  it("lets the consumer's hint win in every state", async () => {
    const onFocus = vi.fn();
    render(<NumberField label="Mạch" example="78" hint="Đo lúc nghỉ 5 phút" defaultValue="78" error="Kiểm tra lại" onFocus={onFocus} />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAccessibleDescription('Đo lúc nghỉ 5 phút Lỗi: Kiểm tra lại');
    await userEvent.click(input);
    expect(onFocus).toHaveBeenCalled();
    expect(input).toHaveAccessibleDescription('Đo lúc nghỉ 5 phút Lỗi: Kiểm tra lại');
  });
});
