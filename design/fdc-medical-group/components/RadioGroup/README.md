# RadioGroup

One choice from a short list, shown as large tappable tiles built on native radio buttons.

Use for short questions such as "Bạn đặt lịch cho ai?" or the service to book (up to about 7 options; longer lists need search or a select). Each tile is at least 48px tall and fully clickable; arrow keys move between options. An option may have a one-line `description`, read as the radio's description. On one-question pages pass `hideLegend` when the page heading already asks the question, or `legendAsHeading` to make the question the page's h1. Pass `id` so an ErrorSummary can link to the first option.
