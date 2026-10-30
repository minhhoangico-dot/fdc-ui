# TextField

A labeled input or textarea for every FDC form, 48px tall with a `border-control` outline.

Always pass `label`; use `hideLabel` only where a visible heading already names the field. Order is label, hint, error, field: the error sits above the field so it is read before typing. `error` adds a 2px `status-error-text` border, a red circle with "!" before the words (the type as a sign, not only red: in the nursing-home theme red sits next to the orange brand; hidden from screen readers) and a hidden "Lỗi:" prefix for screen readers. The red edge is drawn inside the box (a 1px border plus a 1px inset shadow), so the box keeps its height and nothing under it moves when the error comes or goes. When a field with an error has focus, the red edge stays and the focus ring is dark ink (`text-default`), 3px wide with the usual 2px gap, in both themes: a brand ring beside the red edge read as one red-orange frame in the nursing-home theme, even 3px off. Every field in error does the same (NumberField, DateInput, Select, Combobox, CodeList, RadioGroup, Checkbox), as does ErrorSummary. Use `type="tel"` (or PhoneInput) for phones, `icon` for the nursing home's icon-led fields, and `multiline` for free text. `required` shows a red asterisk. Placeholders never carry required information. Text is 18px so phones do not zoom in. The consumer owns value handling and validation.

Placeholders use `text-placeholder` and show an example, never the label ("ví dụ 78"). Put fields side by side with **FieldRow**, so labels and inputs line up when only some fields have a hint or an error.

`unit` shows a unit inside the box on the right ("kg", "lần/phút") and is read after the label. For measurements use **NumberField**, which builds on it.

`reserve` keeps **one stable message line** above the box, for a field whose help changes while the person works in it (NumberField uses it). The error then takes the hint's place instead of adding a line, and the line keeps the room of the tallest text listed in `reserve` (strings for hints, `{ error }` for errors, drawn hidden by CSS so they are neither page text nor read out), and at least one line. So nothing above or below the field moves when it is focused, typed into or left. `hint` may then be a node (NumberField's "Cao" tag line).

`after` (a tag beside the box) is deprecated since 2.4: it took the box's width, so a value could be cut off and boxes in a column stopped lining up. Put a tag in the message line instead. It still renders; it goes in 3.0.

`readOnly` (not `disabled`) shows a computed value in place, such as BMI from height and weight: a `surface-alt` fill and the light `border` edge, so it does not look like a field to type in. The text stays `text-default` because it is real data, it can still be focused and copied, and the hint says where the value comes from ("Tự tính từ chiều cao và cân nặng"). `disabled` is unchanged (grey fill, `text-disabled`) and means "not available now".
