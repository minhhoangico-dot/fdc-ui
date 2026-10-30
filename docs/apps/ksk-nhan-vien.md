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
| Cần điền (còn n mục) | neutral | The list's word for Chưa điền and Còn thiếu: required items still empty. The count sits under the tag ("còn 61 mục"), not in it | Điền, Điền tiếp | Sẵn sàng xem lại |
| Đang chờ | info | Waiting for someone else: HIS (lab results not approved yet) or Minh (asked to check, e.g. choose the HIS person) | none in the list; Hủy yêu cầu for a request to Minh | Cần điền / Sẵn sàng xem lại |
| Ô chưa lưu (n ô) | info | Changes typed, not written yet | Lưu (Ctrl + S), Bỏ thay đổi | Đang lưu |
| Cần xử lý (n giá trị) | attention | Someone else saved the same field after this page was opened | Choose one value ("Dùng 53 kg của chị Mai" / "Giữ 52,5 kg của tôi") | Ô chưa lưu |
| Đang lưu | info | Save request sent | none | Đã lưu / Lưu lỗi |
| Đã lưu | success | Server confirmed the write | Sửa, Xem lại | — |
| Lưu lỗi | error | Server refused or network failed | Lưu lại | Đang lưu |
| Cần sửa | error | Check found a wrong value | Sửa | Còn thiếu / Sẵn sàng xem lại |
| Sẵn sàng xem lại | neutral | Saved, nothing missing, no errors | Xem lại trước khi gửi (Ctrl + Enter) | Chờ gửi |
| Chờ gửi | info | User confirmed; the 30-second undo window runs (staff may already work on the next person). The tag never counts: the seconds are in the panel ("Còn 30 giây để hủy."), the list says "Hủy được đến 09:31:22" | Hủy gửi | Đang gửi / Sẵn sàng xem lại |
| Đang gửi | info | Sent to the department, no answer yet | none | Sở đã tiếp nhận / Bị từ chối / Chưa rõ kết quả |
| Sở đã tiếp nhận | success | Department returned a receipt code | Xem mã | Bộ đã xác nhận |
| Bộ đã xác nhận | success | Ministry confirmed receipt | Xem mã | — |
| Bị từ chối | error | Department refused and gave a reason | Mở phần cần sửa, Nhờ Minh kiểm tra | Cần sửa → Sẵn sàng xem lại |
| Chưa rõ kết quả | attention | No answer within 10 minutes, or the connection broke after sending: the department may have received it | Kiểm tra lại trạng thái, Nhờ Minh kiểm tra. **Never "Gửi lại"** until the status is known | Sở đã tiếp nhận / Bị từ chối |
| Chờ Minh kiểm tra | info | Staff asked for help (shown in the list as Đang chờ). A refused or unknown record keeps its own state and tag instead, with the note "Đã nhờ Minh kiểm tra lúc 09:42", so the reason to act stays visible | Hủy yêu cầu ("Đã hủy yêu cầu nhờ Minh.") | per Minh's decision |

**The count is never inside the tag.** The tag names the state ("Cần điền", "Cần xử lý"); the count is muted text beside it or under it when narrow ("còn 48 mục", "1 giá trị"), never joined by "·". The same on the list and on the entry page's PatientContextBar.

## List groups and counts

- **Groups:** Cần điền hoặc sửa = Cần điền, Cần sửa, Bị từ chối; Sẵn sàng xem lại; Đang chờ; Đang gửi = Chờ gửi, Đang gửi, Chưa rõ kết quả; Sở đã tiếp nhận = Sở đã tiếp nhận, Bộ đã xác nhận; Tất cả.
- **Filter labels carry the count:** "Cần điền hoặc sửa · 1.019", "Tất cả · 2.033" (pills from 40rem, a Select on phones).
- **Batch line:** "Cả đợt 2.033 người", "1.273 làm được ngay …", "253 đang chờ", "506 Sở đã tiếp nhận" (Sở đã tiếp nhận and Bộ đã xác nhận together).
- **Search** ("Tìm người"): STT, mã lượt khám, tên or the last 4 digits of the CCCD, tone marks optional, every word must match. A match in another group says "Còn 1 người khớp “pham van nam” ở nhóm khác." with "Tìm trong Tất cả".
- **"Làm tiếp: Vũ Đức Khánh"** opens the first record in Cần điền hoặc sửa that nobody else has open; a record open elsewhere shows "Chị Mai đang mở" under Việc tiếp theo.
- **"Làm được ngay"** counts Cần điền hoặc sửa, Sẵn sàng xem lại and Chưa rõ kết quả: 1.273 = 1.019 + 253 + 1 in the sample batch. When some of it sits in another group the batch line says where: "1.273 làm được ngay (1 chưa rõ kết quả ở nhóm Đang gửi)", computed from the data, shown only when there is one.
- **Columns:** STT; Họ tên, name first with "Nam  Sinh 12/04/1985  CCCD …0001" under it in caption size, set apart by space ("Chưa có CCCD" when missing); Mã lượt khám; Trạng thái, the tag on one line with its count under it for Cần điền and Cần sửa ("còn 61 mục"); Việc tiếp theo, with Mã Sở …118204 under it as metadata.

