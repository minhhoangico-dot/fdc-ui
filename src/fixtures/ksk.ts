// Mock data for the staff pages (health-check records, "hồ sơ KSK"), modelled on the hoso app.
// Every person is invented. Names include long ones and near-duplicates on purpose; some fields are missing.
import type { ComboboxOption } from '../components/molecules/Combobox';

/**
 * Record states as the list shows them (README, record states, v2.4); the same words on every page. Each is one real
 * event: "Đang gửi" is not "Sở đã tiếp nhận", and the old "Gửi lỗi" is split into "Bị từ chối" (the department gave a
 * reason: fix and resend) and "Chưa rõ kết quả" (no answer: the department may hold it, so check before anything is
 * resent). "Cần điền" covers a record with required items still empty (nothing typed yet, or saved with n missing);
 * "Đang chờ" is waiting for someone else (HIS or Minh).
 */
export type RecordStatus =
  | 'Cần điền'
  | 'Cần sửa'
  | 'Sẵn sàng xem lại'
  | 'Đang chờ'
  | 'Chờ gửi'
  | 'Đang gửi'
  | 'Sở đã tiếp nhận'
  | 'Bộ đã xác nhận'
  | 'Bị từ chối'
  | 'Chưa rõ kết quả';

export type KskRecord = {
  stt: number;
  name: string;
  sex: 'Nam' | 'Nữ';
  birthDate: string;
  idEnd?: string;
  company: string;
  role?: string;
  recordCode: string;
  status: RecordStatus;
  /** The next thing to do, in words. */
  next: string;
  /** The department's receipt code, once it has one ("SYT-HN-2026-118204"); shown after "Mã Sở:" and never broken. */
  receipt?: string;
  /** Required items still empty ("mục còn thiếu"). */
  missing: number;
  /** Someone else has the record open on another computer. */
  openBy?: string;
};

/**
 * The groups the list is filtered by, with the statuses each one holds (v2.4). Where a send's answer lands:
 * received → Sở đã tiếp nhận; refused → Cần điền hoặc sửa; unknown → stays in Đang gửi, to check the status.
 */
export const recordGroups: Array<{ value: string; label: string; statuses: RecordStatus[] }> = [
  // A refusal comes back with a reason, so it is work to do again: it sits with the records to fill or fix.
  { value: 'can-lam', label: 'Cần điền hoặc sửa', statuses: ['Cần điền', 'Cần sửa', 'Bị từ chối'] },
  { value: 'xem-lai', label: 'Sẵn sàng xem lại', statuses: ['Sẵn sàng xem lại'] },
  // Waiting for someone else: HIS (lab results not approved yet) or Minh (asked to check).
  { value: 'dang-cho', label: 'Đang chờ', statuses: ['Đang chờ'] },
  // Everything sent or about to be: the undo window ("Chờ gửi", still cancellable), sent with no answer yet, and an
  // unknown outcome, which stays here until the status is checked (it is never resent blindly).
  { value: 'dang-gui', label: 'Đang gửi', statuses: ['Chờ gửi', 'Đang gửi', 'Chưa rõ kết quả'] },
  { value: 'da-gui', label: 'Sở đã tiếp nhận', statuses: ['Sở đã tiếp nhận', 'Bộ đã xác nhận'] },
  { value: 'tat-ca', label: 'Tất cả', statuses: [] },
];

/** What staff can act on now (the list's "làm được ngay"): fill or fix, review, and check an unknown outcome. */
export const actionableStatuses: RecordStatus[] = ['Cần điền', 'Cần sửa', 'Bị từ chối', 'Sẵn sàng xem lại', 'Chưa rõ kết quả'];

