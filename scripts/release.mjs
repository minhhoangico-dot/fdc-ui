#!/usr/bin/env node
// One release = one library version + one tokens version, checked together and published together.
//   npm run release              all checks, build the Claude Design bundle, write release.json (the manifest)
//   npm run release -- --review  also run the visual review (slow)
//   npm run release -- --verify <dir>
//        after publishing: <dir> holds files read back from Claude Design (project/…); every file in the
//        manifest must match byte for byte, or the release did not land.
import { execSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const ds = join(root, 'design/fdc-medical-group');
const args = process.argv.slice(2);
const sha = (p) => createHash('sha256').update(readFileSync(p)).digest('hex');
const manifestPath = join(ds, 'release.json');
// Files whose published copy must equal the local one (paths as published under project/).
const FILES = ['tokens.json', 'README.md', 'components/bundle.js', 'components/bundle.css', 'components/index.d.ts'];

const vi = args.indexOf('--verify');
if (vi > -1) {
  const dir = args[vi + 1];
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  let bad = 0;
  for (const [file, want] of Object.entries(manifest.files)) {
    const p = join(dir, 'project', file);
    const got = existsSync(p) ? sha(p) : 'missing';
    const ok = got === want;
    if (!ok) bad++;
    console.log(`${ok ? 'ok  ' : 'DIFF'} ${file}${ok ? '' : `  (published ${got.slice(0, 16)}, release ${want.slice(0, 16)})`}`);
  }
  console.log(bad ? `\n${bad} file(s) differ: release ${manifest.version} did not land as built.` : `\nRelease ${manifest.version} verified: Claude Design matches the build.`);
  process.exit(bad ? 1 : 0);
}

const run = (label, cmd) => {
  process.stdout.write(`→ ${label}\n`);
  execSync(cmd, { cwd: root, stdio: 'inherit' });
};

const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const tokens = JSON.parse(readFileSync(join(ds, 'tokens.json'), 'utf8'));
const [maj, min] = pkg.version.split('.');
if (`${maj}.${min}` !== String(tokens.version) && `${maj}` !== String(tokens.version)) {
  console.error(`FAIL: fdc-ui ${pkg.version} does not match tokens version ${tokens.version}. Sync tokens from Claude Design or bump the package.`);
  process.exit(1);
}

run('tokens.css matches tokens.json', 'npm run --silent tokens:check');
run('typecheck, lint, tests, token and level lints, contrast matrix (both themes)', 'npm run --silent check');
run('Claude Design bundle', 'npm run --silent build:design');
run('every preview renders in both themes', 'node scripts/check-design-previews.mjs');
if (args.includes('--review')) run('visual review', 'npm run --silent review:visual');

const files = Object.fromEntries(FILES.map((f) => [f, sha(join(ds, f))]));
const manifest = { version: pkg.version, tokensVersion: tokens.version, date: new Date().toISOString(), files };
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
console.log(`\nRelease ${pkg.version} (tokens ${tokens.version}) ready: design/fdc-medical-group/release.json`);
console.log('Publish design/fdc-medical-group/ to Claude Design (release.json with it, the index last), read the files back, then run:');
console.log('  npm run release -- --verify <readback-dir>');
