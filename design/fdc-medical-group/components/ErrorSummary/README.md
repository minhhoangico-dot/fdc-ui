# ErrorSummary

The list of problems at the top of a form after a failed submit; each item links to its field.

Render it only when there are errors. It takes focus so keyboard and screen-reader users land on it, and each link moves focus to the field. Use the same words as the field's own message. Title: "Vui lòng kiểm tra lại thông tin". Never clear what the person typed.

**`layout="inline"`** (version 2.4) is for staff forms, where four empty fields after "Xem lại" made a block that pushed the form out of view. Same red 3px box, less padding (10px 15px), a smaller heading (18px, "Còn 4 mục ở phần 4. Thể lực") and the links in one wrapping line separated by " · " (the dots are hidden from screen readers). It is still a list of links for screen readers, it still takes focus when it appears, each link is still a 44px target and still moves focus to its field. Patient forms keep the default `layout="list"`, one problem per line.

