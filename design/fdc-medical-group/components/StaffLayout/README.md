# StaffLayout

Page shell for staff tools (hoso, FDC Manager, reception). It sets `data-density="compact"` and lays out:

1. a skip link and the one-row Header (`variant="compact"` is set for you);
2. `context`: a full-width bar under the header, usually a sticky PatientContextBar on a record form;
3. `aside`: the `<nav>` landmark ("Các phần của phiếu") beside the content from 1024px up, above it on smaller screens. Put a **FormPartNav** in it: the full list of form parts with "còn n" counts on computers, one "4. Thể lực · còn 2 ▾" toggle on phones, so staff do not scroll past seven rows to reach the form;
4. `<main id="main">` on the grey work surface (`surface-alt`): blocks inside are white with a 1px edge and spacing, not shadows;
5. `actionBar`: a sticky bottom bar for the save line (SaveStatus) and the screen's buttons. It floats over content, so it is the one block with `shadow-card`. `shortcuts` adds the Kbd hint line under it from 1024px up only: phones have no Ctrl key.

On phones (below 640px) the rhythm is tighter: 10px above the content, 10px under the aside and 15px between blocks (20px from 640px up), so the work area starts sooner. The page keeps focused fields clear of the sticky bars (`scroll-padding`, WCAG 2.4.11). Leave `theme` out to inherit the brand theme from the page; a nursing-home staff tool is orange and compact. One primary button per screen state, and it changes with the moment: unsaved → "Lưu"; saved but items missing → "Tiếp tục điền"; complete → "Xem lại trước khi gửi".
