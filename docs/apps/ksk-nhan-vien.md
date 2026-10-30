# Ứng dụng KSK nhân viên: business rules

The health-check (KSK) staff app, from the hoso health-record app, is FDC's first staff tool built on the design system. This file holds **its own workflow**: who sends, its record states, its list groups and counts, its send to the Sở Y tế, and the exact words on its screens. Approved by Minh on 25/10/2026; revised in version 2.4.

**What is not here.** The principles and component rules every FDC app shares (calm fields, error look, focus, status tags, sticky bars, save line, the hand-off pattern) are in the design system's guide, `design/fdc-medical-group/README.md`, mirrored from the Claude Design master. This file only applies them. A rule moves from here to the guide when a second app would use it unchanged.

**Where it lives.** Here in fdc-ui, next to its sample screens (Storybook › Pages › Nhân viên) and mock data (`src/fixtures/ksk.ts`, `src/fixtures/kskTable.tsx`), until the KSK app has its own repository. Then this file moves with it.

## Who sends

A batch is sent by hand or automatically, and the screen says which (guide: "say who acts").
- Batches sent by hand: the list shows the plain line "Đợt này gửi tay: chị xem lại rồi tự gửi từng hồ sơ.", repeated where the send happens.
- The header's auto-send tag names the one batch it runs for: "Gửi tự động: chỉ đợt F.D.I KSK 2026", tone `info` (running is not success).
- Open for Minh (2.5): a "Chờ Minh duyệt" step before an automatic send.

## Record states

Each state is one real event. "Đã gửi" does not mean "Sở đã tiếp nhận"; only the department's receipt does. Version 2.4 split the old "Gửi lỗi" into "Bị từ chối" and "Chưa rõ kết quả", because resending a record the department may already hold creates a duplicate.

| State | StatusTag tone | Means (the event that sets it) | Allowed actions | Next |
|---|---|---|---|---|
| Chưa điền | muted | Record created, nothing typed | Điền | Đang điền |
| Còn thiếu (n mục) | neutral | Saved, n required items empty | Điền tiếp | Sẵn sàng xem lại |
| Cần điền (còn n mục) | neutral | The list's word for Chưa điền and Còn thiếu: required items still empty | Điền, Điền tiếp | Sẵn sàng xem lại |
| Đang chờ | info | Waiting for someone else: HIS (lab results not approved yet) or Minh (asked to check, e.g. choose the HIS person) | none in the list; Hủy yêu cầu for a request to Minh | Cần điền / Sẵn sàng xem lại |
| Ô chưa lưu (n ô) | info | Changes typed, not written yet | Lưu (Ctrl + S), Bỏ thay đổi | Đang lưu |
| Cần xử lý (n giá trị) | attention | Someone else saved the same field after this page was opened | Choose one value ("Dùng 53 kg của chị Mai" / "Giữ 52,5 kg của tôi") | Ô chưa lưu |
| Đang lưu | info | Save request sent | none | Đã lưu / Lưu lỗi |
| Đã lưu | success | Server confirmed the write | Sửa, Xem lại | — |
| Lưu lỗi | error | Server refused or network failed | Lưu lại | Đang lưu |
| Cần sửa | error | Check found a wrong value | Sửa | Còn thiếu / Sẵn sàng xem lại |
| Sẵn sàng xem lại | neutral | Saved, nothing missing, no errors | Xem lại trước khi gửi (Ctrl + Enter) | Chờ gửi |
| Chờ gửi (còn n giây để hủy) | info | User confirmed; the undo window runs (staff may already work on the next person) | Hủy gửi | Đang gửi / Sẵn sàng xem lại |
| Đang gửi | info | Sent to the department, no answer yet | none | Sở đã tiếp nhận / Bị từ chối / Chưa rõ kết quả |
| Sở đã tiếp nhận | success | Department returned a receipt code | Xem mã | Bộ đã xác nhận |
| Bộ đã xác nhận | success | Ministry confirmed receipt | Xem mã | — |
| Bị từ chối | error | Department refused and gave a reason | Mở phần cần sửa, Nhờ Minh kiểm tra | Cần sửa → Sẵn sàng xem lại |
| Chưa rõ kết quả | attention | No answer within 10 minutes, or the connection broke after sending: the department may have received it | Kiểm tra lại trạng thái, Nhờ Minh kiểm tra. **Never "Gửi lại"** until the status is known | Sở đã tiếp nhận / Bị từ chối |
| Chờ Minh kiểm tra | info | Staff asked for help (shown in the list as Đang chờ). A refused or unknown record keeps its own state and tag instead, with the note "Đã nhờ Minh kiểm tra lúc 09:42", so the reason to act stays visible | Hủy yêu cầu ("Đã hủy yêu cầu nhờ Minh.") | per Minh's decision |

**The count is never inside the tag.** The tag names the state ("Cần điền", "Cần xử lý"); the count is muted text beside it or under it when narrow ("còn 48 mục", "1 giá trị"), never joined by "·". The same on the list and on the entry page's PatientContextBar.

## List groups and counts

