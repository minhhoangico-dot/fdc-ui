# Button

The action button: 48px tall, 3px corners, sentence-case label (verb first: "Đặt lịch khám").

- **neutral** (default): grey fill that turns `action-primary-bg` on hover, like the sites' form submits.
- **primary**: `action-primary-bg` (blue in the clinic theme, orange in the nursing home theme) for the one main action on a screen. Hover `action-primary-bg-hover`, pressed `brand-800`.
- **hotline**: pink (`accent-cta`) only for calling a hotline; pass `href="tel:…"`. It stays pink in both themes.

Pass `href` for a link that looks like a button, `icon` for a leading glyph, `block` for full width (recommended for the main action on phones), `loading` while a request runs. Use one primary button per view. Focus shows a 3px `focus-ring` outline. Labels are no longer uppercase: sentence case is faster to read and keeps Vietnamese tone marks clear.
