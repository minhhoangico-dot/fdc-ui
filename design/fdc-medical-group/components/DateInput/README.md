# DateInput

A date the person already knows, typed as three boxes: Ngày / Tháng / Năm.

Use for date of birth (default: browsers can autofill it) and for dates printed on a paper (visit date: `birthday={false}`). Typing is faster and less error-prone for older patients than a calendar picker. The consumer validates with `partsToDate()` and passes `error` ("Ngày sinh không có thật, vui lòng kiểm tra lại"). For choosing a future appointment use TimeSlotPicker, not this.

The error looks like every field's error: the message sits above the boxes after a red circle with "!" (hidden from screen readers, which hear "Lỗi:" from `errorPrefix`), and each box gets a 2px `status-error-text` edge drawn inside it (a 1px border plus a 1px inset shadow), so nothing moves when the error comes or goes. A focused box in error has the dark-ink ring (`text-default`, 3px, 2px gap) in both themes. Hint and error describe the group.

The three boxes are 72 / 72 / 104px wide. In a narrow column (a card on a 320px phone, about 218px) they shrink towards 52 / 52 / 76px, still room for "31" and "1950" and a 44px target, so the date stays on one line; only below that does the year wrap. The default hint "Ví dụ: 27 3 1950" is joined by no-break spaces, so the example date never breaks; do the same in error texts with an example.
