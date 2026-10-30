# Changelog

Versions follow the FDC Medical Group design system in Claude Design (the master). Every new prop is optional: code written for 2.0 keeps working.

## 2.4.0 — 2026-10-30

Answers to an outside review of the 2.3 staff screens by ChatGPT and Gemini (business rules first, then looks and phones). Every finding was checked against the code before acting; one was wrong (table cells were already top-aligned) and was not changed. Before release, eight independent reviewers checked the result against each finding, on rendered pages at 320–1280px in both themes and with the keyboard and a screen reader's view (1 Blocker, 11 High, 33 Medium, 38 Nit, and 19 findings only partly fixed); everything they found is fixed below unless listed under "Known and accepted".

### Business rules (the costly ones)
- **Send outcomes split.** "Gửi lỗi" is now "Bị từ chối" (the department refused and gave a reason: fix, then resend) and "Chưa rõ kết quả" (no answer: the department may already hold the record, so check the status or ask Minh, never "Gửi lại"). "Đã gửi lên Sở" as an outcome is "Sở đã tiếp nhận"; "Bộ đã nhận" is "Bộ đã xác nhận". The words are the same in the pages, the fixtures, the component stories, the Claude Design cards and the README states table.
- **Say who sends.** Rạng Đông is sent by hand: the list says "Đợt này gửi tay: chị xem lại rồi tự gửi từng hồ sơ." (plain text, not a tag) and the review page repeats it at the send button. Auto-send runs for one other batch, and the header tag names it, in `info` blue (running is not success). This replaces the 2.4 draft "Bạn nhập liệu · Minh duyệt gửi", which contradicted the page where chị Lan sends herself.
- **Say where the answer lands.** Đang gửi tells staff: accepted → group "Sở đã tiếp nhận"; refused → "Cần điền hoặc sửa" (reason, then sửa → lưu → xem lại → gửi lại); unknown → stays in "Đang gửi". The list groups follow: "Chưa rõ kết quả" sits in Đang gửi and counts in "làm được ngay"; the "Đã gửi" pill is now "Sở đã tiếp nhận" (with Bộ đã xác nhận).
- **Conflicts are never shown as saved.** SaveStatus `conflict`: "Cần xử lý 1 giá trị trước khi lưu", amber with "!". The field is read-only until a value is chosen; Ctrl + S moves focus to the question, never to one answer, and both answers are described by it; "Giữ … của tôi" names the current value.
- **Sending never blocks the next person.** During "Chờ gửi lên Sở" the review page offers "Người sau: Đặng Thanh Chi" (one 44px line from 360px); the next person's page shows "Ngô Văn Nam: chờ gửi lên Sở · còn 22 giây" with "Hủy gửi", then "Mở hồ sơ Ngô Văn Nam" after a cancel and "Xem trạng thái gửi" after the countdown; the list row says "Hủy được đến 09:31:22".
- **Nothing moves while staff work.** Field errors and the error summary are set by "Xem lại" or "Lưu" and stay until the next press (as on GOV.UK); no hint, tag or error appears or disappears on focus, typing or leaving a field. Before, leaving a filled field removed its hint and moved the form 27px between mouse down and up, so the click on the next control was lost.
- **Several diagnoses and the doctor's words.** New CodeList (name first, code after, add and remove) plus a free-text field for the wording on the paper form.
- **The step line tells the truth.** Done steps say what happened with a ✓ ("Sở đã tiếp nhận" with its code); the step waited for says "Chờ Bộ xác nhận" with a clock, never a dashed edge (dashed means an unavailable button); a failed step has a red "!"; each step has a hidden state word for screen readers.

### New components
- **Checkbox** and **Select** (atoms). The review page's tick box is now a system component; the list filter collapses into a Select on phones.
- **CodeList** (molecule): several coded items for one question; says "… (I10) đã có trong danh sách." instead of "Không tìm thấy" for an item already chosen.
- **FormPartNav** (molecule): the parts of a long form; full side list from 1024px, one "4. Thể lực · còn 2" toggle on phones.

