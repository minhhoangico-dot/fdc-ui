# FormNotice

The status line under a form (sent, failed, info), announced by screen readers without moving focus.

Use after the request finishes: success in `status-success-text`, failure in `status-error-text` with a way out ("…hoặc gọi 024 35 430 430"). For field problems use ErrorSummary and field errors instead.

Pass **`boxed`** for a notice that stands on its own in a page: a 1px `border-control` edge and a 6px bar on the left in the type's color (`warning` `status-warning-border` amber, `error` `status-error-text`, `success` green, `info` `status-info-border` blue; status colors are the same in every theme). The words carry the meaning; the bar only signals the type. Keep it to the sentence that helps the user act now.
