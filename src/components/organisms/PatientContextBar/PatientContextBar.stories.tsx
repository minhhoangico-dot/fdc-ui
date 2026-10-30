import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';
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
    // Short visible words; the name adds who it goes to. The next arrow sits after the words.
    actions: (
      <>
        <Button icon="simple-left" href="#" aria-label="Người trước: Ngô Văn Nam">
          Người trước
        </Button>
        <Button icon="simple-right" iconPosition="end" href="#" aria-label="Người sau: Nguyễn Thị Mai Anh">
          Người sau
        </Button>
      </>
    ),
  },
} satisfies Meta<typeof PatientContextBar>;
export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Facts are whole chunks set apart by space: "Nữ", "Sinh 07/07/1990 (36 tuổi)", "CCCD …0006", "Mã lượt khám RD26-0006",
 * the company. The state sits right after the name; from 40rem the previous/next buttons end the name's row, so at
 * 1024px and up the bar is the breadcrumb, one row with the name and the buttons, and the facts.
 */
export const Default: Story = {};

/** The longest names and companies wrap; each other fact stays whole, and no line starts with stray punctuation. */
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

/**
 * On a phone the name is smaller, the spacing tighter, and "‹ Người trước" / "Người sau ›" share one row of two
 * 44px buttons, each on one line even at 320px.
 */
export const Phone: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const prev = canvas.getByRole('link', { name: 'Người trước: Ngô Văn Nam' });
    const next = canvas.getByRole('link', { name: 'Người sau: Nguyễn Thị Mai Anh' });
    // One line each: as tall as a compact control, not two lines of words.
    for (const b of [prev, next]) await expect(b.getBoundingClientRect().height).toBeLessThan(48);
    await expect(next.lastElementChild?.tagName.toLowerCase()).toBe('svg');
  },
};
