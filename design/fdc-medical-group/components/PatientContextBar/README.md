# PatientContextBar

Who is being worked on, always in view on a staff form: the name as the page heading (`headingLevel`, default 1), then the facts that tell people apart, a StatusTag with the record's state, and the way to the previous or next person. A Breadcrumb sits above the name.

**Facts** (version 2.4) are whole chunks set apart by space, never by "·" (a dot left at a line end reads like a stray mark): sex unlabelled ("Nữ"), "Sinh 07/07/1990 (36 tuổi)", "CCCD …0006" (last four digits only), "Mã lượt khám **RD26-0006**" (`recordCodeLabel`, the code bold as the value), then the company or ward unlabelled. Each chunk stays on one line; only the company wraps inside itself.

**Name, date of birth and record code are never hidden**: they are what tells two people with similar names apart. Missing facts are simply left out (no "undefined", no empty gaps). The age is counted on `ageOn` (set it to the exam date for past records).

**Phones** (below 40rem): the name is 1.25rem (1.5rem from 40rem up), the spacing is tighter, and "Người trước" / "Người sau cần làm" share one row in two equal columns (their words may wrap to two lines) instead of stacking, about 35–55px less than two stacked buttons.

With `sticky` it stays at the top while the form scrolls, from 1024px up. Below that, the compact Header's thin bar (`collapseOnScroll` + `compactBar`) keeps the name, date of birth and code in view instead, so only one bar holds the top of the screen at any width. Place it in StaffLayout's `context` slot; on a review page it can sit inside the content with `headingLevel={2}`.
