# DataTable

A list of records for staff tools: one row per record, the person's name first (`rowHeader`, read before every cell of the row), a status word (StatusTag sm), the next step in words. A real `<table>` with a caption (hidden by default; the page heading usually says it) and column headers.

- **Targets**: a link placed first in the row-header cell is stretched over the whole cell, so the target is the cell, not a 20px line of text. Keep other controls out of that cell.
- **Columns**: `align: 'end'` for numbers and dates (even digit widths); `nowrap` for codes, dates and statuses; names and next steps wrap. Give the main column no width so it takes the rest.
- **Narrow screens**: the table keeps `minWidth` (default 48rem) and scrolls sideways inside its box, never the page. Only when it really overflows does the box become a labelled, keyboard-scrollable region.
- **States keep the header**, so the page does not jump: `loading` ("Đang tải danh sách…", `aria-busy`), `error` (what failed in plain words + "Tải lại", announced), empty (`emptyText`: say why and how to get back, e.g. "Không có ai khớp “Hằng”. Xóa chữ tìm hoặc chọn nhóm Tất cả.").
- **Paging**: pass `pagination` and a Pagination sits under the rows inside the same box. 50 rows a page for staff lists.

One surface with a 1px `border` edge and a `surface-alt` header row; no shadow, no zebra stripes, no hover color.
