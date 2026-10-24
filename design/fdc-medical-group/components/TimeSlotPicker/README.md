# TimeSlotPicker

Pick one appointment time from a day's slots; taken slots stay visible but cannot be chosen.

Slots are 58px tiles built on real radio buttons: Tab enters, arrow keys move between free times. Taken times are struck through, dashed and labelled "Đã kín", so color is never the only signal. The chosen tile fills with `action-primary-bg`. Pass times as 24-hour "HH:mm" in Hanoi time. When nothing is free it says so and points to another day or the hotline. Pass `id` to let an ErrorSummary link to the first free slot.
