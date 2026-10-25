# ConfirmationPanel

The end of a flow: a green panel with the result ("Đã đặt lịch khám") and the reference code, followed by what happens next.

It moves focus to its heading so screen readers announce the result. Always say what happens next ("Chúng tôi sẽ gọi … trong vòng 30 phút"), what to bring, and how to change or cancel with the hotline. The code is large, spaced and selectable so people can read it over the phone.

**`tone="pending"`** is for work that was pressed but is not finished ("Chờ gửi · còn 27 giây" / "Hồ sơ chưa được gửi. Chị có thể hủy."): a pale `status-info-bg` panel with a `status-info-border` edge and ordinary text. Green is only ever for success. Pass **`steps`** and **`currentStep`** for a short step line (Chờ gửi → Đang gửi → Đã gửi lên Sở → Bộ đã nhận); the current step is filled with `brand-600` and marked `aria-current="step"`. Inside a page that already has an h1, set `headingLevel={2}`.
