# ContactForm

The nursing home's contact request: name, phone and an optional message, each with a leading icon.

It validates name and phone on submit and calls `onSubmit` with trimmed values. The consumer sends the request and passes `submitting` and a `notice` back ("Đã gửi. Chúng tôi sẽ gọi lại cho bạn sớm."). Use `intro` for one line of context. Pair it with a framed HotlineCard in contact sections.

It validates on submit and shows an ErrorSummary that takes focus and links to each field. The phone accepts spaces and +84 (PhoneInput).
