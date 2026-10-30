# CodeList

Several coded items for one question, such as every disease found at a check-up: one person can have "Tăng huyết áp vô căn (nguyên phát) (I10)" **and** "Đái tháo đường type 2 (E11)". Use it where a single-choice Combobox would force the doctor to pick one. The doctor's own wording of the conclusion stays in a separate text field on the page; CodeList holds only the coded items.

A fieldset: the question is the legend ("Bệnh, tật", weight 600), then hint and error with the same look as other fields, then the chosen items, then a Combobox labelled "Thêm bệnh, tật" (weight 500). The heavier legend over the lighter field label shows the add field belongs to the question, like a group label ("Huyết áp (mmHg)") over its fields.

- **Items** read name first, code after in brackets and lighter (`text-muted`), in the order they were added. They share one surface (`border`, `surface`) with light lines between them: no card per item, no shadow.
- **"Bỏ"** is a text button on each item, at least 44px, named for screen readers with the item: "Bỏ Tăng huyết áp vô căn (nguyên phát) (I10)". Removing moves focus to the add field.
- **Adding:** the Combobox leaves out what is already chosen. Choosing an option moves it into the list; the field empties itself and keeps focus, ready for the next one. Typing without tone marks and by code works as in Combobox.
- **Already in the list:** typing the name or code of an item that is already chosen ("i10" with I10 in the list) says so instead of "Không tìm thấy": "Tăng huyết áp vô căn (nguyên phát) (I10) đã có trong danh sách." (several: "Đã có trong danh sách: …; …"; nothing left to add: "Mọi mục đã có trong danh sách."). The sentence is read out too.
- **Nothing chosen** is neutral grey: "Chưa có mục nào." Red only after check or review, with one message and one red bar for the whole group (like RadioGroup).
- **Error and the error summary:** the message carries the same red "!" sign as every field error (hidden from screen readers, which hear "Lỗi:"). It describes the group and the add field, and the add field is marked invalid (`aria-invalid`), so when it has focus its ring is dark ink (`text-default`, 3px, 2px gap), like every field in error. An ErrorSummary link goes to `id`, the add field, so it lands on a field that reads "Lỗi: …". The add field gets no red edge or message of its own: one message, one red bar.
- **Announcements:** "Đã thêm …" and "Đã bỏ …" are read politely (`role="status"`).

`value` / `defaultValue` / `onValueChange` carry the list of values (`string[]`); `id` goes on the add field's input so an ErrorSummary can link to it. Texts can be changed with `addLabel`, `removeLabel` and `emptyText`.
