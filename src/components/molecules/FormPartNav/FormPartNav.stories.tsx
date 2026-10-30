import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { FormPartNav, type FormPartNavItem } from './FormPartNav';

/** The seven parts of the hồ sơ khám sức khỏe form, as in the result-entry page. */
const parts: FormPartNavItem[] = [
  { label: '1. Hành chính', href: '#hanh-chinh', done: true },
  { label: '2. Lần khám', href: '#lan-kham', done: true },
  { label: '3. Tiền sử', href: '#tien-su', count: 'còn 17' },
  { label: '4. Thể lực', href: '#the-luc', count: 'còn 2', current: true },
  { label: '5. Lâm sàng', href: '#lam-sang', count: 'còn 25' },
  { label: '6. Cận lâm sàng', href: '#can-lam-sang', done: true, sub: '12 chỉ số từ HIS, 09:12' },
  { label: '7. Kết luận', href: '#ket-luan', count: 'còn 2' },
];

const meta = {
  title: 'Molecules/FormPartNav',
  component: FormPartNav,
  parameters: { density: 'compact' },
  args: { items: parts },
} satisfies Meta<typeof FormPartNav>;
export default meta;
type Story = StoryObj<typeof meta>;

/** From 1024px up: the full list in StaffLayout's side column (17.5rem); the current part is filled with a brand bar. */
export const Desktop: Story = {
  decorators: [
    (Story) => (
      <div style={{ maxInlineSize: '17.5rem' }}>
        <Story />
      </div>
    ),
  ],
};

/** On a phone only the toggle shows, "4. Thể lực · còn 2", so the form starts near the top of the screen. */
export const Phone: Story = { parameters: { viewport: { defaultViewport: 'mobile1' } } };

/** The toggle opens the list under itself; choosing a part closes it. */
export const PhoneOpen: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // From 1024px up the list is always shown and the toggle is hidden: nothing to open.
    const toggle = canvas.queryByRole('button', { name: '4. Thể lực · còn 2' });
    if (!toggle) return;
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  },
};

/** One part needs fixing: red words in the list ("1 cần sửa"), and the closed phone toggle repeats it. */
export const OneProblem: Story = {
  args: { items: parts.map((p) => (p.label === '3. Tiền sử' ? { ...p, problem: '1 cần sửa' } : p)) },
};
