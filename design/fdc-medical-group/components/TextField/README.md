# TextField

A labeled input or textarea for every FDC form, 48px tall with a `border-control` outline.

Always pass `label`; use `hideLabel` only where a visible heading already names the field. Order is label, hint, error, field: the error sits above the field so it is read before typing. `error` adds a 2px `status-error-text` border and a hidden "Lỗi:" prefix for screen readers. Use `type="tel"` (or PhoneInput) for phones, `icon` for the nursing home's icon-led fields, and `multiline` for free text. `required` shows a red asterisk. Placeholders never carry required information. Text is 18px so phones do not zoom in. The consumer owns value handling and validation.

Placeholders use `text-placeholder` and show an example, never the label ("Chưa điền · ví dụ 78"). Put fields side by side with **FieldRow**, so labels and inputs line up when only some fields have a hint or an error.
