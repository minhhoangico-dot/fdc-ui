#!/usr/bin/env node
// Renders every Claude Design preview (design/fdc-medical-group/components/*/preview.html)
// the way Claude Design's frame does: React 18 UMD, tokens.css, bundle.css and bundle.js
// preloaded, data-theme on <html>. Fails on console errors, page errors, empty cards or
// horizontal overflow. Images under /_blob/ live only in Claude Design, so their 404s are ignored.
//   node scripts/check-design-previews.mjs [--shots <dir>]
import { readdirSync, readFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

// Playwright is resolved from the environment (not a project dependency).
const { chromium } = createRequire(import.meta.url)('playwright');

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const comp = join(root, 'design/fdc-medical-group/components');
const shotsIdx = process.argv.indexOf('--shots');
const shots = shotsIdx > -1 ? process.argv[shotsIdx + 1] : null;
if (shots) mkdirSync(shots, { recursive: true });

const read = (p) => readFileSync(join(root, p), 'utf8');
const head = `
<style>${read('src/tokens/tokens.css')}</style>
<style>${read('design/fdc-medical-group/components/bundle.css')}</style>
<script>${read('node_modules/react/umd/react.production.min.js')}</script>
<script>${read('node_modules/react-dom/umd/react-dom.production.min.js')}</script>
<script>${read('design/fdc-medical-group/components/bundle.js')}</script>`;

const browser = await chromium.launch();
let failures = 0;
for (const theme of ['clinic', 'nursing-home']) {
  for (const name of readdirSync(comp).filter((n) => existsSync(join(comp, n, 'preview.html')))) {
    const page = await browser.newPage({ viewport: { width: 1000, height: 800 } });
    const errors = [];
    page.on('console', (m) => m.type() === 'error' && !/Failed to load resource/.test(m.text()) && errors.push(m.text()));
    page.on('requestfailed', (r) => !r.url().includes('/_blob/') && errors.push(`request failed: ${r.url()}`));
    page.on('response', (r) => r.status() >= 400 && !r.url().includes('/_blob/') && errors.push(`HTTP ${r.status()}: ${r.url()}`));
    page.on('pageerror', (e) => errors.push(String(e)));
    const body = readFileSync(join(comp, name, 'preview.html'), 'utf8');
    await page.setContent(`<!doctype html><html data-theme="${theme}"><head><meta charset="utf-8">${head}</head><body style="margin:0">${body}</body></html>`);
    await page.waitForTimeout(150);
    const { empty, overflow } = await page.evaluate(() => {
      const r = document.getElementById('root') || document.querySelector('.cover');
      const doc = document.documentElement;
      return { empty: !r || r.getBoundingClientRect().height < 20, overflow: doc.scrollWidth > doc.clientWidth + 1 };
    });
    if (errors.length || empty || overflow) {
      failures++;
      console.log(`FAIL ${theme} ${name}: ${empty ? 'empty render ' : ''}${overflow ? 'horizontal overflow ' : ''}${errors.slice(0, 2).join(' | ')}`);
    } else console.log(`ok   ${theme} ${name}`);
    if (shots) await page.screenshot({ path: join(shots, `${name}-${theme}.png`), fullPage: true });
    await page.close();
  }
}
await browser.close();
console.log(failures ? `\n${failures} preview(s) failed.` : '\nAll previews render.');
process.exit(failures ? 1 : 0);
