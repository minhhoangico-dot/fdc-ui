# ServiceAccordion

An expandable list of services where only one panel is open at a time, from the nursing home's service list.

Each header is an `action-primary-bg` bar with white text and a plus/minus icon; in the nursing-home theme it takes the leaf corner. Pass `items` (`title`, `content`, optional `href` and `moreLabel`). The first item opens by default; pass `defaultOpen={-1}` to start closed. Headers are real buttons with `aria-expanded`, so keyboard and screen readers work.
