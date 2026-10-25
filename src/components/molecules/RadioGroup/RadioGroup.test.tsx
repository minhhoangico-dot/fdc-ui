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
