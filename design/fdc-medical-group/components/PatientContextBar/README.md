# PatientContextBar

Who is being worked on, always in view on a staff form: the name as the page heading (`headingLevel`, default 1) with the record's state right after it (a StatusTag), then the facts that tell people apart, and the way to the previous or next person. A Breadcrumb sits above the name.

**Rows**: the breadcrumb; the name and its state, with the previous/next buttons at the end of the same row from 40rem up; the facts. So from 1024px, where the bar sticks, it is about 120px tall at every width and never grows a row of buttons under the facts (version 2.4; it was 185px at 1024px). When the row is too narrow the state wraps under the name.

**Facts** (version 2.4) are whole chunks set apart by space, never by "·" (a dot left at a line end reads like a stray mark): sex unlabelled ("Nữ"), "Sinh 07/07/1990 (36 tuổi)", "CCCD …0006" (last four digits only), "Mã lượt khám **RD26-0006**" (`recordCodeLabel`, the code bold as the value), then the company or ward unlabelled. Each chunk stays on one line; only the company wraps inside itself.

**Name, date of birth and record code are never hidden**: they are what tells two people with similar names apart. Missing facts are simply left out (no "undefined", no empty gaps). The age is counted on `ageOn` (set it to the exam date for past records).

**Previous and next** (`actions`): two Buttons with short visible words, "Người trước" with its arrow before the words and "Người sau" with its arrow after them (`iconPosition="end"`). Each accessible name starts with the visible words and adds the person: `aria-label="Người trước: Ngô Văn Nam"`, `aria-label="Người sau: Nguyễn Thị Mai Anh"`.

**Phones** (below 40rem): the name is 1.25rem (1.5rem from 40rem up), the spacing is tighter, and the two buttons share one row in two equal columns, each on one line at 44px even at 320px.

With `sticky` it stays at the top while the form scrolls, from 1024px up (under any header that sticks above it). Below that, the compact Header's thin bar (`collapseOnScroll` + `compactBar`) keeps the name, date of birth and code in view instead, so only one bar holds the top of the screen at any width. Place it in StaffLayout's `context` slot, which measures it and keeps focused fields and the side column clear of it; on a review page it can sit inside the content with `headingLevel={2}`.

`variant="block"` drops the bar's own bottom edge and fill (never sticky), for placing the person inside a bordered block on a page such as the review page, so the block has one edge, not two. On phones the breadcrumb collapses to "‹ parent".
