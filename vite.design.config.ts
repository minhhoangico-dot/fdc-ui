// Builds the component library as ONE classic script for Claude Design:
// window.FDC = { Button, TextField, … }, reading the page's window.React / window.ReactDOM.
// Run with `npm run build:design`; scripts/design-bundle.mjs then adds the header
// and copies bundle.js, bundle.css and index.d.ts into design/fdc-medical-group/components/.
import { basename, resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    react({ jsxRuntime: 'classic' }),
    dts({
      include: ['src'],
      exclude: ['src/**/*.stories.tsx', 'src/**/*.test.ts*', 'src/test', 'src/pages', 'src/fixtures', 'src/docs'],
      outDir: 'dist-design/types',
      entryRoot: 'src',
    }),
  ],
  define: { 'process.env.NODE_ENV': JSON.stringify('production') },
  css: {
    modules: {
      // Readable, stable class names in Claude Design (fdc-Button-Button), still scoped.
      generateScopedName: (local: string, filename: string) => `fdc-${basename(filename).split('.')[0]}-${local}`,
    },
  },
  build: {
    outDir: 'dist-design',
    emptyOutDir: true,
    cssCodeSplit: false,
    minify: true,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'FDC',
      formats: ['iife'],
      fileName: () => 'bundle.js',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: { react: 'React', 'react-dom': 'ReactDOM', 'react/jsx-runtime': 'React' },
        assetFileNames: 'bundle.[ext]',
      },
    },
  },
});
