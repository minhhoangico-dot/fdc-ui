import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from './Select';

const groups = [
  { value: 'can-lam', label: 'Cần điền hoặc sửa · 1.017' },
  { value: 'xem-lai', label: 'Sẵn sàng xem lại · 412' },
  { value: 'da-gui', label: 'Đã gửi · 505', disabled: true },
];

describe('Select', () => {
  it('is a native select named by its label, with the options given', () => {
    render(<Select label="Nhóm người" options={groups} />);
    const select = screen.getByRole('combobox', { name: 'Nhóm người' });
    expect(select.tagName).toBe('SELECT');
    expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual([
      'Cần điền hoặc sửa · 1.017',
      'Sẵn sàng xem lại · 412',
      'Đã gửi · 505',
    ]);
    expect(screen.getByRole('option', { name: 'Đã gửi · 505' })).toBeDisabled();
    expect(select.closest('[data-component="Select"]')).not.toBeNull();
  });

  it('calls onChange with the chosen value', async () => {
    const onChange = vi.fn();
    render(<Select label="Nhóm người" options={groups} onChange={(e) => onChange(e.target.value)} />);
    await userEvent.selectOptions(screen.getByRole('combobox'), 'xem-lai');
    expect(onChange).toHaveBeenCalledWith('xem-lai');
    expect(screen.getByRole('combobox')).toHaveValue('xem-lai');
  });

  it('links hint and error and marks the field invalid', () => {
    render(<Select label="Phân loại sức khỏe" hint="Theo kết luận của bác sĩ" error="Chọn phân loại sức khỏe" options={groups} />);
    const select = screen.getByRole('combobox', { name: 'Phân loại sức khỏe' });
    expect(select).toHaveAttribute('aria-invalid', 'true');
    expect(select).toHaveAccessibleDescription(/Theo kết luận của bác sĩ.*Lỗi: Chọn phân loại sức khỏe/);
  });

  it('tags its parts so a FieldRow can line them up', () => {
    const { container } = render(<Select label="Nhóm người" hint="Lọc danh sách" error="Chọn một nhóm" options={groups} />);
    const parts = [...container.querySelectorAll('[data-component="Select"] > [data-part]')].map((el) => el.getAttribute('data-part'));
    expect(parts).toEqual(['label', 'hint', 'error', 'control']);
  });

  it('shows the error with the same sign as every field, which screen readers skip', () => {
    const { container } = render(<Select label="Nhóm máu" error="Chọn nhóm máu" options={groups} />);
    const mark = container.querySelector('[data-part="error"] [data-part="mark"]');
    expect(mark).toHaveTextContent('!');
    expect(mark).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByRole('combobox')).toHaveAccessibleDescription('Lỗi: Chọn nhóm máu');
  });

  it('accepts option elements as children and keeps a hidden label for screen readers', () => {
    render(
      <Select label="Nhóm người" hideLabel defaultValue="b">
        <option value="a">Đang chờ · 96</option>
        <option value="b">Tất cả · 2.033</option>
      </Select>,
    );
    expect(screen.getByRole('combobox', { name: 'Nhóm người' })).toHaveValue('b');
  });

  it('forwards the ref, id and name to the select', () => {
    const ref = createRef<HTMLSelectElement>();
    render(<Select ref={ref} id="nhom" name="nhom" label="Nhóm người" options={groups} />);
    expect(ref.current).toBe(screen.getByRole('combobox'));
    expect(ref.current).toHaveAttribute('id', 'nhom');
    expect(ref.current).toHaveAttribute('name', 'nhom');
  });
});
