#!/usr/bin/env node
// After `vite build -c vite.design.config.ts`: adds Claude Design's bundle header,
// checks the bundle is safe to inline, and copies bundle.js, bundle.css and the
// type declarations into design/fdc-medical-group/components/ for publishing.
import { createHash } from 'node:crypto';
import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'design/fdc-medical-group/components');
mkdirSync(out, { recursive: true });

const js = readFileSync(join(root, 'dist-design/bundle.js'), 'utf8');
const css = readFileSync(join(root, 'dist-design/bundle.css'), 'utf8');
for (const [name, text, bad] of [
  ['bundle.js', js, /<\/script|<!--/i],
  ['bundle.css', css, /<\/style/i],
]) {
  if (bad.test(text)) throw new Error(`${name} contains a sequence that would break inlining (${bad}).`);
}

// Component order for the Claude Design catalogue: the library's PascalCase exports.
const indexSrc = readFileSync(join(root, 'src/index.ts'), 'utf8');
const names = [...indexSrc.matchAll(/components\/\w+\/(\w+)'/g)].map((m) => m[1]).filter((n) => n !== 'VisuallyHidden');
const header = `/* @ds-bundle: ${JSON.stringify({ format: 4, namespace: 'FDC', components: names.map((name) => ({ name })) })} */\n`;

// Release stamp: which library version and which tokens this bundle was built against.
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const tokensText = readFileSync(join(root, 'design/fdc-medical-group/tokens.json'), 'utf8');
const tokensVersion = JSON.parse(tokensText).version;
const tokensSha = createHash('sha256').update(tokensText).digest('hex').slice(0, 16);
const stamp = `/* fdc-ui ${pkg.version} · tokens ${tokensVersion} (tokens.json sha256 ${tokensSha}) */\n`;

writeFileSync(join(out, 'bundle.js'), header + stamp + js);
writeFileSync(join(out, 'bundle.css'), stamp + css);
writeFileSync(join(out, 'index.d.ts'), typesDoc());
console.log(`Claude Design bundle: ${names.length} components, ${(js.length / 1024).toFixed(1)} KB js, ${(css.length / 1024).toFixed(1)} KB css → design/fdc-medical-group/components/`);

// Claude Design reads index.d.ts as documentation (props per component), not for type-checking,
// so the per-file declarations are stitched into one readable file in atomic order.
function typesDoc() {
  const typesRoot = join(root, 'dist-design/types');
  const files = [];
  const walk = (d) => {
    for (const e of readdirSync(d)) {
      const p = join(d, e);
      if (statSync(p).isDirectory()) walk(p);
      else if (p.endsWith('.d.ts') && !p.endsWith('index.d.ts')) files.push(p);
    }
  };
  walk(typesRoot);
  const order = ['utils', 'layout', 'atoms', 'molecules', 'organisms', 'templates'];
  const rank = (p) => order.findIndex((o) => p.includes(`/${o}/`));
  files.sort((a, b) => rank(a) - rank(b) || a.localeCompare(b));
  const body = files
    .map((f) => {
      if (f.endsWith('/icons.d.ts')) {
        // The path data is not documentation; list the names instead.
        const iconNames = [...readFileSync(join(root, 'src/components/atoms/Icon/icons.ts'), 'utf8').matchAll(/^\s+"([\w-]+)":/gm)].map((m) => m[1]);
        return `/* ===== components/atoms/Icon/icons ===== */\nexport type IconName = ${iconNames.map((n) => `'${n}'`).join(' | ')};\nexport declare const iconNames: IconName[];`;
      }
      const text = readFileSync(f, 'utf8')
        .split('\n')
        .filter((l) => !/^import\s/.test(l) && l.trim() !== 'export {};')
        .join('\n')
        .trim();
      return `/* ===== ${relative(typesRoot, f).replace(/\.d\.ts$/, '')} ===== */\n${text}`;
    })
    .join('\n\n');
  return `import * as React from 'react';\n\n/** FDC Medical Group components — window.FDC in Claude Design, @fdc/ui in code. */\n\n${body}\n`;
}
