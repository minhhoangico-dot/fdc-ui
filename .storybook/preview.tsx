import type { Preview } from '@storybook/react';
import '../src/tokens/tokens.css';
import '../src/tokens/density.css';
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
    density: {
      description: 'Mật độ: comfortable cho bệnh nhân, compact cho nhân viên',
      defaultValue: 'comfortable',
      toolbar: {
        title: 'Mật độ',
        icon: 'component',
        items: [
          { value: 'comfortable', title: 'Thoáng (bệnh nhân)' },
          { value: 'compact', title: 'Gọn (nhân viên)' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, ctx) => {
      const density = ctx.parameters.density ?? ctx.globals.density ?? 'comfortable';
      if (typeof document !== 'undefined') {
        document.documentElement.dataset.theme = ctx.globals.theme;
        document.documentElement.dataset.density = density;
      }
      return (
        <div data-theme={ctx.globals.theme} data-density={density} style={{ background: 'var(--surface)', color: 'var(--text-default)' }}>
          <Story />
        </div>
      );
    },
  ],
};

export default preview;
