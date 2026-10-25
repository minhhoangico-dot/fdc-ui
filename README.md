# FDC UI

React components for the **FDC Medical Group** design system: the family-doctor clinic (Phòng khám Bác sĩ Gia đình, bacsigiadinhhanoi.vn) and the nursing home (Viện điều dưỡng FDC, fdcmedical.vn). Built with atomic design: tokens → layout → atoms → molecules → organisms → templates → pages.

**Claude Design is the master.** Colors, type, spacing and guidelines live in the Claude Design system [FDC Medical Group](https://claude.ai/artifact/EZhBJY8xppjGRBpCyPV1PG). This repository mirrors its tokens and publishes the built components back to it, so designers in Claude Design and developers here use the same parts.

## Run it

```bash
npm install
npm run storybook      # the component catalogue at http://localhost:6006
npm test               # unit tests
npm run check          # typecheck, lint, tests, token sync, token/level lints, contrast
npm run review:visual  # every story in a real browser, both themes, phone to desktop
```

## Designing with Claude Code

Open this repo in Claude Code and describe the work ("thêm màn hình tra cứu kết quả", "check the booking flow on phones"). Everything Claude needs lives here:
- `CLAUDE.md`: house rules for FDC work, loaded automatically.
- `.claude/skills/atomic-design-system/`: the design-system skill with the FDC brand profile (`references/brands/fdc.md`), used for every UI task.
- `.claude/agents/design-review.md`: a read-only reviewer that renders the stories, measures them and writes a ranked report with screenshots.

Use the **Theme** button in the Storybook toolbar to see every component in the clinic (blue) and nursing-home (orange) themes. Start with **Pages › Đặt lịch khám › Toàn bộ quy trình** to walk through the whole booking flow, built only from these parts inside the real clinic header and footer.

## What's inside

| Level | Components |
|---|---|
| Tokens | `design/fdc-medical-group/tokens.json` (master copy) → `src/tokens/tokens.css` (generated) |
| Layout | Stack, Inline |
| Atoms | Button (secondary, primary, hotline; `disabledReason`), TextField, Icon (24 FDC glyphs), Avatar, TextLink, SkipLink, StatusTag, Kbd, VisuallyHidden |
| Molecules | DateInput (Ngày/Tháng/Năm), PhoneInput, TimeSlotPicker, RadioGroup, SummaryList, CareCard, ConfirmationPanel, HotlineCard, WorkingHours, ServiceCard, SpecialtyTile, ValueCard, TestimonialCard, NewsCard, ServiceAccordion, FormNotice |
| Organisms | Header (site, and `compact` for staff tools), Footer, Dialog (`wide`, `scrollBody`), IdleTimeoutDialog, ErrorSummary, ResultLookupForm, ContactForm |
| Templates | SiteLayout, BookingStep |
| Pages (Storybook only) | Đặt lịch khám: the full flow (service → who → time → details → check answers → confirmation) with session timeout; single steps with stress cases; Khi nào cần đi khám (care advice) |

Using it in an app:

```tsx
import '@fdc/ui/src/tokens/tokens.css';
import '@fdc/ui/src/styles/base.css';
import { BookingStep, TimeSlotPicker } from '@fdc/ui';

<html data-theme="clinic">   {/* or "nursing-home" */}
```

Load the fonts once: Montserrat 600/700 for headings, Be Vietnam Pro 400/500/600 for everything else (Google Fonts, `subset=vietnamese`).

## Rules the components follow

- Patient and family screens: 18px body text, 48px buttons and fields, 44px minimum tap targets. Staff tools may use 16px (`body-sm`).
- Headings Montserrat, text Be Vietnam Pro. Sentence-case button labels, verb first ("Đặt lịch khám").
- Every color comes from a token; every text/background pair passes WCAG AA (4.5:1) in both themes.
- Components never fetch data or position themselves; layout primitives own spacing.
- Pink is only for the hotline. Errors are red **with words**, linked from an error summary.
- Staff tools (hoso, FDC Manager):
  - One primary button per screen state; an unavailable button always says why (`disabledReason`).
  - Green only for success; pending work uses `status-info` (ConfirmationPanel `tone="pending"`, StatusTag `info`).
  - Word labels (StatusTag) rather than bold or color alone.
  - Ctrl shortcuts only (Kbd), never single letters, because Telex typing triggers them.
  - The one-row compact Header.

  See `CHANGELOG.md` for version 2.1.

## Keeping code and Claude Design in sync

**Tokens: Claude Design → code.** After someone edits colors, type or spacing in Claude Design, ask Claude: *"sync FDC tokens from Claude Design"*. Claude reads the master's `tokens.json` into `design/fdc-medical-group/`, then:

```bash
npm run tokens         # regenerates src/tokens/tokens.css (never edit it by hand)
npm run contrast       # both themes
```

**Components: code → Claude Design.** After changing components here:

```bash
npm run build:design                    # window.FDC bundle + css + types into design/fdc-medical-group/components/
node scripts/check-design-previews.mjs  # renders every Claude Design preview card in both themes
```

Then ask Claude to *"publish FDC components to Claude Design"*; it uploads `design/fdc-medical-group/` to the master.

## Checks

| Command | Checks |
|---|---|
| `npm test` | 111 unit tests: behavior, accessibility attributes, every component in both themes |
| `npm run tokens:check` | tokens.css matches the master tokens.json |
| `npm run lint:tokens` | No raw colors, px, fonts, atom margins, `transition: all` or animated layout properties |
| `npm run lint:levels` | No upward imports between atomic levels |
| `npm run contrast` | Every text/background pair passes WCAG AA in both themes |
| `npm run review:visual` | Every story rendered at 320/390/768/1280 in both themes: no sideways scroll, 44px tap targets, 16px+ text, visible focus, axe |
| `node scripts/check-design-previews.mjs` | Claude Design previews render without errors |

`npm run check` runs all of these except the visual review. The skill in `.claude/` is copied from [minhhoangico-dot/atomic-design-system](https://github.com/minhhoangico-dot/atomic-design-system); update it with `npm run skill:sync -- <path-to-clone>`.
