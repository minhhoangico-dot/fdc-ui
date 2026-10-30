# CodeList

Several coded items for one question, such as every disease found at a check-up: one person can have "Tăng huyết áp vô căn (nguyên phát) (I10)" **and** "Đái tháo đường type 2 (E11)". Use it where a single-choice Combobox would force the doctor to pick one. The doctor's own wording of the conclusion stays in a separate text field on the page; CodeList holds only the coded items.

A fieldset: the question is the legend ("Bệnh, tật"), then hint and error with the same look as other fields, then the chosen items, then a Combobox labelled "Thêm bệnh, tật".

- **Items** read name first, code after in brackets and lighter (`text-muted`), in the order they were added. They share one surface (`border`, `surface`) with light lines between them: no card per item, no shadow.
- **"Bỏ"** is a text button on each item, at least 44px, named for screen readers with the item: "Bỏ Tăng huyết áp vô căn (nguyên phát) (I10)". Removing moves focus to the add field.
- **Adding:** the Combobox leaves out what is already chosen. Choosing an option moves it into the list; the field empties itself and keeps focus, ready for the next one. Typing without tone marks and by code works as in Combobox.
- **Nothing chosen** is neutral grey: "Chưa có mục nào." Red only after check or review, with one message and one red bar for the whole group (like RadioGroup).
- **Announcements:** "Đã thêm …" and "Đã bỏ …" are read politely (`role="status"`).

`value` / `defaultValue` / `onValueChange` carry the list of values (`string[]`); `id` goes on the add field's input so an ErrorSummary can link to it. Texts can be changed with `addLabel`, `removeLabel` and `emptyText`.
