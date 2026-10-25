import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { clinicHeader, nursingHomeHeader } from '../../../fixtures/site';
import { Header } from './Header';

const meta = {
  title: 'Organisms/Header',
  component: Header,
  tags: ['beta'],
  parameters: { layout: 'fullscreen' },
  args: { ...clinicHeader, items: clinicHeader.items.map((i, n) => (n === 0 ? { ...i, current: true } : i)) },
} satisfies Meta<typeof Header>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Clinic: Story = {};
export const ClinicPhone: Story = { parameters: { viewport: { defaultViewport: 'mobile1' } } };
export const NursingHome: Story = { args: { ...nursingHomeHeader, hours: undefined } };
export const SubmenuOpensOnClick: Story = {
  args: { ...nursingHomeHeader, hours: undefined },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: /Dưỡng lão/ });
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByRole('link', { name: 'Chăm sóc nội trú' })).toBeVisible();
    await userEvent.keyboard('{Escape}');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).toHaveFocus();
  },
};