### Changes
- **Tokens 2.4:** `success-50`, `danger-50` with roles `status-success-bg`, `status-error-bg`. The lint forbids `success-*` and `danger-*` in components. Contrast matrix 92 pairs per theme (184), all passing, now including the white signs in their circles and the step colours on the error and attention panels.
- **StatusTag:** tinted fills with a dot, never an edge, weight 500; new tone `attention` (amber) for values outside the normal range; `muted` is a grey tint with no edge; `strong` is deprecated (drawn as neutral, removed in 3.0), so no tag is solid; long tags wrap with the dot on the first line.
- **NumberField:** "Cao"/"Thấp" use `attention`, not red. One message line above the box that keeps its room: "Chưa điền" while empty, "ví dụ 78" while the field has focus, nothing once filled and left, "Cao · bình thường 60–100" when outside the normal range, "! Điền mạch" for an error (the page's text as given). The tag never sits beside the box, so a saved 112 or 145 is never clipped and boxes in a column keep one right edge. The range is checked before the decimals; own errors fit one line of a 9rem column with the sign ("Từ 30 đến 250", "Chỉ nhập số", "Chỉ số nguyên", "Chỉ 1 số lẻ"). New stories SavedOutsideNormal, SavedOutsideNormalNarrow, TypeAndLeave, OneLineInNarrowColumns.
- **Field errors look the same everywhere:** TextField, NumberField, PhoneInput, DateInput, Select, Combobox, CodeList, RadioGroup, Checkbox and TimeSlotPicker carry a red "!" sign (hidden from screen readers, which still hear "Lỗi:") with the same 16px semibold line; the 2px error edge is a 1px border plus a 1px inset shadow, so a box no longer grows (a Combobox in a FieldRow is 44.4px like its neighbours, was 46.4). One focus rule for fields in error: a dark-ink ring (`text-default`, 3px, 2px gap) in both themes. DateInput boxes shrink before the year wraps in a narrow column (new story NarrowColumn); example dates and phone numbers never break across lines.
- **TextField:** `reserve` keeps one stable message line (the error takes the hint's place); `hint` may be rich; errors carry a red "!"; the error edge no longer grows the box; read-only fields (BMI) look read-only; `after` is deprecated (removed in 3.0).
- **FormNotice:** a sign per type ("!", "i", "✓") as well as color (the nursing-home orange sits close to red and amber); boxed notices are a tint and a sign, with no side bar and no dark edge; `text` may be rich; `live={false}` for countdowns.
- **ConfirmationPanel:** tones `error` (Bị từ chối) and `attention` (Chưa rõ kết quả) besides `success` and `pending`; a focused title keeps one name ("Chờ gửi lên Sở", the seconds in the text under it); pale panels are a tint and a sign with no edge; `emphasis="subtle"` for staff screens; `donePrefix`, `currentPrefix`, `todoPrefix` hidden state words; reference codes never wrap; the arrow ends a step so a wrapped line never starts with "→".
- **SaveStatus:** "!" on the failed and conflict lines; a failed save is read once, as an alert, with the count and "Lưu lại" outside the live region; the last save time never breaks and its dot never starts a line.
- **ErrorSummary:** `layout="inline"` for staff screens: a count heading with "!", the fields' short names as 44px links separated by space (no dots), 129px for four names at 320px; read once (an alert when it appears, then a group named by its heading); a dark-ink focus ring on its red edge.
- **RadioGroup:** `variant="pills"` for list filters; `row` options never shrink below their words.
- **DataTable:** `stackBelow="phone"` shows each record as a block; `variant="plain"` for a table inside a card (no outer edge, no header band); loading, empty and error messages sit under the table outside the sideways scroll, the error with "!"; one polite live region says the result on every change; after "Tải lại" focus moves to the first record; the header rule uses the light `border`; slightly tighter rows. **Pagination:** `live` prop.
- **Combobox:** a chosen coded value keeps its code in view ("Nhà chuy… (22)"); `aria-describedby` and `aria-invalid` pass through; "Xóa" stays outside the box (44px target).
- **PatientContextBar:** facts set apart by space, not "·"; the status beside the name; nav buttons on the name row from 640px (121px tall at 1024, was 185); one-line 44px "Người trước" / "Người sau" on phones, named with the person; facts 10px apart on phones, the code without its words (201px tall at 390, was 241); `variant="block"`: the person as a white block among the page's own blocks (one edge), sticky from 1024px; `recordFacts` for the exam time, signer and last save; the breadcrumb collapses to "‹ parent" on phones.
- **StaffLayout:** measures its sticky header, context bar and action bar and sets the scroll padding from their real heights (`--header-space`, `--context-bar-space`, `--action-bar-space`), so a focused field is never under a bar (it was, at 320, 390 and 1024): 80px of room above for the label and its message line, 15px below; it also counts a sticky person block inside the content, and after a keyboard move brings a field's label out from under a top bar; the side list's sticky top follows the bars; tighter rhythm on phones.
- **Header:** compact thin bar takes the name plus fact chunks and is never taller than the full row; the staff auto-send tag reads "Gửi tự động: chỉ đợt F.D.I KSK 2026" at 16px with the batch name whole; the menu button keeps its name when open and is icon-only in the collapsed bar below 480px.
- **Button:** `iconPosition="end"` for "next" actions; a link button passes `aria-label` through. **TextLink:** `arrow` back / next / none, body-size text. **Base styles:** every link gets the 3px focus ring.
- **SummaryList:** "Thay đổi" is a link in the link colour; the details toggle is the bold one.
- **Breadcrumb:** the "›" ends an item; `collapseOnPhone`. **Kbd:** lighter keycaps. **FieldRow:** aligns Combobox and Select too.
- `formatViNumber(n, decimals, minDecimals)` for fixed decimals ("21,0").

### Sample pages
- **Danh sách hồ sơ:** search under the title; filter pills on desktop, a Select on phones; records as blocks on phones; every typed word must match; near-duplicate "Phạm Văn Năm" and a hint when matches sit in another group; the state tag on one line with "còn 61 mục" under it; fixed column widths; 14px facts; the batch action under the list on phones; focus kept after "Tìm trong Tất cả" and "Tải lại". New stories TimTrongTatCa and MatMangTaiLai.
- **Nhập kết quả:** FormPartNav (choosing a part moves focus to its heading); conflict state; "Lưu lại" after a failure; "Đến mục còn thiếu"; BMI read-only "21,0", computed only from values in range and out of the Tab order; blood pressure as one group; inline error summary with short names; CodeList and the doctor's words; text areas grow with their content; one-row phone action bar (97px, was 137 and 207 in a conflict); short field errors ("Điền tâm thu"); the blood-pressure pair under each other below two 9rem columns; on phones the part heading is for screen readers only and "Xem lại" puts the summary at the top of the free space. New stories ChiSoCao, XemLaiRoiDien, HaiNguoiCungSuaBamLuu, MatMangChuaLuu and SauKhiGui.
- **Xem lại trước khi gửi:** every outcome is a ConfirmationPanel with its own heading (Chờ gửi lên Sở, Đang gửi lên Sở, Sở đã tiếp nhận, Bị từ chối, Chưa rõ kết quả); the focused heading never counts; one status line announces the start, the move to Đang gửi and a cancel; focus follows the panel when the undo window ends; Kết luận shows the classification, two diagnoses (I10, E11), the doctor's words and the advice; the data source as whole chunks; the person stays in view from 1024px (sticky block) and on phones (header thin bar); "Đang gửi" says to open the record to check the status; facts agree across pages. New stories HuyGui, HetGioHuy and CuonDenNutGui.

### Process
- **Usability test protocol** `docs/usability-test-v2.4.md` (Vietnamese): one 60–75 minute session per staff member, eight tasks on the sample pages, timings, errors, understanding of states, Giữ / Sửa / Làm lại thresholds.
- The visual review no longer reports text inside a visually hidden table header as clipped (skill fix).

### Known and accepted
- On the smallest phones (320 × 568) the first empty field of "4. Thể lực" still starts below the fold: the header, the person (name, date of birth, code, nav buttons) and the part toggle take the first screen. Freeing it would mean dropping a whole row (for example the nav buttons) on those phones: a design choice for 2.5. From 390 × 844 the first field is above the action bar.
- "Người sau: Đặng Thanh Chi" is two lines at 320 (one line from 360px).
- The "Cao"/"Thấp" tag and the "· bình thường 60–100" range are 14px (caption size, reference data); the range is hidden when it does not fit beside the tag, and screen readers still read it. The Combobox option hint ("Bệnh tuần hoàn") is 14px too.
- RadioGroup, Checkbox and CodeList show an error as a 3px bar with 15px padding, so the group moves 18px when the error appears; that only happens at a press of "Xem lại" or "Tiếp tục", never while choosing.
- In Windows high-contrast mode the inset half of the error edge is dropped (1px system edge); the sign and the words still mark the error.

### Decisions
- Codes stay in Be Vietnam Pro, not monospace: capital I is a 2px bar (4.1px advance), 1 has a flag and is 49% wider; O is round, 0 a narrower oval; an ICD-10 code is a letter then digits after its name.
- Combobox "Xóa" stays outside the box for its 44px target; the name is cut before the code instead.
- On a red edge the focus ring is dark ink, so the nursing-home orange and the error red never read as one frame.

### Decisions kept open for Minh
- Dashed edge for unavailable buttons: kept (approved 25/10); a reviewer read it as a drop zone.
- Normal ranges and any confirmation for very abnormal values: example ranges only; a doctor sets them.
- Who sends: by hand per batch for now. If Minh should approve each record before it goes to the department, that is a new state ("Chờ Minh duyệt") for 2.5.

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
