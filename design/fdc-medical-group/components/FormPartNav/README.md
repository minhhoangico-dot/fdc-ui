# FormPartNav

The parts of a long staff form, each with what is left in it: "4. Thể lực · còn 2", "6. Cận lâm sàng · ✓ Đủ". It goes in StaffLayout's `aside`, which already is the `<nav>` landmark ("Các phần của phiếu"), so FormPartNav itself is a plain block. Outside StaffLayout, put it in a labelled `<nav>`.

| Screen | Looks |
|---|---|
| From 1024px | The full list in the side column: a white block with a 1px edge, one 44px row per part |
| Below 1024px | One full-width toggle, "4. Thể lực · còn 2 ▾", so the form starts near the top of a phone screen; it opens the list under itself and choosing a part closes it |

- **The current part** has `aria-current="step"`, the `surface-selected` fill, a 3px `border-brand` bar at the start and 600 weight. The bar is a border, so it stays in Windows high-contrast mode.
- **Counts** are words: "còn 17" in `text-default`; a finished part reads "✓ Đủ" in `status-success-text`. A muted second line can say where data came from ("12 chỉ số từ HIS, 09:12").
- **A part to fix** shows its `problem` in `status-error-text` under the name ("1 cần sửa"). The closed phone toggle repeats it ("3. Tiền sử: 1 cần sửa", or "2 phần cần sửa"), so a problem is never hidden behind the toggle. Red only adds to the words.
- **Keyboard:** the toggle has `aria-expanded` and `aria-controls`; Escape closes the list and returns to the toggle. An item with `href` is a link and the browser follows it; an item with only `onSelect` is a button and focus returns to the toggle, which then names the new part.
- Every row and the toggle are at least 44px tall; the focus ring sits inside the row, so neighbours never cover it.
