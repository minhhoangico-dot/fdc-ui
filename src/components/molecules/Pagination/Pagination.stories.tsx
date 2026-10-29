import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Pagination } from './Pagination';

const meta = {
  title: 'Molecules/Pagination',
  component: Pagination,
  parameters: { density: 'compact' },
  args: { page: 1, pageSize: 50, total: 2033, itemLabel: 'người', getHref: (p: number) => `#trang-${p}` },
} satisfies Meta<typeof Pagination>;
export default meta;
type Story = StoryObj<typeof meta>;

/** First page: "Trước" stays in place as plain text. */
export const FirstPage: Story = {};
export const MiddlePage: Story = { args: { page: 12 } };
export const LastPage: Story = { args: { page: 41 } };
/** One page: only the count. */
export const SinglePage: Story = { args: { total: 13 } };

/** Buttons when pages have no address; the range is announced when it changes. */
export const WithButtons: Story = {
  args: { getHref: undefined },
  render: (args) => {
    const [page, setPage] = useState(1);
    return <Pagination {...args} page={page} onPageChange={setPage} />;
  },
};
