# ConfirmationPanel

The end of a flow: a green panel with the result ("Đã đặt lịch khám") and the reference code, followed by what happens next.

It moves focus to its heading so screen readers announce the result. Always say what happens next ("Chúng tôi sẽ gọi … trong vòng 30 phút"), what to bring, and how to change or cancel with the hotline. The code is large, spaced and selectable so people can read it over the phone.

**`tone="pending"`** is for work that was pressed but is not finished ("Chờ gửi · còn 27 giây" / "Hồ sơ chưa được gửi. Chị có thể hủy."): a pale `status-info-bg` panel (the same blue in both themes) with a `status-info-border` edge and ordinary text. Green is only ever for success. Pass **`steps`** for a short step line (Chờ gửi → Đang gửi → Đã gửi lên Sở → Bộ đã nhận), each with an explicit **state set from a real event**: `{ label, state: 'done' | 'current' | 'todo' | 'failed' }`. Never mark a later step done because an earlier one succeeded: "Đã gửi" is not "Sở đã nhận" until the receipt arrives. The current step is filled with `surface-brand` and marked `aria-current="step"`; a failed step is red, underlined and read as "Lỗi: …". Plain strings with `currentStep` still work for simple flows. Inside a page that already has an h1, set `headingLevel={2}`.
