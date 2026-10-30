# Pagination

"Hiển thị 1–50 trong 2.033 người · ‹ Trước · Trang 1 / 41 · Sau ›". It says what is shown and how much there is, with Vietnamese number grouping, and offers only Previous and Next, so the control never grows with the list.

Prefer links (`getHref`), so a page can be bookmarked or opened in a new tab and coming back from a record keeps the place; use `onPageChange` buttons only when pages have no address. On the first or last page "Trước"/"Sau" stays in place as plain grey text, not a link. The range line is announced when it changes (`live`, default true). Inside a DataTable it is not (`live={false}`, set by the table): the table keeps one live region that says the count, the empty result or the failure, so nothing is read twice. With one page only the count shows; with no rows nothing renders (the table explains why it is empty). DataTable places it under the rows.
