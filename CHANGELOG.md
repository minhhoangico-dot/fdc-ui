# Changelog

Versions follow the FDC Medical Group design system in Claude Design (the master). Every new prop is optional: code written for 2.0 keeps working.

## 2.4.0 — 2026-10-30

Answers to an outside review of the 2.3 staff screens by ChatGPT and Gemini (business rules first, then looks and phones). Every finding was checked against the code before acting; one was wrong (table cells were already top-aligned) and was not changed.

### Business rules (the costly ones)
- **Send outcomes split.** "Gửi lỗi" is now "Bị từ chối" (the department refused and gave a reason: fix, then resend) and "Chưa rõ kết quả" (no answer: the department may already hold the record, so check the status or ask Minh, never "Gửi lại"). "Đã gửi lên Sở" is renamed "Sở đã tiếp nhận", "Bộ đã nhận" "Bộ đã xác nhận". Master README states table updated.
- **Conflicts are never shown as saved.** SaveStatus `conflict`: "Cần xử lý 1 giá trị trước khi lưu", amber; the save button explains why it cannot save until a value is chosen.
- **Sending never blocks the next person.** During "Chờ gửi" the review page offers "Sang người sau cần làm"; the next person's page shows "Ngô Văn Nam: chờ gửi lên Sở · còn 22 giây" with "Hủy gửi"; the list finds records waiting to be sent.
- **Several diagnoses and the doctor's words.** New CodeList (name first, code after, add and remove) plus a free-text field for the wording on the paper form.
- **The step line tells the truth.** "Sở đã tiếp nhận" ✓ with its code; "Chờ Bộ xác nhận" is an outline, never a filled pill that looks finished.

### New components
- **Checkbox** and **Select** (atoms). The review page's tick box is now a system component; the list filter collapses into a Select on phones.
- **CodeList** (molecule): several coded items for one question.
- **FormPartNav** (molecule): the parts of a long form; full side list from 1024px, one "4. Thể lực · còn 2" toggle on phones.

### Changes
- **Tokens 2.4:** `success-50`, `danger-50` with roles `status-success-bg`, `status-error-bg`. Contrast matrix 88 pairs per theme (176), all passing. The lint forbids `success-*` and `danger-*` in components.
- **StatusTag:** tinted fills with a dot, never a dark edge (tags no longer look like buttons), weight 500; new tone `attention` (amber) for values outside the normal range; long tags wrap instead of overflowing.
- **NumberField:** "Cao"/"Thấp" use `attention`, not red. The hint says only what helps: "Chưa điền · ví dụ 78" while empty, only "ví dụ 78" next to an error or while typing, nothing once filled and left.
- **FormNotice:** a sign per type ("!", "i", "✓") as well as color (the nursing-home orange sits close to red and amber); boxed notices tinted by type; `text` may be rich; `live={false}` for countdowns.
- **ConfirmationPanel:** `emphasis="subtle"` for staff screens; done steps ✓, the waited-for step outlined; the arrow ends a step so a wrapped line never starts with "→".
- **RadioGroup:** `variant="pills"` for list filters; `row` options never shrink below their words.
- **ErrorSummary:** `layout="inline"` keeps the form in view on staff screens.
- **DataTable:** `stackBelow="phone"` shows each record as a block (explicit ARIA roles), slightly tighter rows.
- **PatientContextBar:** facts set apart by space, not "·" ("Sinh 07/07/1990 (36 tuổi)", "CCCD …0006", "Mã lượt khám RD26-0006"); smaller and tighter on phones with the two buttons on one row; `variant="block"`; the breadcrumb collapses to "‹ parent" on phones.
- **Breadcrumb:** the "›" ends an item; `collapseOnPhone`.
- **TextField:** read-only fields (BMI) look read-only. **Kbd:** lighter keycaps. **FieldRow:** aligns Combobox and Select too (it skipped Combobox in 2.3). **StaffLayout:** tighter rhythm on phones. **Header** compact: the menu button keeps "Menu" when open, so the bar stays one row at 320px.
- `formatViNumber(n, decimals, minDecimals)` for fixed decimals ("21,0").