## Entry page (Nhập kết quả)

- **The main button follows the moment:** unsaved changes → "Lưu" (after a failed save, "Lưu lại"); saved but items missing → "Đến mục còn thiếu"; complete → "Xem lại trước khi gửi". It never becomes the send.
- **Field names in the error summary** are the short ones: "Mạch", "Tâm thu", "Tâm trương", "Phân loại thể lực"; the heading counts ("Còn 4 mục chưa điền"); each field keeps "Điền mạch", "Điền tâm thu".
- **After "Xem lại"**, a measurement's page error ("Điền mạch") shows only while it is empty; once something is typed, its own message shows (the Cao/Thấp tag, or its range error after leaving). The choice groups "Phân loại thể lực" and "Phân loại sức khỏe" keep "Điền …" until the next press, because their error line has no reserved room.
- **Other parts on phones:** "Còn 44 mục ở 3 phần" with links "Tiền sử (17)", "Lâm sàng (25)", "Kết luận (2)"; from 40rem "… phần khác" with "3. Tiền sử: còn 17". The part toggle reads "4. Thể lực · còn 4" (on part 7: "7. Kết luận · còn 2").
- **Conflict:** the question "Cân nặng: chị Mai vừa lưu 53 kg lúc 09:14 ở máy khác. Ô này của chị đang là 52,5 kg, chưa lưu. Chọn một giá trị; hoso không tự ghi đè."; choices "Dùng 53 kg của chị Mai" / "Giữ 52,5 kg của tôi"; the weight box is read-only with the hint "Chị Mai: 53 kg"; the save line reads "Cần xử lý 1 giá trị trước khi lưu"; "Lưu" stays but says "Chọn một giá trị cân nặng trước khi lưu." and "Xem lại" is hidden. Ctrl + S or Ctrl + Enter moves focus to the question with its ring; a click on its words focuses it without the ring.
- **Diagnoses:** CodeList (name first, ICD-10 code after) next to a free-text field for the doctor's own words on the paper form.

## Sending to the Sở (Xem lại trước khi gửi)

