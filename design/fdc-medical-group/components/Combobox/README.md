# Combobox

Choose one coded item by typing part of its name or its code: diagnoses (ICD-10), occupations, wards. A chosen item reads **name first, code after in brackets**: "Tăng huyết áp vô căn (nguyên phát) (I10)"; the code is lighter (`text-muted`), in the field and in the list. A code never stands alone.

**The code always shows.** When the box is too narrow for the whole choice (a phone, a two-column FieldRow), the name is cut with "…" and the code stays whole: "Tăng huyết … (I10)", "Nhà chuy… (22)". The field itself keeps the full text, so screen readers read all of it. While the field has focus it shows its own text like any text field, ready to be read or replaced; when the whole choice is selected (reached with Tab) or the caret sits after it (just chosen), the end, with the code, is scrolled into view. A choice without a code is cut at the end like any text.

Typing without tone marks works: "tang huyet ap", "I10" and "cao huyet ap" (from `keywords`) all find the same item. An exact code comes first, then codes that start with what was typed, then names. The field only accepts an item from the list: leaving it, Escape or Tab puts back the previous choice, and Tab never chooses for the user. When nothing matches it says so and suggests typing another name or the code; that sentence is also read out.

**"Xóa" sits outside the box, on purpose.** It empties the field (not shown when `required`). It is an underlined text button with a full 44px target (52 × 44px, 10px from the box). Inside the box it would either shrink below 44px or crowd the chevron and the typing area, and an "×" icon would need a name of its own. It costs about 62px of the row; because the name is cut before the code, the code stays readable even in a narrow column. This was raised in review (v2.4) and kept.

ARIA 1.2 combobox: arrow keys move through the list, Enter chooses, the result count is announced politely. Field parts (label, hint, error, control) match TextField, so it lines up in a FieldRow. The open list floats, so it is the one place here with `shadow-card`.

Inside a group that owns the message (CodeList), `aria-describedby` adds the group's error to the field's description and `aria-invalid` marks the field invalid without a second message or red edge.
