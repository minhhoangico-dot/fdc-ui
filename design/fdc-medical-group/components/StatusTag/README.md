# StatusTag

A rounded status label for staff tools: "Cao", "Nhập tay", "Chờ gửi", "Đã gửi". It is text, not a control.

Tones: **neutral** (`border-control` edge, the default), **muted** (`surface-alt` fill, `text-muted`; for sources like "Nhập tay"), **info** (`status-info-bg` / `status-info-text`, the same blue in both themes; work started but not finished), **strong** (`surface-brand` fill, white text; the one state that matters most), **success** (`status-success-text` edge and text; done), **error** (2px `danger` edge and text; needs attention). Use `size="sm"` for a tag next to a value in a table or summary ("150/95 mmHg · Cao").

A tag always has words: color is never the only signal. Bold is for values; a tag is how something asks for attention. Green is only for success: pending work is `info`. When the state needs an action, put a Button next to the tag.
