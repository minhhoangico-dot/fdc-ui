# FDC Medical Group

One visual language for every screen the group ships: the public clinic website, staff tools like FDC Manager, patient touchpoints, and the nursing home. Everything here was extracted from the live sites bacsigiadinhhanoi.vn (clinic) and fdcmedical.vn (nursing home), so a rebuild matches what patients and families already recognize.

## How the system is organized

The system follows atomic design. Build every level only from the level below it, never from raw values.

- **Tokens** (colors, type, spacing, radius, shadow) are the single source of truth. Components use the semantic names (`action-primary-bg`, `text-default`, `text-muted`, `focus-ring`, `hotline`…), which point at the palette and follow the theme.
- **Layout** owns spacing between things: Stack, Inline. No component sets its own outer margin.
- **Atoms** use only tokens: Button, TextField, Icon, Avatar, TextLink, SkipLink, StatusTag, Kbd.
- **Molecules** combine atoms into one-job blocks: DateInput, PhoneInput, TimeSlotPicker, RadioGroup, SummaryList, CareCard, ConfirmationPanel, HotlineCard, WorkingHours, ServiceCard, SpecialtyTile, ValueCard, TestimonialCard, NewsCard, ServiceAccordion, FormNotice.
- **Organisms** are distinct sections: Header (with a `compact` variant for staff tools), Footer, Dialog, IdleTimeoutDialog, ErrorSummary, ResultLookupForm, ContactForm.
- **Templates** lay out a page with slots: SiteLayout (skip link, header, main, footer) and BookingStep (one question per page). The booking flow is: service → who it is for → time → details → check answers (SummaryList) → confirmation (ConfirmationPanel), with IdleTimeoutDialog guarding the session.

The group is modeled as **themes**. `FDC Clinic` (blue) is the default. `FDC Nursing Home` (orange) overrides only the brand scale (`brand-50` to `brand-800`) and `leaf-500`; every other token and every component is shared. Set `data-theme="nursing-home"` on the page root to switch. Never hard-code blue or orange in a component; always use `brand-*` so it follows the theme. Use `group-600` only where a unit points back to the group: it stays FDC blue in every theme.

## Content fundamentals

- Write in Vietnamese first, plain and calm. Patients and families read this, often when worried.
- Name things by what the patient does: "Đặt lịch khám", not "Submit".
- Always show the hotline where a patient or family might get stuck: clinic 024 35 430 430, nursing home 096 583 7777.
- Button labels are sentence case, verb first ("Đặt lịch khám"). The site's uppercase labels were dropped: capitals are slower to read and crowd Vietnamese tone marks.
- Vietnamese diacritics need room: body line-height 1.5 or more, headings 1.3 or more.
- Errors say what to do, in the field's own words: "Nhập số điện thoại gồm 10 chữ số, ví dụ 0912 345 678". Never "Sai" or "Không hợp lệ".
- Ask one question per page in booking flows, and ask early who the appointment is for ("Bạn đặt lịch cho ai?"): families often book for parents.
- Before anything is booked, show every answer with a "Thay đổi" link; after, say what happens next, the booking code, and how to change or cancel by phone.
- Health advice uses three levels (CareCard): non-urgent "Gọi bác sĩ gia đình" (FDC blue), urgent "Đến khám trong ngày" (red), emergency "Gọi cấp cứu 115 ngay" (red and dark). Inform and reassure; a doctor approves the wording.
- Write the address, hotline and email as text in the footer, not only as links.

## Công cụ nhân viên (staff tools)

Staff tools (FDC Manager, hoso, reception) are used all day by trained people, often against the clock. They follow the rules above plus these, approved by Minh on 25/10/2026 from the hoso health-record app.

- **One primary button per screen state.** Secondary buttons are white with a blue edge and blue text (`surface`, `brand-600` edge, `brand-800` text), so they never look disabled. A button that cannot be used has no fill and a dashed edge, and always has a line right next to it that says why (Button `disabledReason`).
- **Labels say exactly what will happen**, and change with the choice when needed: "Dùng người và lượt khám này", "Nhờ Minh kiểm tra". Never a generic "OK" or "Tiếp".
- **An empty field is neutral, not an error.** Show a grey hint: "Chưa điền · ví dụ 78". Show red only when a typed value is wrong, or after the user presses check or review and something is still missing. A group of choices reports its error once for the whole group: one message and one red bar, not a red box on every option.
- **Two different counts, two different names:** "mục còn thiếu" (things still to do) and "ô chưa lưu" (changes not yet saved). Never mix them in one number.
- **Name first, code after in brackets and lighter:** "Tăng huyết áp (I10)", "Nhà chuyên môn về sức khỏe (22)". A code never stands alone.
- **Green is only for success.** Work that was started but is not finished ("Chờ gửi · còn 27 giây") uses the pale `status-info` tint: light blue in the clinic theme (`status-info-bg`, `status-info-border`, `status-info-text`).
- **Bold only emphasizes a value.** Anything that needs attention gets a word label (StatusTag: "Cao", "Nhập tay"); bold or color is never the only signal.
- **No single-letter shortcuts:** with Telex Vietnamese typing they fire by accident. Use Ctrl combinations only, and show the hint where it applies with Kbd ("Ctrl + S lưu").
- **One-row header** (Header `compact`) to leave height for the work. On phones it shrinks while scrolling but always keeps the current person's name, date of birth and record code in view.
- **Long lists page clearly:** "Hiển thị 1–50 trong 2.033 · ‹ Trước · Sau ›".
- **Design notes and implementation rules live outside the interface.** On screen, keep only the sentence that helps the user act now.

