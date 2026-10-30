# TextLink

A text link: underlined `text-link` words at body size (18px on patient pages, 16px in the compact staff density), a 44px tall target, and the 3px `focus-ring` outline with a 2px gap. Use it for every link that is not a button, so no link falls back to the browser's thin default ring. For a primary action use Button.

`arrow` sets the mark beside the words; it is hidden from screen readers, so the link's name is only its words:

- default (`true`): the double chevron after them, "Xem chi tiết »", ending a card or an accordion panel. It nudges right on hover (not with reduced motion). The default text is "Xem chi tiết"; use a more specific label when the destination is not obvious ("Xem bảng giá dịch vụ").
- `"back"`: one chevron before the words, "‹ 3. Tiền sử"; `"next"`: one after them, "5. Lâm sàng ›". For moving between the parts of a form (version 2.4).
- `false`: no mark, for a plain link such as "Đăng xuất" in the staff header.

Every link on a page gets the same 3px ring from the app's base styles (`a[href]:focus-visible`, at zero specificity), so a component that draws its own ring replaces it rather than adding a second one.
