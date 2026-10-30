import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NumberField } from './NumberField';

/** The whole description, matching a no-break space wherever the expected text has a space. */
const exactly = (text: string) => new RegExp(`^${text.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&').replace(/ /g, '\\s')}$`);

/** The field's message line (the hint part) and the hidden copies it keeps room for. */
const messageLine = (input: HTMLElement) => input.closest('[data-component="TextField"]')!.querySelector('[data-part="hint"]')!;
const reserved = (input: HTMLElement) => [...messageLine(input).querySelectorAll('[aria-hidden="true"][data-text]')].map((r) => r.getAttribute('data-text')!.replace(/\u00a0/g, ' '));

describe('NumberField', () => {
  it('reads the unit and a neutral hint while empty', () => {
    render(<NumberField label="Mạch" unit="lần/phút" example="78" />);
    const input = screen.getByRole('textbox', { name: 'Mạch' });
    expect(input).toHaveAccessibleDescription(exactly('lần/phút Chưa điền'));
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
    expect(input).toHaveAccessibleDescription(exactly('lần/phút Lỗi: Từ 30 đến 250'));
    await userEvent.clear(input);
    await userEvent.type(input, '78');
    expect(input).not.toHaveAttribute('aria-invalid');
  });

  it('checks the range before the decimals', async () => {
    // Height typed in metres: the fix is the range in centimetres, not "Chỉ số nguyên".
    render(<NumberField label="Chiều cao" unit="cm" min={50} max={250} />);
    const input = screen.getByRole('textbox', { name: 'Chiều cao' });
    await userEvent.type(input, '1,58');
    await userEvent.tab();
    expect(input).toHaveAccessibleDescription(exactly('cm Lỗi: Từ 50 đến 250'));
    await userEvent.clear(input);
    await userEvent.type(input, '158,5');
    await userEvent.tab();
    expect(input).toHaveAccessibleDescription(exactly('cm Lỗi: Chỉ số nguyên'));
  });

  it('says how many digits may follow the comma', async () => {
    render(<NumberField label="Cân nặng" unit="kg" decimals={1} min={2} max={300} />);
    const input = screen.getByRole('textbox', { name: 'Cân nặng' });
    await userEvent.type(input, '52,55');
    await userEvent.tab();
    expect(input).toHaveAccessibleDescription(exactly('kg Lỗi: Chỉ 1 số lẻ'));
  });

  it('says the range with only a lower or an upper limit', async () => {
    render(<NumberField label="Mạch lúc nghỉ" min={30} defaultValue="20" />);
    render(<NumberField label="Mạch khi gắng sức" max={250} defaultValue="300" />);
    for (const input of screen.getAllByRole('textbox')) {
      await userEvent.click(input);
      await userEvent.tab();
    }
    expect(screen.getByRole('textbox', { name: 'Mạch lúc nghỉ' })).toHaveAccessibleDescription(exactly('Lỗi: Từ 30 trở lên'));
    expect(screen.getByRole('textbox', { name: 'Mạch khi gắng sức' })).toHaveAccessibleDescription(exactly('Lỗi: Tối đa 250'));
  });

  it('says what to type when the text is not a number', async () => {
    render(<NumberField label="Mạch" example="78" />);
    await userEvent.type(screen.getByRole('textbox'), '120/80');
    await userEvent.tab();
    expect(screen.getByText('Chỉ nhập số')).toBeInTheDocument();
  });

  it('flags a value outside the normal range with a word and the range, not an error', () => {
    render(<NumberField label="Glucose máu" unit="mmol/L" decimals={1} normalRange={[3.9, 6.4]} defaultValue="7,2" />);
    expect(screen.getByText('Cao')).toBeInTheDocument();
    const input = screen.getByRole('textbox');
    expect(input).not.toHaveAttribute('aria-invalid');
    expect(input).toHaveAccessibleDescription(exactly('mmol/L Cao · bình thường 3,9–6,4'));
  });

  it('puts the tag in the message line, never beside the box', () => {
    const { container } = render(<NumberField label="Mạch" unit="lần/phút" normalRange={[60, 100]} defaultValue="45" />);
    const tag = screen.getByText('Thấp').closest('[data-component="StatusTag"]')!;
    expect(tag.closest('[data-part="hint"]')).not.toBeNull();
    expect(container.querySelector('[data-part="control"] [data-component="StatusTag"]')).toBeNull();
  });

  it('lets the page error win, in the same line, as given', () => {
    render(<NumberField label="Mạch" example="78" error="Điền mạch" />);
    expect(screen.getByRole('textbox')).toHaveAccessibleDescription(exactly('Lỗi: Điền mạch'));
  });
});

