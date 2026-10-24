import type { Preview } from '@storybook/react';
import '../src/tokens/tokens.css';

const preview: Preview = {
  parameters: {
    layout: 'centered',
    controls: { matchers: { color: /(background|color)$/i } },
    backgrounds: {
      default: 'Trắng',
      values: [
        { name: 'Trắng', value: '#FFFFFF' },
        { name: 'Xám nhạt', value: '#F6F6F6' },
        { name: 'Xanh nhạt', value: '#E8F1F8' },
      ],
    },
    options: {
      storySort: { order: ['Giới thiệu', 'Tokens', 'Atoms', 'Molecules', 'Organisms', 'Templates'] },
    },
  },
  globalTypes: {
    scale: {
      description: 'Chế độ cỡ chữ',
      defaultValue: 'default',
      toolbar: {
        title: 'Cỡ chữ',
        icon: 'eye',
        items: [
          { value: 'default', title: 'Tiêu chuẩn' },
          { value: 'senior', title: 'Người cao tuổi (lớn)' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, ctx) => (
      <div className="fdc-root" data-scale={ctx.globals.scale}>
        <Story />
      </div>
    ),
  ],
};

export default preview;
