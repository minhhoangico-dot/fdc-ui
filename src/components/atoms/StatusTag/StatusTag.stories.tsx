import type { Meta, StoryObj } from '@storybook/react';
import { StatusTag } from './StatusTag';

const meta = {
  title: 'Atoms/StatusTag',
  component: StatusTag,
  parameters: { density: 'compact' },
  args: { children: 'Chờ gửi', tone: 'info' },
} satisfies Meta<typeof StatusTag>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {};

/** Tinted fills, no dark edges: a tag is a label, never a button. The dot marks a state even in grayscale. */
export const AllTones: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-15)' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-10)', alignItems: 'center' }}>
        <StatusTag>Cần điền</StatusTag>
        <StatusTag tone="muted">Nhập tay</StatusTag>
        <StatusTag tone="info">Chờ gửi · còn 27 giây</StatusTag>
        <StatusTag tone="success">Đã gửi</StatusTag>
        <StatusTag tone="error">Cần sửa</StatusTag>
        <StatusTag tone="attention">Cao</StatusTag>
        <StatusTag tone="strong">Đang làm</StatusTag>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-10)', alignItems: 'center' }}>
        <StatusTag size="sm">Cần điền</StatusTag>
        <StatusTag tone="muted" size="sm">
          Nhập tay
        </StatusTag>
        <StatusTag tone="info" size="sm">
          Chờ gửi
        </StatusTag>
        <StatusTag tone="success" size="sm">
          Đã gửi
        </StatusTag>
        <StatusTag tone="error" size="sm">
          Cần sửa
        </StatusTag>
        <StatusTag tone="attention" size="sm">
          Thấp
        </StatusTag>
        <StatusTag tone="strong" size="sm">
          Đang làm
        </StatusTag>
      </div>
    </div>
  ),
};

/**
 * A result outside the normal range: amber "Cao" / "Thấp" (attention), not the error red,
 * which is kept for something that must be fixed. The source sits next to it, muted.
 */
export const AbnormalValue: Story = {
  render: () => (
    <dl style={{ display: 'grid', gridTemplateColumns: 'max-content 1fr', gap: 'var(--space-10) var(--space-20)', margin: 0, fontSize: '1rem' }}>
      <dt>Huyết áp</dt>
      <dd style={{ margin: 0, display: 'flex', gap: 'var(--space-10)', alignItems: 'center', flexWrap: 'wrap' }}>
        <strong>150/95 mmHg</strong>
        <StatusTag tone="attention" size="sm">
          Cao
        </StatusTag>
        <StatusTag tone="muted" size="sm">
          Nhập tay
        </StatusTag>
      </dd>
      <dt>Glucose</dt>
      <dd style={{ margin: 0, display: 'flex', gap: 'var(--space-10)', alignItems: 'center' }}>
        <strong>3,2 mmol/L</strong>
        <StatusTag tone="attention" size="sm">
          Thấp
        </StatusTag>
      </dd>
      <dt>Chiều cao</dt>
      <dd style={{ margin: 0 }}>
        <strong>162 cm</strong>
      </dd>
    </dl>
  ),
};
