# SummaryList

The "check your answers" list shown before anything is booked or sent: one row per answer with a "Thay đổi" link.

Screen readers hear each link with its row ("Thay đổi họ và tên"). Use `changeHref` for page links or `onChange` in single-page flows. Show values exactly as they will be used (formatted date and phone). Put the confirm button after it and a one-line consent note above the button.

A row can carry read-only **`details`** (a table of answers or results) with a **`detailsLabel`** such as "Xem 12 chỉ số". The toggle sits right under the value: "▸ Xem 12 chỉ số" when closed, "▾ Thu gọn 12 chỉ số" when open (`aria-expanded`), and the details open right under the row across the value and action columns. "Thay đổi" is a link and looks like one: `text-link`, regular weight, underlined, a 44px target (`body-sm`). The toggle is the bold one, with "▸" and no underline, so a link and a toggle are never confused.

A table inside `details` sits in the list's card already: use DataTable `variant="plain"` (rows and light dividers only, no outer edge and no header band), never a second box inside the card. Write facts in a value as whole chunks or one group per line, not joined by "·", so no line on a phone starts or ends with a stray mark.
