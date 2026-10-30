# DataTable

A list of records for staff tools: one row per record, the person's name first (`rowHeader`, read before every cell of the row), a status word (StatusTag sm), the next step in words. A real `<table>` with a caption (hidden by default; the page heading usually says it) and column headers.

- **Targets**: a link placed first in the row-header cell is stretched over the whole cell, so the target is the cell, not a 20px line of text. Keep other controls out of that cell.
- **Columns**: `align: 'end'` for numbers and dates (even digit widths); `nowrap` for codes, dates and statuses; names and next steps wrap. Give the main column no width so it takes the rest.
- **Rows** are a little tighter than the header (cell padding `space-10 × 0.8`), so more records fit on a screen; the text keeps its size.
- **Phones** (version 2.4): set `stackBelow="phone"` on record lists. Below 40rem each row becomes a block: the row header (the name, with its stretched link) is the block's title, and every other cell is a line with its column's name before the value ("Mã lượt khám  RD26-0006"), so the first screen shows records and nothing scrolls sideways. The label is the column's `header` when it is plain text, or `stackLabel`; `hideLabelWhenStacked` drops it when the value speaks for itself (a StatusTag). The header row stays for screen readers, visually hidden, and the table states its ARIA roles (table, rowgroup, row, columnheader, rowheader, cell), because changing a table's display drops its semantics in some browsers. The visible labels are hidden from screen readers, which already hear the column header.
- **Narrow screens without stacking** (the default, `stackBelow="none"`; small tables inside a page): the table keeps `minWidth` (default 48rem) and scrolls sideways inside its box, never the page. Only when it really overflows does the box become a labelled, keyboard-scrollable region.
- **States keep the header**, so the page does not jump: `loading` ("Đang tải danh sách…", `aria-busy`), `error` (what failed in plain words + "Tải lại", announced), empty (`emptyText`: say why and how to get back, e.g. "Không có ai khớp “Hằng”. Xóa chữ tìm hoặc chọn nhóm Tất cả.").
- **Paging**: pass `pagination` and a Pagination sits under the rows inside the same box. 50 rows a page for staff lists.

One surface with a 1px `border` edge and a `surface-alt` header row; no shadow, no zebra stripes, no hover color. Stacked blocks are separated by the same 1px `border` line; labels are `text-muted`, 16px.