const hand: KskRecord[] = [
  { stt: 1, name: 'Vũ Đức Khánh', sex: 'Nam', birthDate: '12/04/1985', idEnd: '0001', company: 'Công ty TNHH Rạng Đông', role: 'Trưởng phòng', recordCode: 'RD26-0001', status: 'Cần điền', next: 'Nhập phường / xã cư trú', missing: 61 },
  { stt: 2, name: 'Lê Thị Hà', sex: 'Nữ', birthDate: '03/09/1992', idEnd: '0002', company: 'Công ty TNHH Rạng Đông', role: 'Kế toán', recordCode: 'RD26-0002', status: 'Cần sửa', next: 'Kiểm tra lại số CCCD với năm sinh 1992', missing: 30 },
  { stt: 3, name: 'Tôn Nữ Hoàng Bảo Ngọc Phương Thảo', sex: 'Nữ', birthDate: '21/12/1978', idEnd: '0003', company: 'Công ty Cổ phần Bóng đèn Phích nước Rạng Đông – Chi nhánh Bắc Ninh', role: 'Nhân viên kiểm soát chất lượng sản phẩm', recordCode: 'RD26-0003', status: 'Cần điền', next: 'Chọn Không hoặc Có cho 17 câu tiền sử', missing: 47, openBy: 'Chị Mai đang mở' },
  { stt: 4, name: 'Ngô Văn Nam', sex: 'Nam', birthDate: '15/03/1990', idEnd: '0004', company: 'Công ty TNHH Rạng Đông', role: 'Kỹ sư', recordCode: 'RD26-0004', status: 'Chờ gửi', next: 'Hủy được đến 09:31:22', missing: 0 },
  { stt: 5, name: 'Phạm Văn Nam', sex: 'Nam', birthDate: '08/08/1990', idEnd: '0005', company: 'Công ty TNHH Rạng Đông', role: 'Trưởng phòng', recordCode: 'RD26-0005', status: 'Đang chờ', next: 'Chờ Minh: chọn người HIS (2 người gần trùng tên)', missing: 60 },
  { stt: 6, name: 'Đặng Thanh Chi', sex: 'Nữ', birthDate: '07/07/1990', idEnd: '0006', company: 'Công ty TNHH Rạng Đông', role: 'Nhân viên văn phòng', recordCode: 'RD26-0006', status: 'Cần điền', next: 'Nhập mạch và huyết áp', missing: 48 },
  { stt: 7, name: 'Nguyễn Thị Mai Anh', sex: 'Nữ', birthDate: '29/02/1996', company: 'Công ty TNHH Rạng Đông', recordCode: 'RD26-0007', status: 'Cần điền', next: 'Nhập số CCCD', missing: 62 },
  { stt: 8, name: 'Đỗ Đức Bình', sex: 'Nam', birthDate: '15/06/1995', idEnd: '0008', company: 'Công ty TNHH Rạng Đông', role: 'Kỹ sư', recordCode: 'RD26-0008', status: 'Bị từ chối', next: 'Sở trả lại: thiếu kết luận phân loại sức khỏe', missing: 1 },
  { stt: 9, name: 'Trần Ngọc Phương', sex: 'Nữ', birthDate: '30/11/1979', idEnd: '0009', company: 'Công ty TNHH Rạng Đông', role: 'Trưởng phòng', recordCode: 'RD26-0009', status: 'Chưa rõ kết quả', next: 'Gửi lúc 09:31, Sở chưa trả lời: kiểm tra lại trạng thái, chưa gửi lại', missing: 0 },
  { stt: 10, name: 'Hoàng Minh Đức', sex: 'Nam', birthDate: '02/01/1991', idEnd: '0010', company: 'Công ty TNHH Rạng Đông', role: 'Lái xe', recordCode: 'RD26-0010', status: 'Sở đã tiếp nhận', next: 'Chờ Bộ xác nhận', receipt: 'SYT-HN-2026-118204', missing: 0 },
  // Near-duplicate of Phạm Văn Nam (RD26-0005): "pham van nam" finds both; birth date and CCCD tell them apart.
  { stt: 11, name: 'Phạm Văn Năm', sex: 'Nam', birthDate: '18/08/1991', idEnd: '0011', company: 'Công ty TNHH Rạng Đông', role: 'Công nhân', recordCode: 'RD26-0011', status: 'Cần điền', next: 'Nhập mạch và huyết áp', missing: 3 },
];

