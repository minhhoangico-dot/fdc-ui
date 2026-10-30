# StatusTag

A rounded status label for staff tools: "Cao", "Nhập tay", "Chờ gửi", "Sở đã tiếp nhận". It is text, not a control.

Tags are **tinted fills with no edge**, so a tag never reads as a button or as an unselected filter pill (which is outlined). **No tag is solid.** Every tone except muted starts with a small dot in the text color (hidden from screen readers), so tags differ from buttons even in grayscale. When a long tag wraps, the dot stays on the first line. Text is 500 weight; all tags of a size are the same height.

| Tone | Looks | Use |
|---|---|---|
| **neutral** (default) | `surface-alt` fill, `text-default`, dot | A state with no color of its own ("Cần điền", "Sẵn sàng xem lại") |
| **muted** | `surface-alt` fill, `text-muted`, no dot, no edge | The quietest tag: a source, not a state ("Nhập tay"), or a record nothing has been typed into ("Chưa điền") |
| **info** | `status-info-bg` / `status-info-text`, dot | Work started but not finished ("Chờ gửi", "Đang gửi"); never green for pending |
| **success** | `status-success-bg` / `status-success-text`, dot | Done and confirmed by the other side ("Sở đã tiếp nhận", "Bộ đã xác nhận") |
| **error** | `status-error-bg` / `status-error-text`, dot | Something must be fixed before going on ("Cần sửa", "Bị từ chối") |
| **attention** | `status-warning-bg` / `status-warning-text`, dot | Worth a look, not an input error: a value outside the normal range ("Cao", "Thấp") or an outcome not known yet ("Chưa rõ kết quả") |

`strong` (a solid brand pill) is **deprecated** since 2.4: no screen used it, and in the nursing-home theme it looked like the orange primary button. It now shows as `neutral` and goes in 3.0.

Status colors are the same in every theme. Use `size="sm"` for a tag next to a value in a table or summary ("150/95 mmHg · Cao").

A tag always has words: color is never the only signal. Use the record-state words from the README's state table, never "Gửi lỗi" or "Đã gửi" for a result the department has not confirmed. Bold is for values; a tag is how something asks for attention. Red is only for what needs fixing: a high or low result is `attention`, so it is not mistaken for a typing error. A note about who does what (a role or mode, such as who sends) is not a state: write it as plain muted text, not a tag. When the state needs an action, put a Button next to the tag.
