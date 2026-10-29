# PatientContextBar

Who is being worked on, always in view on a staff form: the name as the page heading (`headingLevel`, default 1), then sex · date of birth with age · "CCCD …0006" (last four digits only) · record code · company, a StatusTag with the record's state, and the way to the previous or next person. A Breadcrumb sits above the name.

**Name, date of birth and record code are never hidden**: they are what tells two people with similar names apart. Missing facts are simply left out (no "undefined", no empty dots). Facts wrap whole, and the dot ends a fact, so a wrapped line never starts with one. The age is counted on `ageOn` (set it to the exam date for past records).

With `sticky` it stays at the top while the form scrolls, from 1024px up. Below that, the compact Header's thin bar (`collapseOnScroll` + `compactBar`) keeps the name, date of birth and code in view instead, so only one bar holds the top of the screen at any width. Place it in StaffLayout's `context` slot; on a review page it can sit inside the content with `headingLevel={2}`.
