# ResultLookupForm

The clinic's lab-result lookup: visit date, birth year, phone number and patient code.

It validates on submit (4-digit year, Vietnamese phone of 10–11 digits, non-empty code) and calls `onSubmit` with clean values only when all pass. The consumer performs the lookup and passes `submitting` and a `notice` (`success`, `error` or `info`) back. The submit is a primary button labeled "Xem kết quả" (the site used a grey "Kết quả" button). Show the clinic hotline next to it for patients who get stuck.

It validates on submit and shows an ErrorSummary that takes focus and links to each field. The visit date is typed as Ngày / Tháng / Năm (DateInput); the phone accepts spaces and +84 (PhoneInput).
