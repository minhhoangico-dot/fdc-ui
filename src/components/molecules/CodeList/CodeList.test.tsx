import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { icd10 } from '../../../fixtures/ksk';
import { CodeList } from './CodeList';

const I10 = 'Tăng huyết áp vô căn (nguyên phát) (I10)';
const E11 = 'Đái tháo đường type 2 (E11)';

describe('CodeList', () => {
  it('is a group named by its question, empty at first, with a field to add', () => {
    render(<CodeList label="Bệnh, tật" hint="Chọn mọi bệnh, tật phát hiện khi khám." options={icd10} />);
    const group = screen.getByRole('group', { name: 'Bệnh, tật' });
    expect(group).toHaveAccessibleDescription('Chọn mọi bệnh, tật phát hiện khi khám.');
    expect(screen.getByText('Chưa có mục nào.')).toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
    expect(within(group).getByRole('combobox', { name: 'Thêm bệnh, tật' })).toHaveValue('');
  });

  it('adds two items; the field empties itself, keeps focus and announces each', async () => {
    const onValueChange = vi.fn();
    render(<CodeList label="Bệnh, tật" options={icd10} onValueChange={onValueChange} />);
    const input = screen.getByRole('combobox', { name: 'Thêm bệnh, tật' });

    await userEvent.type(input, 'tang huyet');
    await userEvent.keyboard('{Enter}');
    expect(onValueChange).toHaveBeenLastCalledWith(['I10']);
    expect(input).toHaveValue('');
    expect(input).toHaveFocus();
    expect(screen.getByText(`Đã thêm ${I10}`)).toHaveAttribute('role', 'status');

    await userEvent.type(input, 'e11');
    await userEvent.keyboard('{Enter}');
    expect(onValueChange).toHaveBeenLastCalledWith(['I10', 'E11']);
    expect(input).toHaveValue('');
    expect(input).toHaveFocus();
    expect(screen.getByText(`Đã thêm ${E11}`)).toHaveAttribute('role', 'status');

    const items = within(screen.getByRole('list')).getAllByRole('listitem');
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent(I10);
    expect(items[1]).toHaveTextContent(E11);
    expect(screen.queryByText('Chưa có mục nào.')).not.toBeInTheDocument();
  });

  it('removes one with a named button, announces it and moves focus to the add field', async () => {
    const onValueChange = vi.fn();
    render(<CodeList label="Bệnh, tật" options={icd10} defaultValue={['I10', 'E11']} onValueChange={onValueChange} />);
    const remove = screen.getByRole('button', { name: `Bỏ ${I10}` });
    expect(remove).toHaveTextContent(/^Bỏ/);
    await userEvent.click(remove);
    expect(onValueChange).toHaveBeenCalledWith(['E11']);
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
    expect(screen.getByRole('listitem')).toHaveTextContent(E11);
    expect(screen.getByRole('combobox', { name: 'Thêm bệnh, tật' })).toHaveFocus();
    expect(screen.getByText(`Đã bỏ ${I10}`)).toHaveAttribute('role', 'status');

    await userEvent.click(screen.getByRole('button', { name: `Bỏ ${E11}` }));
    expect(screen.getByText('Chưa có mục nào.')).toBeInTheDocument();
  });

  it('leaves chosen items out of the add list', async () => {
    render(<CodeList label="Bệnh, tật" options={icd10} defaultValue={['I10']} />);
    const input = screen.getByRole('combobox');
    await userEvent.type(input, 'tang');
    const options = screen.getAllByRole('option').map((o) => o.textContent ?? '');
    expect(options.length).toBeGreaterThan(0);
    expect(options.some((t) => t.includes('(I10)'))).toBe(false);
    await userEvent.clear(input);
    await userEvent.type(input, 'i10');
    expect(screen.queryAllByRole('option')).toHaveLength(0);
    expect(screen.getByText('Không tìm thấy “i10”. Thử gõ tên khác hoặc mã.')).toBeInTheDocument();
  });

  it('follows a controlled value', async () => {
    const onValueChange = vi.fn();
    const { rerender } = render(<CodeList label="Bệnh, tật" options={icd10} value={['I10']} onValueChange={onValueChange} />);
    await userEvent.type(screen.getByRole('combobox'), 'e11');
    await userEvent.keyboard('{Enter}');
    expect(onValueChange).toHaveBeenCalledWith(['I10', 'E11']);
    // The parent has not taken the change yet: the list still shows what it was given.
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
    rerender(<CodeList label="Bệnh, tật" options={icd10} value={['I10', 'E11']} onValueChange={onValueChange} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    rerender(<CodeList label="Bệnh, tật" options={icd10} value={[]} onValueChange={onValueChange} />);
    expect(screen.getByText('Chưa có mục nào.')).toBeInTheDocument();
  });

  it('links one error to the group and puts the id on the add field', () => {
    render(<CodeList label="Bệnh, tật" options={icd10} error="Thêm ít nhất một bệnh, tật" id="ket-luan-benh" />);
    expect(screen.getByRole('group', { name: 'Bệnh, tật' })).toHaveAccessibleDescription('Lỗi: Thêm ít nhất một bệnh, tật');
    expect(screen.getByRole('combobox')).toHaveAttribute('id', 'ket-luan-benh');
  });

  it('takes its own words', () => {
    render(
      <CodeList label="Nghề nghiệp phụ" options={icd10} defaultValue={['E66']} addLabel="Thêm nghề" removeLabel="Xóa" emptyText="Chưa có nghề nào." />,
    );
    expect(screen.getByRole('combobox', { name: 'Thêm nghề' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Xóa Béo phì (E66)' })).toBeInTheDocument();
  });
});
