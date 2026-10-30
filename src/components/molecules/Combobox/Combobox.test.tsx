import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { icd10 } from '../../../fixtures/ksk';
import { Combobox } from './Combobox';

describe('Combobox', () => {
  it('is a labelled combobox, closed at first', () => {
    render(<Combobox label="Chẩn đoán" options={icd10} />);
    const input = screen.getByRole('combobox', { name: 'Chẩn đoán' });
    expect(input).toHaveAttribute('aria-expanded', 'false');
    expect(input).toHaveAccessibleDescription('Gõ tên hoặc mã, có dấu hay không dấu đều được.');
  });

  it('finds by name without tone marks and shows name first, code after', async () => {
    const onValueChange = vi.fn();
    render(<Combobox label="Chẩn đoán" options={icd10} onValueChange={onValueChange} />);
    const input = screen.getByRole('combobox');
    await userEvent.type(input, 'tang huyet');
    expect(input).toHaveAttribute('aria-expanded', 'true');
    const options = screen.getAllByRole('option');
    expect(options[0]).toHaveTextContent('Tăng huyết áp vô căn (nguyên phát) (I10)');
    await userEvent.keyboard('{Enter}');
    expect(onValueChange).toHaveBeenCalledWith('I10', expect.objectContaining({ code: 'I10' }));
    expect(input).toHaveValue('Tăng huyết áp vô căn (nguyên phát) (I10)');
    expect(input).toHaveAttribute('aria-expanded', 'false');
  });

  it('puts an exact code first', async () => {
    render(<Combobox label="Chẩn đoán" options={icd10} />);
    await userEvent.type(screen.getByRole('combobox'), 'e11');
    expect(screen.getAllByRole('option')[0]).toHaveTextContent('Đái tháo đường type 2 (E11)');
  });

  it('moves with arrow keys and tracks the active option', async () => {
    render(<Combobox label="Nghề" options={[{ value: 'a', label: 'An' }, { value: 'b', label: 'Bình' }]} />);
    const input = screen.getByRole('combobox');
    input.focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(input).toHaveAttribute('aria-activedescendant', expect.stringContaining('-0'));
    await userEvent.keyboard('{ArrowDown}');
    expect(input).toHaveAttribute('aria-activedescendant', expect.stringContaining('-1'));
    await userEvent.keyboard('{Enter}');
    expect(input).toHaveValue('Bình');
  });

  it('says when nothing matches, and Escape or Tab keeps the previous choice', async () => {
    render(<Combobox label="Chẩn đoán" options={icd10} defaultValue="E66" />);
    const input = screen.getByRole('combobox');
    await userEvent.clear(input);
    await userEvent.type(input, 'zzz');
    expect(screen.getByText('Không tìm thấy “zzz”. Thử gõ tên khác hoặc mã.', { selector: 'div' })).toBeInTheDocument();
    // The status reads the same words as the screen, not only a count.
    expect(screen.getByRole('status')).toHaveTextContent('Không tìm thấy “zzz”. Thử gõ tên khác hoặc mã.');
    await userEvent.keyboard('{Escape}');
    expect(input).toHaveValue('Béo phì (E66)');
    await userEvent.type(input, 'x');
    await userEvent.tab();
    expect(input).toHaveValue('Béo phì (E66)');
  });

  it('clears with a labelled button, unless required', async () => {
    const onValueChange = vi.fn();
    const { rerender } = render(<Combobox label="Chẩn đoán" options={icd10} defaultValue="E66" onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Xóa Chẩn đoán' }));
    expect(onValueChange).toHaveBeenCalledWith(null, null);
    expect(screen.getByRole('combobox')).toHaveValue('');
    rerender(<Combobox label="Chẩn đoán" options={icd10} value="E66" required />);
    expect(screen.queryByRole('button', { name: /Xóa/ })).not.toBeInTheDocument();
  });

  it('links an error', () => {
    render(<Combobox label="Nghề" options={[]} error="Chọn nghề" />);
    expect(screen.getByRole('combobox')).toHaveAccessibleDescription(/Lỗi: Chọn nghề/);
  });

  it('takes a group error by id, invalid without a message of its own', () => {
    render(
      <>
        <span id="group-error">Lỗi: Thêm ít nhất một bệnh</span>
        <Combobox label="Thêm bệnh" options={icd10} aria-describedby="group-error" aria-invalid />
      </>,
    );
    const input = screen.getByRole('combobox', { name: 'Thêm bệnh' });
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Gõ tên hoặc mã, có dấu hay không dấu đều được. Lỗi: Thêm ít nhất một bệnh');
    expect(input.closest('[data-component="Combobox"]')).not.toHaveAttribute('data-invalid');
  });

  it('draws a chosen coded item so the name may be cut but the code never is', async () => {
    const { container } = render(<Combobox label="Chẩn đoán" options={icd10} defaultValue="I10" />);
    const input = screen.getByRole('combobox');
    // The field keeps the full text for screen readers and while focused.
    expect(input).toHaveValue('Tăng huyết áp vô căn (nguyên phát) (I10)');
    expect(input).toHaveAttribute('data-masked');
    const shown = container.querySelector('[data-part="shown"]');
    expect(shown).toHaveAttribute('aria-hidden', 'true');
    expect(shown?.children[0]).toHaveTextContent('Tăng huyết áp vô căn (nguyên phát)');
    expect(shown?.children[1]).toHaveTextContent('(I10)');
    // Typing replaces the drawn copy with what was typed.
    await userEvent.clear(input);
    await userEvent.type(input, 'tang');
    expect(input).not.toHaveAttribute('data-masked');
    expect(container.querySelector('[data-part="shown"]')).toBeNull();
  });

  it('says there is nothing to choose, not "not found", when the list is empty', async () => {
    render(<Combobox label="Nghề" options={[]} />);
    await userEvent.click(screen.getByRole('combobox'));
    expect(screen.getByText('Không có mục nào để chọn.')).toBeInTheDocument();
  });

  it('draws nothing over an item without a code', () => {
    const { container } = render(<Combobox label="Nghề" options={[{ value: 'a', label: 'An' }]} defaultValue="a" />);
    expect(screen.getByRole('combobox')).toHaveValue('An');
    expect(container.querySelector('[data-part="shown"]')).toBeNull();
  });
});
