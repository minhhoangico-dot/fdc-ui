import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-a11y'],
  framework: { name: '@storybook/react-vite', options: {} },
  docs: { defaultName: 'Tài liệu' },
  // The library build's type-declaration plugin is not needed in Storybook.
  viteFinal: async (cfg) => ({
    ...cfg,
    plugins: (cfg.plugins ?? []).flat().filter((p) => !(p && typeof p === 'object' && 'name' in p && p.name === 'vite:dts')),
  }),
};

export default config;