const family = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Vũ', 'Võ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý'];
const middle = { Nam: ['Văn', 'Đức', 'Minh', 'Quang', 'Hữu', 'Thành'], Nữ: ['Thị', 'Thu', 'Ngọc', 'Thanh', 'Bích', 'Hồng'] } as const;
const given = { Nam: ['Hùng', 'Dũng', 'Tuấn', 'Long', 'Sơn', 'Hải', 'Phúc', 'Khoa', 'Trung'], Nữ: ['Hương', 'Lan', 'Hoa', 'Trang', 'Linh', 'Yến', 'Hạnh', 'Nhung', 'Vân'] } as const;
const roles = ['Công nhân', 'Kỹ sư', 'Kế toán', 'Nhân viên văn phòng', 'Lái xe', 'Thủ kho', 'Bảo vệ'];
const nexts: Array<[RecordStatus, string, number]> = [
  ['Cần điền', 'Nhập mạch và huyết áp', 3],
  ['Cần điền', 'Chọn Không hoặc Có cho 25 câu tiền sử', 62],
  ['Cần điền', 'Nhập ngày giờ khám', 62],
  ['Cần sửa', 'Thị lực mắt phải 12/10: kiểm tra lại', 1],
  ['Sẵn sàng xem lại', 'Xem lại trước khi gửi', 0],
  ['Sở đã tiếp nhận', 'Chờ Bộ xác nhận', 0],
  ['Bộ đã xác nhận', 'Không cần làm gì thêm', 0],
  ['Đang chờ', 'Chờ HIS duyệt kết quả xét nghiệm', 12],
];

/** A deterministic list of `count` records: the eleven hand-written ones first, then generated ones. */
export function makeRecords(count: number): KskRecord[] {
  const out = hand.slice(0, count);
  for (let i = out.length; i < count; i += 1) {
    const sex = i % 3 === 0 ? 'Nữ' : 'Nam';
    const [status, next, missing] = nexts[(i * 7) % nexts.length];
    const n = String(i + 1).padStart(4, '0');
    out.push({
      stt: i + 1,
      name: `${family[i % family.length]} ${middle[sex][(i * 5) % 6]} ${given[sex][(i * 7) % 9]}`,
      sex,
      birthDate: `${String((i % 28) + 1).padStart(2, '0')}/${String((i % 12) + 1).padStart(2, '0')}/${1965 + (i % 38)}`,
      idEnd: i % 17 === 0 ? undefined : n,
      company: 'Công ty TNHH Rạng Đông',
      role: roles[i % roles.length],
      recordCode: `RD26-${n}`,
      status,
      next,
      receipt: status === 'Sở đã tiếp nhận' || status === 'Bộ đã xác nhận' ? `SYT-HN-2026-${String(110000 + i)}` : undefined,
      missing,
    });
  }
  return out;
}

/** Rạng Đông KSK 2026: 2.033 people, as in the hoso home page. */
export const records = makeRecords(2033);

/** A few ICD-10 codes used on KSK forms: name first, code after. */
export const icd10: ComboboxOption[] = [
  { value: 'I10', label: 'Tăng huyết áp vô căn (nguyên phát)', code: 'I10', keywords: 'cao huyet ap THA', hint: 'Bệnh tuần hoàn' },
  { value: 'E11', label: 'Đái tháo đường type 2', code: 'E11', keywords: 'tieu duong', hint: 'Nội tiết, dinh dưỡng, chuyển hóa' },
  { value: 'E78.0', label: 'Tăng cholesterol máu đơn thuần', code: 'E78.0', keywords: 'mo mau roi loan lipid', hint: 'Nội tiết, dinh dưỡng, chuyển hóa' },
  { value: 'E66', label: 'Béo phì', code: 'E66', hint: 'Nội tiết, dinh dưỡng, chuyển hóa' },
  { value: 'K21', label: 'Bệnh trào ngược dạ dày – thực quản', code: 'K21', keywords: 'trao nguoc GERD', hint: 'Bệnh tiêu hóa' },
  { value: 'K29', label: 'Viêm dạ dày và tá tràng', code: 'K29', keywords: 'dau da day', hint: 'Bệnh tiêu hóa' },
  { value: 'K76.0', label: 'Gan nhiễm mỡ, không phân loại nơi khác', code: 'K76.0', keywords: 'gan nhiem mo', hint: 'Bệnh tiêu hóa' },
  { value: 'J30', label: 'Viêm mũi vận mạch và dị ứng', code: 'J30', keywords: 'viem mui di ung', hint: 'Bệnh hô hấp' },
  { value: 'J45', label: 'Hen phế quản', code: 'J45', keywords: 'hen suyen', hint: 'Bệnh hô hấp' },
  { value: 'H52.1', label: 'Cận thị', code: 'H52.1', keywords: 'can thi mat', hint: 'Bệnh mắt' },
  { value: 'H52.0', label: 'Viễn thị', code: 'H52.0', hint: 'Bệnh mắt' },
  { value: 'K02', label: 'Sâu răng', code: 'K02', keywords: 'sau rang', hint: 'Răng – hàm – mặt' },
  { value: 'M54.5', label: 'Đau thắt lưng', code: 'M54.5', keywords: 'dau lung', hint: 'Cơ – xương – khớp' },
  { value: 'M47', label: 'Thoái hóa cột sống', code: 'M47', keywords: 'thoai hoa', hint: 'Cơ – xương – khớp' },
  { value: 'D50', label: 'Thiếu máu do thiếu sắt', code: 'D50', keywords: 'thieu mau', hint: 'Máu và cơ quan tạo máu' },
  { value: 'N20', label: 'Sỏi thận và niệu quản', code: 'N20', keywords: 'soi than', hint: 'Thận – tiết niệu' },
  { value: 'L20', label: 'Viêm da cơ địa', code: 'L20', keywords: 'cham eczema', hint: 'Da liễu' },
  { value: 'F41', label: 'Rối loạn lo âu khác', code: 'F41', keywords: 'lo au', hint: 'Tâm thần' },
];

