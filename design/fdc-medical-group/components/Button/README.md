# Button

The action button: 48px tall, 3px corners, sentence-case label (verb first: "Đặt lịch khám").

- **neutral** (default) is the **secondary** button: white (`surface`) with a 2px `brand-600` edge drawn inside (so its size never changes) and `brand-800` text. Hover fills it with `action-primary-bg`. It never looks unavailable.
- **primary**: `action-primary-bg` (blue in the clinic theme, orange in the nursing home theme) for the one main action of a screen state. Hover `action-primary-bg-hover`, pressed `brand-800`.
- **hotline**: pink (`accent-cta`) only for calling a hotline; pass `href="tel:…"`. It stays pink in both themes.
- **Unavailable**: no fill, `ink-subtle` text, a 1px dashed `border-control` edge, a not-allowed cursor.

**One primary button per screen state. An unavailable button always says why.** Pass `disabledReason` ("Chọn một dòng ở trên trước.") instead of a bare `disabled`: the reason shows right next to the button (`body-sm`, `text-muted`), is linked with `aria-describedby`, and the button uses `aria-disabled="true"` so Tab still reaches it and screen readers read the reason; clicks and Enter do nothing.

Labels say exactly what will happen and change with the choice when needed ("Dùng người và lượt khám này", "Nhờ Minh kiểm tra"), never a generic "OK". Pass `href` for a link that looks like a button, `icon` for a leading glyph, `block` for full width (recommended for the main action on phones), `loading` while a request runs. Focus shows a 3px `focus-ring` outline.
