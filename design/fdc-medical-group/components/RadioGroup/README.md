# RadioGroup

One choice from a short list, shown as large tappable tiles built on native radio buttons.

Use for short questions such as "Bạn đặt lịch cho ai?" or the service to book (up to about 7 options; longer lists need search or a select). Each tile is at least 48px tall and fully clickable; arrow keys move between options. An option may have a one-line `description`, read as the radio's description. On one-question pages pass `hideLegend` when the page heading already asks the question, or `legendAsHeading` to make the question the page's h1. Pass `id` so an ErrorSummary can link to the first option.

- **`layout="row"`** puts short answers side by side, sharing the width: Không / Có, Loại I–V. The question then reads as a field label (body text, 16px medium), so a form with 25 history questions stays calm. Options never shrink below their own words: on a narrow phone the last ones wrap to a second line instead of cutting "Loại III".
- **`layout="wrap"`** sizes each option to its words and lets them flow onto more lines: for list filters with counts ("Cần điền hoặc sửa · 1.017", "Tất cả · 2.033").
- **`density="compact"`** tightens padding and gaps so five short options fit a 360px phone; every option is still a 44px target.
- **Errors are reported once for the whole group**: one message under the question and one 3px `status-error-text` bar on the left of the group, with 15px padding. The options keep their normal 1px `border-control` edge. An unanswered group is neutral ("Chưa điền") until the user presses check or review.
