import type { Preview } from '@storybook/react';
import '../src/tokens/tokens.css';
import '../src/styles/base.css';

const preview: Preview = {
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    controls: { matchers: { color: /(background|color)$/i } },
    options: {
      storySort: {
        order: ['Giới thiệu', 'Tokens', 'Layout', 'Atoms', 'Molecules', 'Organisms', 'Templates', 'Pages'],
      },
    },
  },
  globalTypes: {
    theme: {
      description: 'FDC theme',
      defaultValue: 'clinic',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'clinic', title: 'Phòng khám (xanh)' },
          { value: 'nursing-home', title: 'Viện dưỡng lão (cam)' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, ctx) => {
      if (typeof document !== 'undefined') document.documentElement.dataset.theme = ctx.globals.theme;
      return (
        <div data-theme={ctx.globals.theme} style={{ background: 'var(--surface)', color: 'var(--text-default)' }}>
          <Story />
        </div>
      );
    },
  ],
};

export default preview;
