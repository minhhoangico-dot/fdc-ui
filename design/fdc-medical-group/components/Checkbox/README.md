# Checkbox

One yes/no statement the person ticks: "Tôi đã xem phần nhập tay". A native checkbox inside its label, so the whole label row is the click target and never shorter than 44px (`target-min`). The row is only as wide as its words, so a tap in the empty space beside it does not tick the box. The box is 24px (1.5rem) and filled with `action-primary-bg` when ticked (blue in the clinic, orange in the nursing home); focus shows the 3px `focus-ring` around the box.

Write the label as a statement in sentence case, saying what ticking means. `hint` sits under the label, lined up with its text, and says what is being confirmed ("1 kết quả nhập tay: X-quang tim phổi"). `error` shows one message above the box and one 3px `status-error-text` bar on the left, like a RadioGroup, with a hidden "Lỗi:" prefix for screen readers; the box keeps its normal edge. Hint and error are read as the box's description. `required` shows a red asterisk. The consumer owns the value (`checked` / `defaultChecked` / `onChange`).

Use it for one confirmation or one independent yes/no. For one choice from a list use RadioGroup; never a pair of checkboxes for Không / Có. A button that needs the tick says why while it is unticked (Button `disabledReason`: "Tích “Tôi đã xem phần nhập tay” để gửi.").
