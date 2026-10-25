import type { Meta, StoryObj } from '@storybook/react';
import { StatusTag } from './StatusTag';

const meta = {
  title: 'Atoms/StatusTag',
  component: StatusTag,
  args: { children: 'Chờ gửi', tone: 'info' },
} satisfies Meta<typeof StatusTag>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {};

export const AllTones: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-10)', alignItems: 'center' }}>
      <StatusTag>Đã nhập</StatusTag>
      <StatusTag tone="muted">Nhập tay</StatusTag>
      <StatusTag tone="info">Chờ gửi · còn 27 giây</StatusTag>
      <StatusTag tone="strong">Đang làm</StatusTag>
      <StatusTag tone="success">Đã gửi</StatusTag>
      <StatusTag tone="error">Cần sửa</StatusTag>
    </div>
  ),
};

/** sm tags sit next to a value: a result flagged high, typed by hand. */
export const NextToValues: Story = {
  render: () => (
    <dl style={{ display: 'grid', gridTemplateColumns: 'max-content 1fr', gap: 'var(--space-10) var(--space-20)', margin: 0, fontSize: '1rem' }}>
      <dt>Huyết áp</dt>
      <dd style={{ margin: 0, display: 'flex', gap: 'var(--space-10)', alignItems: 'center', flexWrap: 'wrap' }}>
        <strong>150/95 mmHg</strong> <StatusTag tone="error" size="sm">Cao</StatusTag> <StatusTag tone="muted" size="sm">Nhập tay</StatusTag>
      </dd>
      <dt>Glucose</dt>
      <dd style={{ margin: 0, display: 'flex', gap: 'var(--space-10)', alignItems: 'center' }}>
        <strong>3,2 mmol/L</strong> <StatusTag tone="error" size="sm">Thấp</StatusTag>
      </dd>
      <dt>Chiều cao</dt>
      <dd style={{ margin: 0 }}>
        <strong>162 cm</strong>
      </dd>
    </dl>
  ),
};
