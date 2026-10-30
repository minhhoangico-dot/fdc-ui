import type { Meta, StoryObj } from '@storybook/react';
import { StatusTag } from './StatusTag';

const meta = {
  title: 'Atoms/StatusTag',
  component: StatusTag,
  parameters: { density: 'compact' },
  args: { children: 'Chờ gửi', tone: 'info' },
  // 'strong' is deprecated (shown as neutral), so it is not offered here.
  argTypes: { tone: { control: 'select', options: ['neutral', 'muted', 'info', 'success', 'error', 'attention'] } },
} satisfies Meta<typeof StatusTag>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {};

const row = { display: 'flex', flexWrap: 'wrap', gap: 'var(--space-10)', alignItems: 'center' } as const;

/**
 * Six tones, all tinted fills with no edge: a tag is a label, never a button, and no tag is solid. The dot marks a
 * state even in grayscale; muted (a source such as "Nhập tay") has none. The words are the record states.
 */
export const AllTones: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-15)' }}>
      <div style={row}>
        <StatusTag>Cần điền</StatusTag>
        <StatusTag tone="muted">Nhập tay</StatusTag>
        <StatusTag tone="info">Đang gửi</StatusTag>
        <StatusTag tone="success">Sở đã tiếp nhận</StatusTag>
        <StatusTag tone="error">Bị từ chối</StatusTag>
        <StatusTag tone="attention">Chưa rõ kết quả</StatusTag>
      </div>
      <div style={row}>
        <StatusTag size="sm">Sẵn sàng xem lại</StatusTag>
        <StatusTag tone="muted" size="sm">
          Nhập tay
        </StatusTag>
        <StatusTag tone="info" size="sm">
          Chờ gửi
        </StatusTag>
        <StatusTag tone="success" size="sm">
          Bộ đã xác nhận
        </StatusTag>
        <StatusTag tone="error" size="sm">
          Cần sửa
        </StatusTag>
        <StatusTag tone="attention" size="sm">
          Cao
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

/**
 * A long tag in a narrow column wraps inside its pill; the dot stays on the first line, beside the first word,
 * rather than floating between the lines.
 */
export const LongTagWraps: Story = {
  render: () => (
    <div style={{ inlineSize: '8.5rem' }}>
      <StatusTag tone="attention" size="sm">
        Chưa rõ kết quả sau 10 phút
      </StatusTag>
    </div>
  ),
};