/** Occupation groups (Vietnamese standard list, level 1): name first, code in brackets. */
export const occupations: ComboboxOption[] = [
  { value: '1', label: 'Nhà lãnh đạo trong các ngành, các cấp và các đơn vị', code: '1' },
  { value: '2', label: 'Nhà chuyên môn bậc cao', code: '2' },
  { value: '22', label: 'Nhà chuyên môn về sức khỏe', code: '22', hint: 'Thuộc nhóm 2' },
  { value: '3', label: 'Nhà chuyên môn bậc trung', code: '3' },
  { value: '4', label: 'Nhân viên trợ lý văn phòng', code: '4' },
  { value: '5', label: 'Nhân viên dịch vụ và bán hàng', code: '5' },
  { value: '6', label: 'Lao động có kỹ năng trong nông nghiệp, lâm nghiệp và thủy sản', code: '6' },
  { value: '7', label: 'Lao động thủ công và các nghề nghiệp có liên quan khác', code: '7' },
  { value: '8', label: 'Thợ lắp ráp và vận hành máy móc, thiết bị', code: '8' },
  { value: '83', label: 'Lái xe và thợ vận hành thiết bị chuyển động', code: '83', hint: 'Thuộc nhóm 8' },
  { value: '9', label: 'Lao động giản đơn', code: '9' },
];

/** Lab results from HIS for the review page. */
export const labResults: Array<{ name: string; value: string; unit: string; flag?: 'Cao' | 'Thấp'; source: 'HIS' | 'Nhập tay'; by?: string }> = [
  { name: 'Hồng cầu (RBC)', value: '4,9', unit: 'T/L', source: 'HIS' },
  { name: 'Huyết sắc tố (HGB)', value: '148', unit: 'g/L', source: 'HIS' },
  { name: 'Hematocrit (HCT)', value: '0,44', unit: 'L/L', source: 'HIS' },
  { name: 'Bạch cầu (WBC)', value: '7,2', unit: 'G/L', source: 'HIS' },
  { name: 'Tiểu cầu (PLT)', value: '250', unit: 'G/L', source: 'HIS' },
  { name: 'Glucose máu', value: '7,2', unit: 'mmol/L', flag: 'Cao', source: 'HIS' },
  { name: 'Ure', value: '5,1', unit: 'mmol/L', source: 'HIS' },
  { name: 'Creatinin', value: '82', unit: 'µmol/L', source: 'HIS' },
  { name: 'AST (GOT)', value: '28', unit: 'U/L', source: 'HIS' },
  { name: 'ALT (GPT)', value: '31', unit: 'U/L', source: 'HIS' },
  { name: 'Cholesterol toàn phần', value: '5,4', unit: 'mmol/L', source: 'HIS' },
  { name: 'Protein niệu', value: 'Âm tính', unit: '', source: 'HIS' },
  { name: 'X-quang tim phổi', value: 'Tim phổi bình thường', unit: '', source: 'Nhập tay', by: 'chị Lan' },
];
