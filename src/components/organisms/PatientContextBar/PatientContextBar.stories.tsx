import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../../atoms/Button';
import { StatusTag } from '../../atoms/StatusTag';
import { PatientContextBar } from './PatientContextBar';

const meta = {
  title: 'Organisms/PatientContextBar',
  component: PatientContextBar,
  parameters: { density: 'compact', layout: 'fullscreen' },
  args: {
    name: 'Đặng Thanh Chi',
    sex: 'Nữ',
    birthDate: '07/07/1990',
    ageOn: new Date(2026, 9, 10),
    idEnd: '0006',
    recordCode: 'RD26-0006',
    organization: 'Công ty TNHH Rạng Đông',
    breadcrumb: [
      { label: 'Việc của tôi', href: '#' },
      { label: 'Rạng Đông KSK 2026', href: '#' },
      { label: 'Người 6 / 2.033' },
    ],
    status: <StatusTag>Cần điền · còn 3 mục</StatusTag>,
    actions: (
      <>
        <Button icon="simple-left">Người trước</Button>
        <Button icon="simple-right">Người sau cần làm</Button>
      </>
    ),
  },
} satisfies Meta<typeof PatientContextBar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** The longest names and companies wrap; name, date of birth and code stay whole. */
export const LongName: Story = {
  args: {
    name: 'Tôn Nữ Hoàng Bảo Ngọc Phương Thảo',
    birthDate: '21/12/1978',
    idEnd: '0003',
    recordCode: 'RD26-0003',
    organization: 'Công ty Cổ phần Bóng đèn Phích nước Rạng Đông – Chi nhánh Bắc Ninh',
    status: <StatusTag tone="error">Cần sửa · còn 1 mục</StatusTag>,
  },
};

/** A missing ID is simply left out; nothing says "undefined". */
export const MissingId: Story = { args: { idEnd: undefined, name: 'Nguyễn Thị Mai Anh', birthDate: '29/02/1996', recordCode: 'RD26-0007' } };

export const Phone: Story = { parameters: { viewport: { defaultViewport: 'mobile1' } } };