describe('NumberField one message line', () => {
  it('shows the page error in place of the hint, and no line of its own', () => {
    const { container } = render(<NumberField label="Mạch" unit="lần/phút" example="78" error="Điền mạch" />);
    expect(screen.queryByText(/Chưa điền/)).not.toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveAccessibleDescription(exactly('lần/phút Lỗi: Điền mạch'));
    expect(container.querySelector('[data-part="error"]')).toBeNull();
  });

  it('keeps the page error while the field has focus', async () => {
    render(<NumberField label="Mạch" unit="lần/phút" example="78" error="Điền mạch" />);
    const input = screen.getByRole('textbox');
    await userEvent.click(input);
    expect(input).toHaveAccessibleDescription(exactly('lần/phút Lỗi: Điền mạch'));
  });

  it('shows the example from focus, then nothing once filled and left', async () => {
    render(<NumberField label="Chiều cao" unit="cm" example="158" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAccessibleDescription(exactly('cm Chưa điền'));
    // Focused, still empty: the example, the moment it helps.
    await userEvent.click(input);
    expect(input).toHaveAccessibleDescription(exactly('cm ví dụ 158'));
    await userEvent.type(input, '1');
    expect(input).toHaveAccessibleDescription(exactly('cm ví dụ 158'));
    await userEvent.type(input, '62');
    await userEvent.tab();
    expect(screen.queryByText(/ví dụ 158/)).not.toBeInTheDocument();
    expect(input).toHaveAccessibleDescription('cm');
    // Back into the filled field to change it: the example comes back.
    await userEvent.click(input);
    expect(input).toHaveAccessibleDescription(exactly('cm ví dụ 158'));
  });

  it('keeps room for every text the line may show, so the box never moves', () => {
    render(<NumberField label="Mạch" unit="lần/phút" example="78" min={30} max={250} defaultValue="78" />);
    const input = screen.getByRole('textbox');
    // Filled and left: nothing is shown, but the line is still there with its hidden copies.
    expect(messageLine(input)).toHaveTextContent('');
    expect(reserved(input)).toEqual(['Chưa điền', 'ví dụ 78', 'Từ 30 đến 250', 'Chỉ nhập số', 'Chỉ số nguyên']);
    // The copies are not page text and not read out.
    expect(screen.queryByText('Từ 30 đến 250')).not.toBeInTheDocument();
    expect(input).toHaveAccessibleDescription('lần/phút');
  });

  it("keeps the page error's room after the page clears it", () => {
    const { rerender } = render(<NumberField label="Mạch" example="78" error="Điền mạch" />);
    rerender(<NumberField label="Mạch" example="78" defaultValue="78" />);
    const input = screen.getByRole('textbox');
    expect(input).not.toHaveAttribute('aria-invalid');
    expect(reserved(input)).toContain('Điền mạch');
  });

  it('shows no hint for a value that was already filled in', () => {
    render(<NumberField label="Cân nặng" unit="kg" decimals={1} example="52,5" defaultValue="52,5" />);
    expect(screen.getByRole('textbox')).toHaveAccessibleDescription('kg');
  });

  it("shows the screen's hint until an error or a tag takes its place", async () => {
    const onFocus = vi.fn();
    const { rerender } = render(<NumberField label="Mạch" example="78" hint="Đo lúc nghỉ 5 phút" defaultValue="78" onFocus={onFocus} />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAccessibleDescription('Đo lúc nghỉ 5 phút');
    await userEvent.click(input);
    expect(onFocus).toHaveBeenCalled();
    expect(input).toHaveAccessibleDescription('Đo lúc nghỉ 5 phút');
    rerender(<NumberField label="Mạch" example="78" hint="Đo lúc nghỉ 5 phút" defaultValue="78" error="Kiểm tra lại" />);
    expect(input).toHaveAccessibleDescription(exactly('Lỗi: Kiểm tra lại'));
  });
});
