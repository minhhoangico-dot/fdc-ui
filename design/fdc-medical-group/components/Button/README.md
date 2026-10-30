# Button

The action button: 48px tall (44px in the compact staff density), 3px corners, sentence-case label (verb first: "Đặt lịch khám").

- **neutral** (default) is the **secondary** button: white (`surface`) with a 2px `action-secondary-edge` drawn inside (so its size never changes) and `action-secondary-fg` text. Hover fills it with `action-primary-bg`. It never looks unavailable.
- **primary**: `action-primary-bg` (blue in the clinic theme, orange in the nursing home theme) for the one main action of a screen state. Hover `action-primary-bg-hover`, pressed `action-primary-bg-active`.
- **hotline**: pink (`accent-cta`) only for calling a hotline; pass `href="tel:…"`. It stays pink in both themes.
- **Unavailable**: no fill, `ink-subtle` text, a 1px dashed `border-control` edge, a not-allowed cursor.

**One primary button per screen state. An unavailable button always says why.** Pass `disabledReason` ("Chọn một dòng ở trên trước.") instead of a bare `disabled`: the reason shows right next to the button (`body-sm`, `text-muted`), is linked with `aria-describedby`, and the button uses `aria-disabled="true"` so Tab still reaches it and screen readers read the reason; clicks and Enter do nothing.

Labels say exactly what will happen and change with the choice when needed ("Dùng người và lượt khám này", "Nhờ Minh kiểm tra"), never a generic "OK". Pass `href` for a link that looks like a button (it keeps `aria-label`, `id` and other attributes), `block` for full width (recommended for the main action on phones), `loading` while a request runs. Focus shows a 3px `focus-ring` outline.

**Icons** (`icon`): a glyph beside the label, before it by default. `iconPosition="end"` (version 2.4) puts it after the words, for "next" and "forward" actions, so the arrow points the way it goes and sits where the eye ends: "‹ Người trước" and "Người sau ›", like "5. Lâm sàng ›" and "Sau ›" elsewhere.

**Short label, full name.** When the visible words are short on purpose (a phone row of two buttons), the accessible name starts with those words and adds what they lead to: `aria-label="Người sau: Đặng Thanh Chi"` on a button that shows "Người sau", so speech input ("bấm Người sau") still works.
