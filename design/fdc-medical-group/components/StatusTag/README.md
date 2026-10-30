# StatusTag

A rounded status label for staff tools: "Cao", "Nhập tay", "Chờ gửi", "Đã gửi". It is text, not a control.

Tags are **tinted fills with no dark edge**, so a tag never reads as a button. Every tone except muted and strong starts with a small dot in the text color (hidden from screen readers), so tags differ from buttons even in grayscale. Text is 500 weight; all tags are the same height.

| Tone | Looks | Use |
|---|---|---|
| **neutral** (default) | `surface-alt` fill, `text-default`, dot | A state with no color of its own ("Cần điền") |
| **muted** | `surface` fill, 1px `border` edge, `text-muted`, no dot | A source, not a state ("Nhập tay") |
| **info** | `status-info-bg` / `status-info-text`, dot | Work started but not finished ("Chờ gửi · còn 27 giây"); never green for pending |
| **success** | `status-success-bg` / `status-success-text`, dot | Done and confirmed ("Đã gửi") |
| **error** | `status-error-bg` / `status-error-text`, dot | Something must be fixed before going on ("Cần sửa", "Gửi lỗi") |
| **attention** | `status-warning-bg` / `status-warning-text`, dot | A value outside the normal range ("Cao", "Thấp"): worth a look, not an input error |
| **strong** | `surface-brand` fill, white text, no dot | The one state that matters most on a screen |

Status colors are the same in every theme. Use `size="sm"` for a tag next to a value in a table or summary ("150/95 mmHg · Cao").

A tag always has words: color is never the only signal. Bold is for values; a tag is how something asks for attention. Red is only for what needs fixing: a high or low result is `attention`, so it is not mistaken for a typing error. When the state needs an action, put a Button next to the tag.
