# FDC UI

React components for the **FDC Medical Group** design system: the family-doctor clinic (Phòng khám Bác sĩ Gia đình, bacsigiadinhhanoi.vn) and the nursing home (Viện điều dưỡng FDC, fdcmedical.vn). Built with atomic design: tokens → layout → atoms → molecules → organisms → templates → pages.

**Claude Design is the master.** Colors, type, spacing and guidelines live in the Claude Design system [FDC Medical Group](https://claude.ai/artifact/EZhBJY8xppjGRBpCyPV1PG). This repository mirrors its tokens and publishes the built components back to it, so designers in Claude Design and developers here use the same parts.

## Run it

```bash
npm install
npm run storybook      # the component catalogue at http://localhost:6006
npm test               # unit tests
npm run typecheck && npm run lint
```

Use the **Theme** button in the Storybook toolbar to see every component in the clinic (blue) and nursing-home (orange) themes. Start with **Pages › Đặt lịch khám** to see the booking flow assembled from the parts.

## What's inside

| Level | Components |
|---|---|
| Tokens | `design/fdc-medical-group/tokens.json` (master copy) → `src/tokens/tokens.css` (generated) |
| Layout | Stack, Inline |
| Atoms | Button, TextField, Icon (24 FDC glyphs), Avatar, TextLink, VisuallyHidden |
| Molecules | DateInput (Ngày/Tháng/Năm), PhoneInput, TimeSlotPicker, HotlineCard, WorkingHours, ServiceCard, SpecialtyTile, ValueCard, TestimonialCard, NewsCard, ServiceAccordion, FormNotice |
| Organisms | ErrorSummary, ResultLookupForm, ContactForm |
| Templates | BookingStep |
| Pages (Storybook only) | Đặt lịch khám: choose a time, patient details, with stress cases |

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

## Keeping code and Claude Design in sync

**Tokens: Claude Design → code.** After someone edits colors, type or spacing in Claude Design, ask Claude: *"sync FDC tokens from Claude Design"*. Claude reads the master's `tokens.json` into `design/fdc-medical-group/`, then:

```bash
npm run tokens         # regenerates src/tokens/tokens.css (never edit it by hand)
node <skill>/scripts/contrast.mjs --css src/tokens/tokens.css --pairs design/contrast-pairs.json
node <skill>/scripts/contrast.mjs --css src/tokens/tokens.css --scope "[data-theme='nursing-home']" --pairs design/contrast-pairs.json
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
| `npm test` | 75 unit tests: behavior, accessibility attributes, every component in both themes |
| `npm run tokens:check` | tokens.css matches the master tokens.json |
| `node <skill>/scripts/lint-tokens.mjs src/components --strict` | No raw colors, px, fonts or atom margins |
| `node <skill>/scripts/lint-levels.mjs src/components` | No upward imports between atomic levels |
| `node scripts/check-design-previews.mjs` | Claude Design previews render without errors |

`<skill>` is the atomic-design-system skill: `plugins/atomic-design-system/skills/atomic-design-system` in [minhhoangico-dot/atomic-design-system](https://github.com/minhhoangico-dot/atomic-design-system).
