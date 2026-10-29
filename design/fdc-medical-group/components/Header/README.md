# Header

Site header: logo, hotline in the same place on every page, optional opening hours and call to action, and the main menu.

On phones the menu sits behind a "Menu" button. Items with `children` become buttons that open sub-menus on click or Enter, never on hover alone; Esc closes them and returns focus. Mark the current page with `current`. The clinic uses "Đặt lịch khám" as its call to action; the nursing home "Đăng ký tham quan". Use each site's own logo on the white header.

**`variant="compact"` for staff tools** (hoso, FDC Manager): one white row at most 60px tall, so the work gets the height. The logo is 44px tall with the app name beside it (`appName`, Montserrat 700, 18px), the main menu sits in the same row, and the `tools` slot on the right holds system status, the signed-in person and "Đăng xuất". No hotline, hours or call to action. Below 1024px (phones and tablets) the menu and tools move behind the "Menu" button, so the bar stays one row.

With **`collapseOnScroll`** the compact header sticks to the top; below 1024px, after scrolling down, the logo row shrinks to a thin bar showing `compactBar` (the person being worked on: name, date of birth, record code) and the Menu button. The public two-row header is unchanged.
