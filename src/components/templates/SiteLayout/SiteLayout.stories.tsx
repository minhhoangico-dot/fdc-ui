import type { Meta, StoryObj } from '@storybook/react';
import { clinicFooter, clinicHeader, nursingHomeFooter, nursingHomeHeader } from '../../../fixtures/site';
import { SiteLayout } from './SiteLayout';

const Placeholder = () => (
  <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: 'var(--space-40) var(--space-15)' }}>
    <div style={{ border: '1px dashed var(--border-control)', padding: 'var(--space-40)', color: 'var(--text-muted)' }}>Nội dung trang</div>
  </div>
);

const meta = {
  title: 'Templates/SiteLayout',
  component: SiteLayout,
  parameters: { layout: 'fullscreen' },
  args: { header: clinicHeader, footer: clinicFooter, children: <Placeholder /> },
} satisfies Meta<typeof SiteLayout>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Clinic: Story = {};
export const NursingHome: Story = { args: { theme: 'nursing-home', header: nursingHomeHeader, footer: nursingHomeFooter } };
