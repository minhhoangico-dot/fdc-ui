# DateInput

A date the person already knows, typed as three boxes: Ngày / Tháng / Năm.

Use for date of birth (default: browsers can autofill it) and for dates printed on a paper (visit date: `birthday={false}`). Typing is faster and less error-prone for older patients than a calendar picker. The consumer validates with `partsToDate()` and passes `error` ("Ngày sinh không có thật, vui lòng kiểm tra lại"). For choosing a future appointment use TimeSlotPicker, not this.
