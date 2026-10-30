import { createRef, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('is a native checkbox named by its label; clicking the label text toggles it', async () => {
    const onChange = vi.fn();
    render(<Checkbox label="Tôi đã xem phần nhập tay" onChange={onChange} />);
    const box = screen.getByRole('checkbox', { name: 'Tôi đã xem phần nhập tay' });
    expect(box).not.toBeChecked();
    await userEvent.click(screen.getByText('Tôi đã xem phần nhập tay'));
    expect(box).toBeChecked();
    expect(onChange).toHaveBeenCalledTimes(1);
    await userEvent.click(screen.getByText('Tôi đã xem phần nhập tay'));
    expect(box).not.toBeChecked();
  });

  it('toggles with the space bar', async () => {
    render(<Checkbox label="Tôi đã xem phần nhập tay" />);
    const box = screen.getByRole('checkbox');
    box.focus();
    await userEvent.keyboard(' ');
    expect(box).toBeChecked();
  });

  it('works controlled', async () => {
    function Controlled() {
      const [ticked, setTicked] = useState(false);
      return <Checkbox label="Tôi đã xem phần nhập tay" checked={ticked} onChange={(e) => setTicked(e.target.checked)} />;
    }
    render(<Controlled />);
    await userEvent.click(screen.getByRole('checkbox'));
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('links the hint and error to the box', () => {
    render(
      <Checkbox
        label="Tôi đã xem phần nhập tay"
        hint="1 kết quả nhập tay: X-quang tim phổi"
        error="Tích “Tôi đã xem phần nhập tay” để gửi"
      />,
    );
    const box = screen.getByRole('checkbox', { name: 'Tôi đã xem phần nhập tay' });
    expect(box).toHaveAttribute('aria-invalid', 'true');
    expect(box).toHaveAccessibleDescription(/1 kết quả nhập tay: X-quang tim phổi.*Lỗi: Tích “Tôi đã xem phần nhập tay” để gửi/);
    expect(box.closest('[data-component="Checkbox"]')).toHaveAttribute('data-invalid', 'true');
  });

  it('has no description or invalid state without hint and error', () => {
    render(<Checkbox label="Nhớ lựa chọn này" />);
    const box = screen.getByRole('checkbox');
    expect(box).not.toHaveAttribute('aria-describedby');
    expect(box).not.toHaveAttribute('aria-invalid');
  });

  it('uses a custom error prefix', () => {
    render(<Checkbox label="Tôi đồng ý" error="Tích để tiếp tục" errorPrefix="Cần sửa:" />);
    expect(screen.getByRole('checkbox')).toHaveAccessibleDescription('Cần sửa: Tích để tiếp tục');
  });

  it('shows the error with the same sign as every field, which screen readers skip', () => {
    const { container } = render(<Checkbox label="Tôi đồng ý" error="Tích để tiếp tục" />);
    const mark = container.querySelector('[data-part="error"] [data-part="mark"]');
    expect(mark).toHaveTextContent('!');
    expect(mark).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByRole('checkbox')).toHaveAccessibleDescription('Lỗi: Tích để tiếp tục');
  });

  it('forwards the ref, id and name to the input; disabled does not toggle', async () => {
    const ref = createRef<HTMLInputElement>();
    render(<Checkbox ref={ref} id="da-xem" name="daXem" label="Tôi đã xem phần nhập tay" disabled />);
    const box = screen.getByRole('checkbox');
    expect(ref.current).toBe(box);
    expect(box).toHaveAttribute('id', 'da-xem');
    expect(box).toHaveAttribute('name', 'daXem');
    expect(box).toBeDisabled();
    await userEvent.click(screen.getByText('Tôi đã xem phần nhập tay'));
    expect(box).not.toBeChecked();
  });
});
