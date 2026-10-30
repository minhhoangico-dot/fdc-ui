# ErrorSummary

The list of problems at the top of a form after a failed submit; each item links to its field.

Render it only when there are errors. It takes focus so keyboard and screen-reader users land on it, and each link moves focus to the field. Use the same words as the field's own message. Title: "Vui lòng kiểm tra lại thông tin". Never clear what the person typed.

**Sign** (version 2.4). The heading starts with the "!" sign in a red circle, as FormNotice does: in the nursing-home theme the red edge sits close to the brand orange, so the type is a shape too. The sign is hidden from screen readers; the heading's words name the summary.

**Focus ring** (version 2.4). The summary's own ring is dark ink (`text-default`), 3px with a 2px gap, not the brand color: an orange ring just outside the red edge read as one red-orange frame in the nursing-home theme. The links keep the brand ring.

**Read once** (version 2.4). It appears as an alert, so it is read at once even when it does not take focus. Once focus has been in it and moved on (to a field, or anywhere), or once its list changes while it shows (a page that drops filled fields when "Lưu" is pressed), it becomes a group named by its title: later changes are not read over what the person is doing. It is an alert again when it comes back after having no errors, or when the page renders it with a new `key` (the entry page does this on each press of "Xem lại").

**`layout="inline"`** (version 2.4) is for staff forms, where four empty fields after "Xem lại" made a block that pushed the form out of view. Same red 3px box, less padding (10px top, 15px sides, none at the bottom: the last row of 44px targets gives the space), a smaller heading that gives the count (18px, "Còn 4 mục chưa điền"), and the fields' **short names** as links ("Mạch", "Tâm thu", "Tâm trương", "Phân loại thể lực"); the field itself says what to do ("Điền mạch"). The links sit side by side in rows that wrap, 20px apart, with no dots between them, so no line starts or ends with one. Each link is still a 44px target; the rows touch, and a link's focus ring is drawn inside its target (2px in from the edge, 2px clear of the words) so it never lands on the red edge. On a 320px phone four short names take two rows: the summary is 129px tall (85px from 768px up). It is still a list of links for screen readers, it still takes focus when it appears, and each link still moves focus to its field. Patient forms keep the default `layout="list"`, one problem per line, with the field's own message as the link.