- **Before the button:** "Hồ sơ được ký bằng token của BS Hoàng Thị Cúc và gửi thật lên Sở Y tế. Bấm gửi xong có 30 giây để hủy." (the signer is also in the person block, "Người ký: BS …"), with "Quay lại sửa" beside the send button. The person block (PatientContextBar `variant="block"`, after the title) stays in view down to the tick box and the send button.
- **The send button names who is sent:** "Gửi lên Sở: Ngô Văn Nam". It works only after the tick box "Tôi đã đối chiếu phần nhập tay với phiếu giấy" (hint "1 kết quả nhập tay: X-quang tim phổi (chị Lan nhập)"); until then it says "Tích ô đối chiếu phần nhập tay để gửi." Once sent, the box becomes the line "Đã đối chiếu phần nhập tay với phiếu giấy (chị Lan, 09:31)."
- **Changed after opening:** if someone saved the record after this page was opened, nothing is sent: heading "Hồ sơ vừa đổi", notice "Chưa gửi gì. Chị Mai vừa sửa phần 4. Thể lực lúc 09:14, sau khi chị mở trang này: cân nặng từ 65 kg thành 66 kg.", button "Xem phần 4. Thể lực"; the changed value carries the tag "Chị Mai sửa 09:14" and the facts say "Bản này lưu lúc 09:14 bởi chị Mai"; the state stays Sẵn sàng xem lại.
- **Undo window:** panel "Chờ gửi lên Sở" (`tone="pending"`), with "Còn 30 giây để hủy. Chưa có gì lên Sở." under the title; the heading never counts. Under "Người sau: Đặng Thanh Chi" the line "Hồ sơ vẫn ở nhóm Đang gửi; hủy được từ đầu trang người sau." "Hủy gửi" cancels; after a cancel the notice reads "Chưa có gì lên Sở; hồ sơ mở lại để chị sửa." under the heading "Đã hủy gửi".
- **Next person:** "Người sau: Đặng Thanh Chi" during the window. The next person's page shows "Ngô Văn Nam: chờ gửi lên Sở. Còn 22 giây để hủy." (what is left of the 30, counting down) with "Hủy gửi Ngô Văn Nam", then "Mở hồ sơ Ngô Văn Nam" after a cancel and "Xem trạng thái gửi" after the countdown; the notice then reads "Đã hủy gửi. Hồ sơ Ngô Văn Nam mở lại để sửa, chưa có gì lên Sở." or "Ngô Văn Nam đã chuyển sang Đang gửi." (a hidden status says "Ngô Văn Nam đang chờ gửi lên Sở; còn hủy được." once at the start, never the seconds). In the list the record sits in group Đang gửi with "Hủy được đến 09:31:22"; opening it offers "Hủy gửi".
- **Where each answer lands:** accepted → group "Sở đã tiếp nhận" (`emphasis="subtle"` panel, receipt code); refused → "Cần điền hoặc sửa", with the department's reason and the path sửa → lưu → xem lại → gửi lại (`tone="error"`, "Mở phần 7. Kết luận để sửa"); unknown → stays in "Đang gửi" (`tone="attention"`, "Kiểm tra lại trạng thái", "Nhờ Minh kiểm tra").
- **Step lines** (done steps say what happened, the step waited for says "Chờ …", later steps are plain event names):
  - Chờ gửi: "Đã xem lại" ✓ → "Chờ gửi" (clock) → "Sở tiếp nhận" → "Bộ xác nhận".
  - Đang gửi and Chưa rõ kết quả: "Đã xem lại" ✓ → "Đã gửi lên Sở" ✓ → "Chờ Sở trả lời" (clock) → "Bộ xác nhận".
  - Sở đã tiếp nhận: "Đã xem lại" ✓ → "Đã gửi lên Sở" ✓ → "Sở đã tiếp nhận" ✓ → "Chờ Bộ xác nhận" (clock).
  - Bị từ chối: "Đã gửi lên Sở" ✓ → "Sở từ chối" (!) → "Chờ chị sửa" (clock) → "Xem lại" → "Gửi lại".
- **What a screen reader hears**, once per moment. When focus moves to the new panel's heading, the status line says only what the heading does not: "Còn 30 giây để hủy.", "Chưa có gì lên Sở; hồ sơ mở lại để chị sửa.", "Không hủy được nữa.". When focus stays where it was, it says the whole moment: "Đang gửi lên Sở, không hủy được nữa.". "Kiểm tra lại trạng thái" keeps focus while it asks ("Đang hỏi Sở…"); only the answer moves focus, to the heading "Sở đã tiếp nhận" (if focus was still in the panel; otherwise the status line says "Sở đã tiếp nhận hồ sơ.").
- **Part 1 facts** are whole chunks: "Nam", "Sinh 15/03/1990", "CCCD …0004".

## Sample screens and test

- Storybook › Pages › Nhân viên: Danh sách hồ sơ, Nhập kết quả, Xem lại trước khi gửi, each with a phone view and its failure states (no network, nothing found, a failed save, two people editing the same field, a record changed before sending, a refused send, an unknown outcome). They are examples of this app, with mock data; the guide's rules are what other apps reuse.
- Usability test: `docs/usability-test-v2.4.md` (Vietnamese, 60–75 minutes per staff member). Run it before building the real hoso screens.

## Open questions for Minh

- **Who sends (2.5):** keep hand-sending per batch, or add "Chờ Minh duyệt" before an automatic send.
- **Out-of-range values before a send:** a typed value outside its allowed range (Tâm thu 350, "! Từ 50 đến 300") counts as filled today, so the summary and "Xem lại" do not stop on it. Should the summary also list invalid values ("Kiểm tra tâm thu")?
- **Normal ranges** for vital signs and labs, and whether a very abnormal value needs a confirmation step: set by a doctor; the sample values are examples only.
