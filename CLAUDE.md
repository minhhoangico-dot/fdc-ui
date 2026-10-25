# FDC UI — instructions for Claude

This repo is the code side of the **FDC Medical Group design system**: the family-doctor clinic (Phòng khám Bác sĩ Gia đình, bacsigiadinhhanoi.vn) and the nursing home (Điều dưỡng FDC, fdcmedical.vn). Any design or UI work for FDC starts here.

## Always
- **Use the `atomic-design-system` skill** (`.claude/skills/atomic-design-system/`) for every UI, component, token, screen or review task. Read its `references/brands/fdc.md` first: colors, fonts, sizes for older users, Vietnamese locale and copy.
- **Claude Design is the master** for tokens and guidelines: [FDC Medical Group](https://claude.ai/artifact/EZhBJY8xppjGRBpCyPV1PG). `design/fdc-medical-group/tokens.json` is its copy. Never edit `src/tokens/tokens.css` by hand; run `npm run tokens`.
- **Build in both themes**: `data-theme="clinic"` (blue) and `data-theme="nursing-home"` (orange).
- **Patients and families first**: 18px body text, 48px controls, 44px tap targets, one question per page, the hotline as visible text, Vietnamese copy with sentence-case labels.
- **After UI changes, review what was built**: run `npm run check`, then `npm run review:visual`, or use the `design-review` agent (`.claude/agents/design-review.md`) for an independent, read-only review with screenshots. Done means 0 Blockers.

## Commands
| Command | What it does |
|---|---|
| `npm run storybook` | Component catalogue on :6006 (theme switch in the toolbar) |
| `npm run check` | Typecheck, lint, unit tests, tokens in sync, token/level lints, contrast in both themes |
| `npm run review:visual` | Builds Storybook and measures every story at 320/390/768/1280 in both themes (overflow, tap-target size, text size, focus, axe); writes `visual-review/report.md` |
| `npm run tokens` | Regenerates `src/tokens/tokens.css` from the master copy |
| `npm run build:design` then `node scripts/check-design-previews.mjs` | Builds the `window.FDC` bundle for Claude Design and checks every preview card |
| `node .claude/skills/atomic-design-system/scripts/scaffold.mjs <Name> --level <level> --dir src/components --prefix fdc` | New component from the template |

## Sync
- **Tokens: Claude Design → code.** Read the master's `tokens.json` into `design/fdc-medical-group/`, run `npm run tokens`, then `npm run contrast`.
- **Components: code → Claude Design.** `npm run build:design` and the preview check, then publish the changed `design/fdc-medical-group/` files to the master, with the index (`design-system.json`, new `lastChange`) last.
- **Skill: plugin repo → here.** The skill and agent in `.claude/` are copied from [minhhoangico-dot/atomic-design-system](https://github.com/minhhoangico-dot/atomic-design-system). To update them, clone that repo and run `npm run skill:sync -- <path-to-clone>`. Improvements to the skill itself go to that repo first, so other brands get them too.