## Visual foundations

**Color.** In the clinic theme, FDC blue (`brand-600`, the logo blue) carries the brand. In the nursing home theme the same token is a warm orange, matching fdcmedical.vn, while the logo itself stays blue: primary actions, links and key headings. `brand-700` is the footer and hover state. Light blues (`brand-200`, `brand-300`, `brand-50`) tint sections and tables. Logo green (`leaf-500`) is decorative only. Pink (`accent-600`, `accent-cta`) is reserved for the hotline so it always stands out; do not use it for anything else.

**Contrast.** Every text color passes 4.5:1 on white, and every semantic pair passes in both themes (checked by script on each change). Five site colors failed and were darkened for the rebuild, keeping their hue: green `leaf-700` (#6ea229 to #577f20), hotline `accent-600` and `accent-cta`, `ink-subtle` (#999 to #767676), and the nursing home orange `brand-600` (#ec6810 to #bf540d). The bright orange `brand-300` (#ffa234) stays as a band color with dark text only. Version 2 also darkened `danger` (#dc3545 to #b42318, 6.6:1) and added `ink-soft` (#595959) behind `text-muted`, because the old grey fell to 3.8:1 on the `brand-200` section tint. Control borders use `border-control` (#767676, 4.5:1), not the pale `border-input`.

**Type.** Two families, shared by both themes. Headings use **Montserrat** (600–700, line-height 1.3), so the brand still reads as the website. Body text, labels and fields use **Be Vietnam Pro** (400–600), designed by Vietnamese type designers: its stacked tone marks (Ẫ, Ể, Ợ) get about 0.40em of room above capitals versus 0.24em in Montserrat, which matters for older readers. Body is **18px at 1.55** on patient and family screens (`body`); staff tools may use 16px (`body-sm`); nothing a patient must read is smaller than 16px; `caption` (14px) is for metadata only. Use the type style classes (`heading-xl` … `caption`) rather than raw sizes.

**Space and shape.** A 15px gutter grid inside a 1200px container (`container-max`). Spacing steps: 5, 10, 15, 20, 30, 40, 50px, written in rem so they grow with the reader's text size. Buttons and fields are 48px tall (`control-height`); every tap target is at least 44px (`target-min`). Running text stops at about 70 characters (`measure`). Corners are crisp: `radius-sm` (3px) is the default for buttons, inputs and cards. The nursing home's signature is the leaf corner, `radius-leaf` on the top-left and bottom-right only; components apply it automatically to images (`.fdc-media`) and accordion headers in the nursing-home theme. Do not add it elsewhere. Depth is a soft all-around glow (`shadow-card`), not a drop shadow.

**Accessibility upgrade (version 2, for older patients).** The current site removes focus outlines; this system shows a 3px `focus-ring` outline with a 2px offset on every interactive element. On top of that: 18px body text, 48px controls and 44px targets, sentence-case labels, Be Vietnam Pro for text, visible labels on every field (placeholders never replace them), errors in words with an error summary that links to each field, typed dates (Ngày / Tháng / Năm) instead of calendar pickers for known dates, phone fields that accept spaces and +84, and the hotline in the same place on every page.

## Iconography

Use the `Icon` atom: 24 single-ink IcoFont glyphs copied from both sites (phone, telephone, calendar, user, pencil, plus/minus, chevrons and more). They inherit the text color; tint them `brand-600`, `ink-muted`, or `accent-600` for the hotline only. Size 12–16px inline, 24–40px in cards. SVG copies are in Assets › Icons.

Service illustrations (Assets › Services) are two-tone with FDC blue baked in; use them only in ServiceCard. Specialty icons (Assets › Specialties) are white and sit on a `brand-600` square in SpecialtyTile, so they follow the theme. Never use emoji as icons.

## Logos

Both logos are in Assets › Logos: the clinic logo (blue mark with green leaf) and the nursing home logo (Điều dưỡng FDC, blue). Use the one that matches the theme, on white or `surface-alt` only; the Header shows it on its white bar. Do not recolor them or place them on `brand-600`.

## How this system is kept

This design system in Claude Design is the **master**: change tokens, guidelines and wording here. The coded library [`minhhoangico-dot/fdc-ui`](https://github.com/minhhoangico-dot/fdc-ui) mirrors it:

- **Tokens flow from here to code.** After a change here, ask Claude in the fdc-ui project to "sync FDC tokens from Claude Design"; it copies `tokens.json`, regenerates the CSS and re-checks contrast in both themes.
- **Components flow from code to here.** The components' behavior is code, built and tested in fdc-ui, then published into this system as `components/bundle.js`, so these previews run the same code apps use. Ask for component changes in fdc-ui, then "publish FDC components to Claude Design".

