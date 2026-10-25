# Changelog

Versions follow the FDC Medical Group design system in Claude Design (the master). Every new prop is optional: code written for 2.0 keeps working.

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
