# Combobox

Choose one coded item by typing part of its name or its code: diagnoses (ICD-10), occupations, wards. A chosen item reads **name first, code after in brackets**: "Tăng huyết áp vô căn (nguyên phát) (I10)"; in the list the code is lighter (`text-muted`). A code never stands alone.

Typing without tone marks works: "tang huyet ap", "I10" and "cao huyet ap" (from `keywords`) all find the same item. An exact code comes first, then codes that start with what was typed, then names. The field only accepts an item from the list: leaving it, Escape or Tab puts back the previous choice, and Tab never chooses for the user. "Xóa" empties it unless `required`. When nothing matches it says so and suggests typing another name or the code.

ARIA 1.2 combobox: arrow keys move through the list, Enter chooses, the result count is announced politely. Field parts (label, hint, error, control) match TextField, so it lines up in a FieldRow. The open list floats, so it is the one place here with `shadow-card`.
