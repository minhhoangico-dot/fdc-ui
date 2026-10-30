# Breadcrumb

Where a staff page sits: "Việc của tôi › Rạng Đông KSK 2026 › Người 6 / 2.033". A `nav` labelled "Vị trí"; the last item is the current page (`aria-current="page"`) and is not a link. Links are 44px tall for touch without adding visible height. Long names wrap onto a second line instead of pushing the page sideways.

The "›" ends each item but the last (inside its list item, hidden from screen readers), so a wrapped line always starts with a place, never with a separator.

Staff tools only: public pages are shallow and use the header menu. PatientContextBar shows one above the person's name.
