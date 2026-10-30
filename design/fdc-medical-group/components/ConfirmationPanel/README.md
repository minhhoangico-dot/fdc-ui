# ConfirmationPanel

The end of a flow, or where it stands: a panel with the result ("Đã đặt lịch khám", "Sở đã tiếp nhận") and the reference code, an optional step line, then what happens next.

It moves focus to its heading so screen readers announce the result. **A focused title keeps one name; put a countdown in the text under it** ("Chờ gửi lên Sở", then "Còn 27 giây để hủy." in the text): a heading whose name changed every second would be announced again and again while it has focus. Always say what happens next ("Chúng tôi sẽ gọi … trong vòng 30 phút"), what to bring, and how to change or cancel with the hotline. The code is large and selectable so people can read it over the phone, and it **never breaks across lines**: in a narrow column it gets a little smaller instead (below 22rem on pale panels, below 17rem on the strong one). Inside a page that already has an h1, set `headingLevel={2}`.

**`tone`** says what the result is:
- **`success`** (default): done and confirmed. Green is only ever for success.
- **`pending`**: pressed but not finished ("Chờ gửi lên Sở" / "**Còn 27 giây để hủy.** Chưa có gì lên Sở. Chị có thể hủy."): `status-info-bg`, sign **i**. The title is fixed; the seconds are in the text.
- **`error`**: the other side refused and said why ("Bị từ chối"): `status-error-bg`, sign **!**. Give the reason in their words, the button that opens the part to fix ("Mở phần 7. Kết luận để sửa") and the way back after the fix (sửa → xem lại → gửi lại). Only a refusal with a reason opens the record for a resend.
- **`attention`**: the outcome is not known ("Chưa rõ kết quả"): `status-warning-bg`, sign **!**. Offer "Kiểm tra lại trạng thái" and "Nhờ Minh kiểm tra", **never "Gửi lại"**: the department may already hold the record, and a second send makes a duplicate.

**`emphasis`** sets how loud a success is:
- **`strong`** (default): the solid green panel with white text that ends a patient flow (the booking confirmation). What happens next sits under the panel, on the page.
- **`subtle`**: for staff screens, where a result is one block among many: a pale `status-success-bg` panel with the sign **✓**, the title in `status-success-text`, and the explanation inside the panel.

Every panel except the strong success is **pale**: a tint, a sign in a circle before the title (hidden from screen readers) and ordinary `text-default` text, left-aligned. **No edge and no side bar**, the same rule as a boxed FormNotice. The code sits in a white box with a light `border` edge. Status colors are the same in both themes.

Pass **`steps`** for a short step line, each with an explicit **state set from a real event**: `{ label, state: 'done' | 'current' | 'todo' | 'failed' }`. Never mark a later step done because an earlier one succeeded: "Đã gửi lên Sở" is not "Sở đã tiếp nhận" until the receipt arrives. Done steps say what happened ("Đã xem lại", "Đã gửi lên Sở", "Sở đã tiếp nhận"), the step being waited for says "Chờ …" ("Chờ gửi", "Chờ Bộ xác nhận"), later steps are plain event names ("Bộ xác nhận").
- **done**: "✓" before the words, normal weight.
- **current** is the step being waited for: a small clock before the words, in `status-info-text` on pale panels (white on the strong panel), marked `aria-current="step"`. It is **never drawn with a dashed edge**: in this system a dashed edge means a button that cannot be used.
- **todo**: `text-muted` on pale panels; plain white on the strong panel, where grey would not be readable.
- **failed**: red words after a "!" in a red circle (a white pill on the strong panel). No underline: a wavy red line reads as a spelling mark.

Each step also starts with its **state in words for screen readers**, hidden on screen: "Xong:", "Hiện tại:", "Bước sau:", "Lỗi:" (props `donePrefix`, `currentPrefix`, `todoPrefix`, `failedPrefix`). The arrows are glued to the end of each step, so a wrapped line never starts with "→".

| Moment (staff) | Panel | Steps |
|---|---|---|
| Chờ gửi lên Sở (còn n giây để hủy, in the text) | `pending` | ✓ Đã xem lại → ◷ Chờ gửi → Sở tiếp nhận → Bộ xác nhận |
| Sở đã tiếp nhận | `success`, `subtle`, code "Mã tiếp nhận của Sở" | ✓ Đã xem lại → ✓ Đã gửi lên Sở → ✓ Sở đã tiếp nhận → ◷ Chờ Bộ xác nhận |
| Bị từ chối | `error` | ✓ Đã gửi lên Sở → ! Sở từ chối → ◷ Chờ chị sửa → Xem lại → Gửi lại |
| Chưa rõ kết quả | `attention` | ✓ Đã xem lại → ✓ Đã gửi lên Sở → ◷ Chờ Sở trả lời → Bộ xác nhận |

Plain strings with `currentStep` still work for simple flows.
