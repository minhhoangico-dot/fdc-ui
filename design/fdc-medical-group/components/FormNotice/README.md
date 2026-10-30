# FormNotice

The status line under a form (sent, failed, info), announced by screen readers without moving focus.

Use after the request finishes: success in `status-success-text`, failure in `status-error-text` with a way out ("…hoặc gọi 024 35 430 430"). For field problems use ErrorSummary and field errors instead.

Every notice starts with a **mark**: a small circle in the type's color with a white sign, **"!"** for `error` and `warning`, **"i"** for `info`, **"✓"** for `success`. It is hidden from screen readers (they read the words) and shows the type without relying on color. This matters most in the nursing-home theme, where the brand orange, the error red and the warning amber are close in hue and lightness.

Pass **`boxed`** for a notice that stands on its own in a page: a box tinted in the type's color with a 1px edge and a 6px bar on the left in the same color (`warning` `status-warning-bg` / `status-warning-border`, `error` `status-error-bg` / `status-error-text`, `success` `status-success-bg` / `status-success-text`, `info` `status-info-bg` / `status-info-border`; status colors are the same in every theme). The words carry the meaning; the mark and the bar only signal the type. Keep it to the sentence that helps the user act now.
