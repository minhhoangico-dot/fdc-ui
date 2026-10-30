# SaveStatus

The save line of a staff form, one of five moments:

| State | Reads | Color |
|---|---|---|
| unsaved | "8 ô chưa lưu · Lưu lần cuối 09:12" | `status-info-text` (work started, not finished); the time in `text-muted` |
| saving | "Đang lưu…" | `status-info-text` |
| saved | "✓ Đã lưu 09:15" | `status-success-text` (the server confirmed) |
| conflict | "(!) Cần xử lý 2 giá trị trước khi lưu · Lưu lần cuối 09:12" | `status-warning-text`, 600, and the "!" sign in an amber circle (`status-warning-border`); the time in `text-muted`. Never green: nothing new is saved until each value is settled |
| error | "(!) Lưu không được: mất mạng. Chữ đã gõ vẫn còn (8 ô chưa lưu)." + "Lưu lại" | `status-error-text`, 600, and the "!" sign in a red circle (`status-error-text`) |

It counts **unsaved fields** ("ô chưa lưu") only. Items still to fill ("mục còn thiếu") are a different count with a different name, shown elsewhere; never mix the two in one number. The typed data is never thrown away: "Lưu lại" only tries again. It sits in StaffLayout's action bar, next to the screen's buttons.

**Signs** (version 2.4). The conflict and the failed save carry the "!" sign in a circle, as FormNotice does, because in the nursing-home theme the red and the amber sit next to an orange button and color alone does not tell them apart. The sign stays with the first line when the words wrap and is hidden from screen readers (the words say it). "Đã lưu" keeps its light ✓; unsaved and saving have no sign.

**No dot at a line edge.** The last save time is a chunk of its own that never breaks ("Lưu lần cuối 09:12"). The dot before it is drawn in the gap between the two chunks; when the time wraps to the next line, its dot is clipped, so no line starts or ends with "·".

**One live region per moment, never a count.** A polite `role="status"` is always in the page and says each new moment once: "ô chưa lưu" when the first change is typed, "Đang lưu…", "Đã lưu 09:15", "Cần xử lý" when a conflict starts. While a person types, the count on the line goes up ("1 ô chưa lưu", "2 ô chưa lưu"…) without anything being read over the typing, and settling one of two conflicting values is not read either. The counted words show once for the eye (hidden from screen readers) and are heard once, in place, with the count beside the region rather than in it, so reading the line gives the current count. A failed save empties the region and adds a `role="alert"` holding "Lưu không được: mất mạng. Chữ đã gõ vẫn còn", which is read once, at once. The count in brackets and the "Lưu lại" button sit outside both regions: typing into another field while the network is down does not read the failure again, and the button's name is never part of the message.

**Conflict** (version 2.4) is for two people changing the same fields of one record: the screen shows both values at each field and this line counts how many are still to settle (`{ state: 'conflict', count, lastSavedAt }`). While it shows, the line must not say "Đã lưu" or use any success color, even though the last save did succeed; "Lưu lần cuối 09:12" says what is safe.