### Sample pages
- **Danh sách hồ sơ:** search under the title; filter pills on desktop, a Select on phones; records as blocks on phones; every typed word must match; near-duplicate "Phạm Văn Năm" and a hint when matches sit in another group; mode "Bạn nhập liệu · Minh duyệt gửi"; the header says which batch auto-send runs for.
- **Nhập kết quả:** FormPartNav; conflict state; "Lưu lại" after a failure (no second retry button); "Đến mục còn thiếu"; BMI read-only "21,0"; blood pressure as one group; inline error summary; CodeList and the doctor's words; multiline advice; new stories MatMangChuaLuu and SauKhiGui.
- **Xem lại trước khi gửi:** SoDaTiepNhan, BiTuChoi, ChuaRoKetQua (no resend) replace DaGuiLenSo and GuiLoi; "Sang người sau cần làm" during the undo window; the stale notice names the change ("Cân nặng 52,5 → 53 kg"); HIS source next to the lab row; the tick box names what to compare.

### Process
- **Usability test protocol** `docs/usability-test-v2.4.md` (Vietnamese): one 60–75 minute session per staff member, eight tasks on the sample pages, timings, errors, understanding of states, Giữ / Sửa / Làm lại thresholds.
- The visual review no longer reports text inside a visually hidden table header as clipped (skill fix).

### Decisions kept open for Minh
- Dashed edge for unavailable buttons: kept (approved 25/10); a reviewer read it as a drop zone.
- Normal ranges and any confirmation for very abnormal values: example ranges only; a doctor sets them.

## 2.3.0 — 2026-10-29

Three sample staff screens from the hoso app, and the components they needed. Tokens: no value changes (version only).

### Sample pages (Storybook › Pages › Nhân viên, mock data)
- **Danh sách hồ sơ**: 2.033 people, 50 a page; filter by group with counts; search by STT, record code, name or the last four ID digits, without tone marks. States: long names, a missing ID, a record open on another computer, nothing found, loading, no network, phone.
- **Nhập kết quả**: part 4 (Thể lực) and part 7 (Kết luận). Measurements with units, "Cao" next to out-of-range values, "ô chưa lưu" vs "mục còn thiếu" kept apart, the main button changing with the moment (Lưu → Tiếp tục điền → Xem lại trước khi gửi), Ctrl + S and Ctrl + Enter, a failed save, two people editing the same field, phone.
- **Xem lại trước khi gửi**: abnormal values first, every part with "Thay đổi" and read-only details, data sources with the "Tôi đã xem phần nhập tay" check, then the send flow: undo window (Chờ gửi · còn 30 giây), Đang gửi, Đã gửi lên Sở with the department's code, refused send, record changed by someone else.

### New components
- **NumberField** (molecule): a number with its unit; decimal comma or dot; range checked on leaving the field; `normalRange` adds a word tag ("Cao", "Thấp"); neutral grey hint when empty.
- **Combobox** (molecule): choose a coded item by name or code (ICD-10, occupations), without tone marks; name first, code after; only list items accepted; ARIA 1.2.
- **SaveStatus** (molecule): unsaved (n ô chưa lưu), saving, saved, failed with "Lưu lại"; the typed data is kept.
- **Pagination** (molecule): "Hiển thị 1–50 trong 2.033 người · ‹ Trước · Trang 1 / 41 · Sau ›"; links or buttons.
- **Breadcrumb** (molecule): "Vị trí" nav for staff pages.
- **DataTable** (organism): captioned table; the name is the row header and its link covers the whole cell; scrolls inside its box on narrow screens (a keyboard-scrollable region only when it overflows); loading, empty and failed states keep the header; Pagination under the rows.
- **PatientContextBar** (organism): name, sex, date of birth with age, last four ID digits, record code, state, previous / next; sticky from 1024px up.
- **StaffLayout** (template): compact density, grey work surface, compact header, context bar, side column, sticky action bar (the one block with a shadow) and a desktop-only shortcuts line; keeps focused fields clear of the sticky bars.
- Utilities: `foldVi` (search without tone marks), `parseViNumber`, `formatViNumber`, `formatViInteger`, `ageFromViDate`.

### Changes
- **TextField**: `unit` (inside the box, read after the label) and `after` (next to the box).
- **RadioGroup**: `layout="wrap"` for filters; `row` options never shrink below their words (they wrap instead of cutting "Loại III").
- **Header** compact with `collapseOnScroll`: sticky only below 1024px; from 1024px up the PatientContextBar sticks instead, so one bar holds the top of the screen.
- Contrast matrix: `status-info-text` on every surface (SaveStatus on the white action bar): 73 pairs per theme, 146 in all.

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
