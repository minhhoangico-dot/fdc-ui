# ConfirmationPanel

The end of a flow: a panel with the result ("Đã đặt lịch khám") and the reference code, then what happens next.

It moves focus to its heading so screen readers announce the result. Always say what happens next ("Chúng tôi sẽ gọi … trong vòng 30 phút"), what to bring, and how to change or cancel with the hotline. The code is large, spaced and selectable so people can read it over the phone. Inside a page that already has an h1, set `headingLevel={2}`.

**`emphasis`** sets how loud a success is:
- **`strong`** (default): the solid green panel with white text that ends a patient flow (the booking confirmation). What happens next sits under the panel, on the page.
- **`subtle`**: for staff screens, where a result is one block among many. A pale `status-success-bg` panel with a 1px `status-success-text` edge, the title in `status-success-text`, ordinary `text-default` text, left-aligned; the code in a white box with a green edge, and the explanation inside the panel. A solid green panel is too heavy next to a staff form.

**`tone="pending"`** is for work that was pressed but is not finished ("Chờ gửi · còn 27 giây" / "Hồ sơ chưa được gửi. Chị có thể hủy."): a pale `status-info-bg` panel (the same blue in both themes) with a `status-info-border` edge and ordinary text. Green is only ever for success. A pending panel is always subtle.

Pass **`steps`** for a short step line (Chờ gửi → Đang gửi → Đã gửi lên Sở → Bộ đã nhận), each with an explicit **state set from a real event**: `{ label, state: 'done' | 'current' | 'todo' | 'failed' }`. Never mark a later step done because an earlier one succeeded: "Đã gửi" is not "Sở đã nhận" until the receipt arrives.
- **done**: "✓ " before the words, normal weight (the tick is hidden from screen readers).
- **current** means "waiting for this", so it must never look more finished than a done step: an outlined pill with a 1px dashed edge and no fill, marked `aria-current="step"`. On the strong green panel it is a white outline with white text; on pale panels it takes `status-info-border` / `status-info-text` (pending work is blue, never green).
- **todo**: `text-muted` on pale panels; plain white on the strong panel, where grey would not be readable.
- **failed**: red, wavy-underlined and read as "Lỗi: …" (a white pill on the strong panel).

Plain strings with `currentStep` still work for simple flows.
