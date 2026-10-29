# Changelog

Versions follow the FDC Medical Group design system in Claude Design (the master). Every new prop is optional: code written for 2.0 keeps working.

## 2.2.0 — 2026-10-29

Fixes from Astra's review: contrast, role tokens, fixed status colors, density, record states, and a checkable release.

### Contrast (the check itself was the bug)
- **Contrast is now checked as a matrix**: every text role × every surface it may be placed on, in both themes (70 pairs per theme, 140 in all).
  - The old list held only the pairs someone thought of, so it missed a link on `surface-alt`.
  - Ratios are never rounded up: 4.498:1 now fails.
- `text-link` → `brand-700`:
  - It was 4.498:1 (clinic) and 4.33:1 (nursing home) on `surface-alt`.
  - Now 5.8:1 on `surface-alt` and 6.3:1 on white.
- `leaf-700` (success green) `#577f20` → `#4f7419`:
  - Found by the matrix: it was 4.36:1 on grey and 4.4:1 on the tints.
  - Now ≥ 5.0:1 everywhere.
- New `text-placeholder` (`ink-soft`) and `text-disabled` (`ink-subtle`); placeholders no longer use the disabled grey.

### Tokens: palette → role → component
- 21 new role tokens:
  - text: `text-link-hover`, `text-brand`, `text-brand-strong`, `text-on-footer-muted`;
  - surfaces: `surface-selected`, `surface-tint`, `surface-brand`, `surface-footer`, `surface-inverse`;
  - borders and decoration: `border-brand`, `decor-ring`;
  - actions: `action-primary-bg-active`, `action-secondary-fg`, `action-secondary-edge`;
  - other: `hotline-bg`, `group-accent`, `status-warning-*`, …
- All 47 palette uses in components replaced. `npm run lint:tokens` now fails if a component names a palette token (`brand-*`, `ink*`, `danger`, …).
- Status colors are fixed across themes:
  - `status-info-*` is always blue; it used to turn orange in the nursing-home theme, where orange reads as a warning.
  - New `status-warning-*`, always amber.
  - FormNotice `warning` uses the amber bar.

### Density
- `data-density="compact"` (new `src/tokens/density.css`, shipped with the components): 16px text through the new `font-size-body` token, 44px controls, 1440px container.
- Density is independent of `data-theme`: a nursing-home staff tool is orange and compact.
- Storybook has a "Mật độ" toolbar switch.

### Components
- **FieldRow** (new, layout): fields side by side with labels and inputs aligned through CSS subgrid, even when only some fields have a hint or an error. TextField parts carry `data-part`.
- **ConfirmationPanel**:
  - `steps` take explicit states (`{ label, state: 'done' | 'current' | 'todo' | 'failed' }`), so a later step is never shown as reached because an earlier one succeeded.
  - A failed step is red, underlined and read as "Lỗi: …".
- **Header compact**: the menu and tools join the row only from 1024px, so the bar stays one row on tablets (it wrapped to two rows at 768–900px).
- Control and body text in Button, TextField, RadioGroup, SummaryList, DateInput, TimeSlotPicker, FormNotice, ConfirmationPanel, Dialog, ErrorSummary, ContactForm and BookingStep follow `font-size-body`.

### Guidelines (Claude Design README)
- Atomic levels: "one clear job, reuse what fits, no cycles". The old wording ("only from the level below") contradicted Frost and the code.
- Components use roles, never the palette. The old "always use `brand-*`" sentence is gone.
- A record-state table (Trạng thái nghiệp vụ): label, tone, the event that sets each state, allowed actions, next states.
- Density, and "edges and spacing, not `shadow-card`, on staff screens".

### Release
- `npm run release` runs every check, builds the bundle and writes `design/fdc-medical-group/release.json` (versions + sha256 of each published file).
- The bundle carries a stamp: `fdc-ui 2.2.0 · tokens 2.2 (tokens.json sha256 …)`.
- After publishing, `npm run release -- --verify <readback>` proves Claude Design holds exactly the build.

## 2.1.0 — 2026-10-25

Staff tools, from the hoso health-record app (approved by Minh on 25/10/2026). Replaces the "Proposed for fdc-ui" CSS patches in the hoso design: the app can drop `.fdc-yn` and the Button and RadioGroup overrides.

### Tokens (from Claude Design, version 2.1)
- `status-info-bg` (`brand-50`), `status-info-border` (`brand-600`), `status-info-text` (`brand-800`) for pending work and info tags, in both themes. Text on the background: 6.9:1 clinic, 8.1:1 nursing home.

### New
- **StatusTag** (atom): rounded status label in six tones (neutral, muted, info, strong, success, error) and two sizes (`sm` next to a value: "Cao", "Thấp", "Nhập tay").
- **Kbd** (atom): keyboard key for shortcut hints, `keys={['Ctrl', 'S']}`.

### Changed
- **Button**
  - The secondary button (`neutral`, the default) is now white with a 2px `brand-600` edge drawn inside and `brand-800` text, instead of grey `#e3e3e3`, which looked like the unavailable button. Hover is unchanged.
  - Unavailable buttons have no fill, `ink-subtle` text and a 1px dashed `border-control` edge.
  - New `disabledReason`: shows the reason next to the button and links it with `aria-describedby`. The button uses `aria-disabled` so Tab still reaches it, and clicks do nothing.
- **RadioGroup**
  - Errors show one message and one 3px red bar for the whole group; the options no longer turn red one by one.
  - New `layout="row"` (Không / Có, Loại I–V; the question reads as a label).
  - New `density="compact"` (five short options fit a 360px phone, 44px targets kept).
- **Header**: new `variant="compact"` for staff tools.
  - One row, at most 60px, with `appName`, the menu in the same row and a `tools` slot.
  - On phones the menu and tools sit behind the Menu button.
  - `collapseOnScroll` with `compactBar` keeps who is being worked on in a thin sticky bar.
  - The public two-row header is unchanged.
- **Dialog**
  - New `size="wide"` (about 52rem).
  - New `scrollBody`: the body scrolls with a bottom fade while title and actions stay fixed; it is keyboard-scrollable and named.
- **SummaryList**
  - Rows take read-only `details`, toggled right under the value ("▸ Xem 12 chỉ số" / "▾ Thu gọn 12 chỉ số", `aria-expanded`) and opened across the value and action columns.
  - "Thay đổi" is smaller and quieter (`body-sm`, `text-muted`), still underlined with a 44px target.
- **ConfirmationPanel**
  - New `tone="pending"` (status-info panel, ordinary text; green stays for success).
  - New `steps` + `currentStep` for a short step line.
  - New `headingLevel` for use inside a page that has its own h1.
- **FormNotice**: new `boxed` (1px edge, 6px bar by type) and a `warning` type.

### Checks
- 25 new unit tests, including:
  - Tab reaches a button with `disabledReason` and reads its reason;
  - an invalid RadioGroup has exactly one message;
  - SummaryList details open and close by keyboard.
- Contrast pairs added for every new color pair; all pass in both themes.

## 2.0.0 — 2026-10-25

The v2 accessibility upgrade for older patients (18px body, 48px controls, Be Vietnam Pro, sentence-case buttons), 33 components in both themes, the full booking flow, and the visual review (`npm run review:visual`).