- **Groups:** Cần điền hoặc sửa = Cần điền, Cần sửa, Bị từ chối; Sẵn sàng xem lại; Đang chờ; Đang gửi = Chờ gửi, Đang gửi, Chưa rõ kết quả; Sở đã tiếp nhận = Sở đã tiếp nhận, Bộ đã xác nhận; Tất cả.
- **Filter labels carry the count:** "Cần điền hoặc sửa · 1.019", "Tất cả · 2.033" (pills on desktop, a Select on phones).
- **"Làm được ngay"** counts Cần điền hoặc sửa, Sẵn sàng xem lại and Chưa rõ kết quả: 1.273 = 1.019 + 253 + 1 in the sample batch. When some of it sits in another group the batch line says where: "1.273 làm được ngay (1 chưa rõ kết quả ở nhóm Đang gửi)", computed from the data, shown only when there is one.
- **Columns:** name first with date of birth and CCCD …0001 under it in caption size; the state tag on one line with its count under it ("còn 61 mục"); "Việc tiếp theo"; Mã Sở …118204 as metadata.

## Entry page (Nhập kết quả)

- **The main button follows the moment:** unsaved changes → "Lưu" (after a failed save, "Lưu lại"); saved but items missing → "Đến mục còn thiếu"; complete → "Xem lại trước khi gửi". It never becomes the send.
- **Field names in the error summary** are the short ones: "Mạch", "Tâm thu", "Tâm trương", "Phân loại thể lực"; the heading counts ("Còn 4 mục chưa điền"); each field keeps "Điền mạch", "Điền tâm thu".
- **After "Xem lại"**, a measurement's page error ("Điền mạch") shows only while it is empty; once something is typed, its own message shows (the Cao/Thấp tag, or its range error after leaving). The choice groups "Phân loại thể lực" and "Phân loại sức khỏe" keep "Điền …" until the next press, because their error line has no reserved room.
- **Other parts on phones:** "Còn 44 mục ở 3 phần" with links "Tiền sử (17)", "Lâm sàng (25)", "Kết luận (2)"; from 40rem "… phần khác" with "3. Tiền sử: còn 17". The part toggle reads "4. Thể lực · còn 2".
- **Conflict:** "Cần xử lý 1 giá trị trước khi lưu"; choices "Dùng 53 kg của chị Mai" / "Giữ 52,5 kg của tôi". Ctrl + S or Ctrl + Enter moves focus to the question and shows its ring; a click on its words does not.
- **Diagnoses:** CodeList (name first, ICD-10 code after) next to a free-text field for the doctor's own words on the paper form.

## Sending to the Sở (Xem lại trước khi gửi)

- **The send button names who is sent:** "Gửi lên Sở: Ngô Văn Nam", after a tick box confirming the review.
- **Undo window:** panel "Chờ gửi lên Sở" (`tone="pending"`), with "Còn 30 giây để hủy." under the title; the heading never counts. "Hủy gửi" cancels; after a cancel the notice reads "Chưa có gì lên Sở; hồ sơ mở lại để chị sửa." under the heading "Đã hủy gửi".
- **Next person:** "Người sau: Đặng Thanh Chi" during the window. The next person's page shows "Ngô Văn Nam: chờ gửi lên Sở. Còn 20 giây để hủy." with "Hủy gửi Ngô Văn Nam", then "Mở hồ sơ Ngô Văn Nam" after a cancel and "Xem trạng thái gửi" after the countdown. The list row says "Hủy được đến 09:31:22".
- **Where each answer lands:** accepted → group "Sở đã tiếp nhận" (`emphasis="subtle"` panel, receipt code); refused → "Cần điền hoặc sửa", with the department's reason and the path sửa → lưu → xem lại → gửi lại (`tone="error"`, "Mở phần 7. Kết luận để sửa"); unknown → stays in "Đang gửi" (`tone="attention"`, "Kiểm tra lại trạng thái", "Nhờ Minh kiểm tra").
- **Step lines:** "Đã gửi lên Sở" ✓ → "Sở đã tiếp nhận" ✓ → "Chờ Bộ xác nhận" (clock).
- **What a screen reader hears**, once per moment. When focus moves to the new panel's heading, the status line says only what the heading does not: "Còn 30 giây để hủy.", "Chưa có gì lên Sở; hồ sơ mở lại để chị sửa.", "Không hủy được nữa.". When focus stays where it was, it says the whole moment: "Đang gửi lên Sở, không hủy được nữa.". "Kiểm tra lại trạng thái" keeps focus while it asks ("Đang hỏi Sở…"); only the answer moves focus, to "Sở đã tiếp nhận".
- **Part 1 facts** are whole chunks: "Nam", "Sinh 15/03/1990", "CCCD …0004".

## Sample screens and test

- Storybook › Pages › Nhân viên: Danh sách hồ sơ, Nhập kết quả, Xem lại trước khi gửi, each with a phone view and its failure states (no network, nothing found, a failed save, a refused send, an unknown outcome). They are examples of this app, with mock data; the guide's rules are what other apps reuse.
- Usability test: `docs/usability-test-v2.4.md` (Vietnamese, 60–75 minutes per staff member). Run it before building the real hoso screens.

## Open questions for Minh

- **Who sends (2.5):** keep hand-sending per batch, or add "Chờ Minh duyệt" before an automatic send.
- **Out-of-range values before a send:** a typed value outside its allowed range (Tâm thu 350, "! Từ 50 đến 300") counts as filled today, so the summary and "Xem lại" do not stop on it. Should the summary also list invalid values ("Kiểm tra tâm thu")?
- **Normal ranges** for vital signs and labs, and whether a very abnormal value needs a confirmation step: set by a doctor; the sample values are examples only.
