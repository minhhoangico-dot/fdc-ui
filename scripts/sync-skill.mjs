#!/usr/bin/env node
// Copies the atomic-design-system skill and its design-review agent from the plugin repo
// (minhhoangico-dot/atomic-design-system) into .claude/, so Claude Code loads them whenever
// it works in fdc-ui. The skill's evals stay in the plugin repo.
//   node scripts/sync-skill.mjs <path-to-atomic-design-system-clone>          copy
//   node scripts/sync-skill.mjs <path-to-atomic-design-system-clone> --check  exit 1 if out of date
import { cpSync, existsSync, readdirSync, readFileSync, rmSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const [src, flag] = process.argv.slice(2);
if (!src) {
  console.error('Usage: node scripts/sync-skill.mjs <path-to-atomic-design-system-clone> [--check]');
  process.exit(2);
}
const plugin = join(src, 'plugins/atomic-design-system');
if (!existsSync(join(plugin, 'skills/atomic-design-system/SKILL.md'))) {
  console.error(`Not the plugin repo: ${plugin}/skills/atomic-design-system/SKILL.md is missing.`);
  process.exit(2);
}
const pairs = [
  [join(plugin, 'skills/atomic-design-system'), join(root, '.claude/skills/atomic-design-system')],
  [join(plugin, 'agents'), join(root, '.claude/agents')],
];
const skip = (p) => p.split(/[\\/]/).includes('evals');

function files(dir, base = dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((e) => {
    const p = join(dir, e);
    if (skip(relative(base, p))) return [];
    return statSync(p).isDirectory() ? files(p, base) : [relative(base, p)];
  });
}

if (flag === '--check') {
  const stale = [];
  for (const [from, to] of pairs) {
    const a = files(from), b = new Set(files(to));
    for (const f of a) if (!b.has(f) || !readFileSync(join(from, f)).equals(readFileSync(join(to, f)))) stale.push(relative(root, join(to, f)));
    // Only the skill folder is owned by the sync; other agents in .claude/agents are kept.
    if (to.endsWith('atomic-design-system')) for (const f of b) if (!a.includes(f)) stale.push(`${relative(root, join(to, f))} (extra)`);
  }
  console.log(stale.length ? `Out of date:\n  ${stale.join('\n  ')}` : 'Skill is up to date.');
  process.exit(stale.length ? 1 : 0);
}

for (const [from, to] of pairs) {
  if (to.endsWith('atomic-design-system')) rmSync(to, { recursive: true, force: true });
  cpSync(from, to, { recursive: true, filter: (p) => !skip(relative(from, p)) });
}
console.log(`Copied the skill to .claude/skills/atomic-design-system and the agents to .claude/agents.`);
