# Dialog

A modal dialog on the native `<dialog>` element: focus stays inside, Esc closes it, and focus returns to the button that opened it.

Use sparingly; a page is usually kinder than a dialog for older users. Put the safe action first and make it primary ("Giữ lịch khám" before "Hủy lịch"). Pass `alert` for warnings that need an answer. The consumer owns `open` and `onClose`.
