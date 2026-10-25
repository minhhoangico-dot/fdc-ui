# Dialog

A modal dialog on the native `<dialog>` element: focus stays inside, Esc closes it, and focus returns to the button that opened it.

Use sparingly; a page is usually kinder than a dialog for older users. Put the safe action first and make it primary ("Giữ lịch khám" before "Hủy lịch"). Pass `alert` for warnings that need an answer. The consumer owns `open` and `onClose`.

For dialogs that hold a list or table, use **`size="wide"`** (about 52rem) and **`scrollBody`**: the title and the Actions row stay fixed while the body scrolls between them, with a fade at the bottom while more content is below. The scrolling body can be focused and scrolled with the keyboard and is named after the dialog (`bodyLabel` to change it).
