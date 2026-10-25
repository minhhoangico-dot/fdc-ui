import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RadioGroup } from './RadioGroup';

const options = [
  { value: 'self', label: 'Cho tôi' },
  { value: 'relative', label: 'Cho người thân', description: 'Ví dụ: bố mẹ' },
];

describe('RadioGroup', () => {
  it('is a labelled group of radios with descriptions linked', () => {
    render(<RadioGroup label="Bạn đặt lịch cho ai?" name="who" options={options} />);
    expect(screen.getByRole('group', { name: 'Bạn đặt lịch cho ai?' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Cho người thân' })).toHaveAccessibleDescription('Ví dụ: bố mẹ');
  });

  it('selects and reports the value', async () => {
    const onValueChange = vi.fn();
    render(<RadioGroup label="Ai?" name="who" options={options} onValueChange={onValueChange} />);
    await userEvent.click(screen.getByText('Cho người thân'));
    expect(screen.getByRole('radio', { name: 'Cho người thân' })).toBeChecked();
    expect(onValueChange).toHaveBeenCalledWith('relative');
  });

  it('renders the legend as the page h1 when asked, and links errors', () => {
    render(<RadioGroup label="Bạn đặt lịch cho ai?" name="who" options={options} legendAsHeading error="Chọn người đi khám" id="who" />);
    expect(screen.getByRole('heading', { level: 1, name: 'Bạn đặt lịch cho ai?' })).toBeInTheDocument();
    expect(document.getElementById('who')).toHaveAttribute('value', 'self');
    expect(screen.getByRole('group')).toHaveAccessibleDescription(/Lỗi: Chọn người đi khám/);
  });
});

describe('RadioGroup v2.1', () => {
  it('reports an error once for the whole group: one message, linked to the fieldset, no per-option errors', () => {
    const { container } = render(
      <RadioGroup
        label="8. Tăng huyết áp (I10)"
        name="q8"
        layout="row"
        error="Chọn Không hoặc Có"
        options={[
          { value: 'khong', label: 'Không' },
          { value: 'co', label: 'Có' },
        ]}
      />,
    );
    const group = screen.getByRole('group', { name: '8. Tăng huyết áp (I10)' });
    expect(screen.getAllByText('Chọn Không hoặc Có')).toHaveLength(1);
    expect(group).toHaveAttribute('data-invalid', 'true');
    expect(group).toHaveAccessibleDescription('Lỗi: Chọn Không hoặc Có');
    // The options themselves carry no error text and no error styling hook.
    expect(container.querySelectorAll('[data-invalid]')).toHaveLength(1);
    for (const radio of screen.getAllByRole('radio')) expect(radio).not.toHaveAccessibleDescription();
  });

  it('marks row layout and compact density, and arrow keys still move the choice', async () => {
    const onValueChange = vi.fn();
    render(
      <RadioGroup
        label="Phân loại sức khỏe"
        name="loai"
        layout="row"
        density="compact"
        onValueChange={onValueChange}
        options={['I', 'II', 'III', 'IV', 'V'].map((v) => ({ value: v, label: v }))}
      />,
    );
    const group = screen.getByRole('group', { name: 'Phân loại sức khỏe' });
    expect(group).toHaveAttribute('data-layout', 'row');
    expect(group).toHaveAttribute('data-density', 'compact');
    await userEvent.click(screen.getByRole('radio', { name: 'I' }));
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('radio', { name: 'II' })).toBeChecked();
    expect(onValueChange).toHaveBeenLastCalledWith('II');
  });

  it('defaults to a column of comfortable tiles (the v2 look)', () => {
    render(<RadioGroup label="Bạn đặt lịch cho ai?" name="who" options={[{ value: 'self', label: 'Cho tôi' }]} />);
    const group = screen.getByRole('group');
    expect(group).toHaveAttribute('data-layout', 'column');
    expect(group).toHaveAttribute('data-density', 'comfortable');
  });
});

