# SaveStatus

The save line of a staff form, one of four moments:

| State | Reads | Color |
|---|---|---|
| unsaved | "8 ô chưa lưu · Lưu lần cuối 09:12" | `status-info-text` (work started, not finished) |
| saving | "Đang lưu…" | `status-info-text` |
| saved | "✓ Đã lưu 09:15" | `status-success-text` (the server confirmed) |
| error | "Lưu không được: mất mạng. Chữ đã gõ vẫn còn (8 ô chưa lưu)." + "Lưu lại" | `status-error-text` |

It counts **unsaved fields** ("ô chưa lưu") only. Items still to fill ("mục còn thiếu") are a different count with a different name, shown elsewhere; never mix the two in one number. Changes are announced politely (`role="status"`); a failed save is announced at once (`role="alert"`). The typed data is never thrown away: "Lưu lại" only tries again. It sits in StaffLayout's action bar, next to the screen's buttons.
