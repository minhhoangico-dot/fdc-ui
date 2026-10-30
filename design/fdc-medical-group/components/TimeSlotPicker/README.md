# TimeSlotPicker

Pick one appointment time from a day's slots; taken slots stay visible but cannot be chosen.

Slots are 58px tiles built on real radio buttons: Tab enters, arrow keys move between free times. Taken times are struck through, dashed and labelled "Đã kín", so color is never the only signal. The chosen tile fills with `action-primary-bg`. Pass times as 24-hour "HH:mm" in Hanoi time. When nothing is free it says so and points to another day or the hotline. Pass `id` to let an ErrorSummary link to the first free slot. An error is reported once for the whole group, as on RadioGroup: one message with the red "!" sign (screen readers hear "Lỗi:") and one 3px red bar down the group's start edge; the slots keep their normal edge, because a red box on every free time reads as "all these times are wrong". A focused slot in error takes the dark-ink ring.
