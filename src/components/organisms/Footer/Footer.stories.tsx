import type { Meta, StoryObj } from '@storybook/react';
import { clinicFooter, nursingHomeFooter } from '../../../fixtures/site';
import { Footer } from './Footer';

const meta = {
  title: 'Organisms/Footer',
  component: Footer,
  tags: ['beta'],
  parameters: { layout: 'fullscreen' },
  args: clinicFooter,
} satisfies Meta<typeof Footer>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Clinic: Story = {};
export const NursingHome: Story = { args: nursingHomeFooter };
export const Phone: Story = { parameters: { viewport: { defaultViewport: 'mobile1' } } };
