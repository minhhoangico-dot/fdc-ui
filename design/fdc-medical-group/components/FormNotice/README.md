# FormNotice

The status line under a form (sent, failed, info), announced by screen readers without moving focus.

Use after the request finishes: success in `status-success-text`, failure in `status-error-text` with a way out ("…hoặc gọi 024 35 430 430"). For field problems use ErrorSummary and field errors instead.

Every notice starts with a **mark**: a small circle in the type's color with a white sign, **"!"** for `error` and `warning`, **"i"** for `info`, **"✓"** for `success`. It is hidden from screen readers (they read the words) and shows the type without relying on color. This matters most in the nursing-home theme, where the brand orange, the error red and the warning amber are close in hue and lightness.

Pass **`boxed`** for a notice that stands on its own in a page: **a pale tint in the type's color, the sign and the words; no edge and no side bar** (`warning` `status-warning-bg`, `error` `status-error-bg` with `status-error-text` words, `success` `status-success-bg` with `status-success-text` words, `info` `status-info-bg`; status colors are the same in every theme). A dark edge or a colored stripe would make the notice look like a control or a banner; the sign already carries the type. The words carry the meaning. Keep it to the sentence that helps the user act now. A ConfirmationPanel on a staff screen follows the same rule.

A notice about a hand-off result starts with the app's own state word and gives the other side's reason in their words (KSK: "Bị từ chối:" with the Sở's reason; "Chưa rõ kết quả:" with "check the status first"). **Never tell staff to resend when the outcome is unknown**: the other system may already hold it.

`text` may hold a link as well as words. `live={false}` takes the notice out of the live region, for text that changes by itself such as a countdown ("còn 22 giây"), which would otherwise be read out every second; announce the start and the end with a separate status line.
