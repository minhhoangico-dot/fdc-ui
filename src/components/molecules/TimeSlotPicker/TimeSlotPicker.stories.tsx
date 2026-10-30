import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from '@storybook/test';
import { TimeSlotPicker, type TimeSlot } from './TimeSlotPicker';

const day: TimeSlot[] = [
  { time: '07:30' }, { time: '08:00', taken: true }, { time: '08:30' }, { time: '09:00', taken: true },
  { time: '09:30' }, { time: '10:00' }, { time: '10:30', taken: true }, { time: '14:00' }, { time: '14:30' }, { time: '15:00' },
];

const meta = {
  title: 'Molecules/TimeSlotPicker',
  component: TimeSlotPicker,
  tags: ['beta'],
  args: { label: 'Chọn giờ khám, thứ Bảy 24/10', slots: day, onValueChange: fn() },
  decorators: [(Story) => <div style={{ maxWidth: 560 }}><Story /></div>],
} satisfies Meta<typeof TimeSlotPicker>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Selected: Story = { args: { defaultValue: '09:30' } };
/** One message and one red bar for the group; the slots keep their normal edge; a focused slot takes the dark-ink ring. */
export const Error: Story = {
  args: { error: 'Chọn một giờ khám còn trống' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const group = canvas.getByRole('group', { name: 'Chọn giờ khám, thứ Bảy 24/10' });
    const red = getComputedStyle(group.querySelector('[data-part="error"]')!).color;
    await expect(getComputedStyle(group).borderInlineStartWidth).toBe('3px');
    await expect(getComputedStyle(group).borderInlineStartColor).toBe(red);
    for (const slot of group.querySelectorAll('label')) {
      await expect(getComputedStyle(slot).borderTopColor).not.toBe(red);
      await expect(getComputedStyle(slot).boxShadow).toBe('none');
    }
    await userEvent.tab();
    const focused = canvas.getByRole('radio', { name: '07:30' });
    await expect(focused).toHaveFocus();
    await expect(getComputedStyle(focused.closest('label')!).outlineColor).toBe(getComputedStyle(group.querySelector('legend')!).color);
  },
};
export const FullyBooked: Story = { args: { slots: day.map((s) => ({ ...s, taken: true })) } };
export const PhoneWidth: Story = { parameters: { viewport: { defaultViewport: 'mobile1' } } };
export const PickWithMouse: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('radio', { name: '09:30' }));
    await expect(args.onValueChange).toHaveBeenCalledWith('09:30');
    await expect(canvas.getByRole('radio', { name: /08:00/ })).toBeDisabled();
  },
};
