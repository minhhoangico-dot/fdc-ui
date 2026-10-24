#!/usr/bin/env node
// Generates src/tokens/tokens.css from the Claude Design master's tokens.json
// (design/fdc-medical-group/tokens.json), in the same shape Claude Design
// compiles it, so component CSS uses identical variable names in Storybook,
// in apps, and in the Claude Design previews.
//
//   node scripts/tokens-from-design.mjs            write src/tokens/tokens.css
//   node scripts/tokens-from-design.mjs --check    exit 1 if the file is stale
//
// Claude Design is the master: edit tokens there, copy tokens.json into
// design/fdc-medical-group/, then run `npm run tokens`. Never edit tokens.css.

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'design/fdc-medical-group/tokens.json');
const out = join(root, 'src/tokens/tokens.css');
const t = JSON.parse(readFileSync(src, 'utf8'));

const themes = t.color.themes.map((th) => th.id);
const first = themes[0];
const cssValue = (v) => (isAlias(v) ? `var(--${v.slice(1, -1)})` : v);
const isAlias = (v) => typeof v === 'string' && /^\{[\w.-]+\}$/.test(v);
// Aliases are re-declared in every theme block: a custom property's var() is
// resolved where it is declared, so an alias declared only on :root would keep
// the first theme's value inside a nested [data-theme] element.
const perTheme = (value, theme) =>
  typeof value === 'object' && value !== null
    ? value[theme] ?? value[first]
    : theme === first || isAlias(value)
      ? value
      : undefined;
const px = (v) => (typeof v === 'number' ? `${v}px` : v);

const lines = [`/* ${t.name} — generated from design/fdc-medical-group/tokens.json by scripts/tokens-from-design.mjs. Do not edit. */`, ''];

// Colors and shadows per theme; later themes only re-declare what differs.
for (const theme of themes) {
  const sel = theme === first ? `:root,\n[data-theme="${theme}"]` : `[data-theme="${theme}"]`;
  const decls = [];
  for (const fam of ['color', 'shadow']) {
    for (const tok of t[fam]?.tokens ?? []) {
      const v = perTheme(tok.value, theme);
      const base = perTheme(tok.value, first);
      if (v === undefined) continue;
      if (theme !== first && v === base && !isAlias(v)) continue;
      decls.push(`  --${tok.name}: ${cssValue(v)};`);
    }
  }
  lines.push(`${sel} {`, ...decls, '}', '');
}

// Theme-independent families.
const flat = [];
for (const [fam, val] of Object.entries(t)) {
  if (['name', 'version', 'meta', 'color', 'shadow', 'type'].includes(fam) || !val?.tokens) continue;
  for (const tok of val.tokens) flat.push(`  --${tok.name}: ${px(tok.value)};`);
}
for (const [key, stack] of Object.entries(t.type.families)) flat.push(`  --font-${key}: ${stack};`);
lines.push(':root {', ...flat, '}', '');

// One class per type style, as Claude Design generates them.
for (const group of t.type.groups) {
  for (const s of group.styles) {
    const fam = s.family ?? group.family;
    lines.push(
      `.${s.name} {`,
      `  font-family: var(--font-${fam});`,
      `  font-size: ${px(s.fontSize)};`,
      ...(s.lineHeight !== undefined ? [`  line-height: ${px(s.lineHeight)};`] : []),
      ...(s.fontWeight !== undefined ? [`  font-weight: ${s.fontWeight};`] : []),
      ...(s.letterSpacing !== undefined ? [`  letter-spacing: ${px(s.letterSpacing)};`] : []),
      '}',
      '',
    );
  }
}

const css = lines.join('\n');
if (process.argv.includes('--check')) {
  let current = '';
  try {
    current = readFileSync(out, 'utf8');
  } catch {
    /* missing counts as stale */
  }
  if (current !== css) {
    console.error('src/tokens/tokens.css is stale. Run: npm run tokens');
    process.exit(1);
  }
  console.log('tokens.css is up to date.');
} else {
  writeFileSync(out, css);
  console.log(`Wrote ${out.replace(root + '/', '')} (${themes.length} themes).`);
}
