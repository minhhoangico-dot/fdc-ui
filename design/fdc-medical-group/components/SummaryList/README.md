# SummaryList

The "check your answers" list shown before anything is booked or sent: one row per answer with a "Thay đổi" link.

Screen readers hear each link with its row ("Thay đổi họ và tên"). Use `changeHref` for page links or `onChange` in single-page flows. Show values exactly as they will be used (formatted date and phone). Put the confirm button after it and a one-line consent note above the button.

A row can carry read-only **`details`** (a table of answers or results) with a **`detailsLabel`** such as "Xem 12 chỉ số". The toggle sits right under the value: "▸ Xem 12 chỉ số" when closed, "▾ Thu gọn 12 chỉ số" when open (`aria-expanded`), and the details open right under the row across the value and action columns. "Thay đổi" is smaller and quieter (`body-sm`, `text-muted`, still underlined, still a 44px target) so it never outshines the toggle.
