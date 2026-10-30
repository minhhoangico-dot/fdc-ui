import { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { Button } from '../components/atoms/Button';
import { Select } from '../components/atoms/Select';
import { StatusTag } from '../components/atoms/StatusTag';
import { TextField } from '../components/atoms/TextField';
import { Inline } from '../components/layout/Inline';
import { Breadcrumb } from '../components/molecules/Breadcrumb';
import { RadioGroup } from '../components/molecules/RadioGroup';
import { DataTable } from '../components/organisms/DataTable';
import { StaffLayout } from '../components/templates/StaffLayout';
import { recordGroups, records as allRecords, type KskRecord } from '../fixtures/ksk';
import { recordColumns } from '../fixtures/kskTable';
import { staffHeader } from '../fixtures/staff';
import { foldVi, formatViInteger } from '../utils/vi';
import styles from './StaffRecordList.module.css';

const PAGE_SIZE = 50;
const BATCH = 'Rạng Đông KSK 2026';

type ListProps = {
  records?: KskRecord[];
  initialGroup?: string;
  initialQuery?: string;
  /** The first load fails (network); "Tải lại" then succeeds. */
  failFirstLoad?: boolean;
  loading?: boolean;
};

/** Every typed word must be found (tone marks optional), so "ton nu thao" finds Tôn Nữ Hoàng Bảo Ngọc Phương Thảo. */
function matcher(query: string) {
  const words = foldVi(query).split(' ').filter(Boolean);
  return (r: KskRecord) => {
    if (!words.length) return true;
    const text = foldVi(`${r.stt} ${r.recordCode} ${r.name} ${r.idEnd ?? ''}`);
    return words.every((w) => text.includes(w));
  };
}

/** Whether a record belongs to a group of the filter; Tất cả holds every record. */
function inGroup(value: string) {
  const statuses = recordGroups.find((g) => g.value === value)?.statuses ?? [];
  return (r: KskRecord) => !statuses.length || statuses.includes(r.status);
}

function RecordList({ records = allRecords, initialGroup = 'can-lam', initialQuery = '', failFirstLoad, loading }: ListProps) {
  const [group, setGroup] = useState(initialGroup);
  const [query, setQuery] = useState(initialQuery);
  const [page, setPage] = useState(1);
  const [failed, setFailed] = useState(Boolean(failFirstLoad));
  // Counts, the batch line and the next person come from the list, so they show only once it has loaded.
  const ready = !loading && !failed;

  const counts = useMemo(
    () => Object.fromEntries(recordGroups.map((g) => [g.value, records.filter(inGroup(g.value)).length])),
    [records],
  );
  const groupDef = recordGroups.find((g) => g.value === group) ?? recordGroups[0];
  const matches = matcher(query);
  const found = query.trim() ? records.filter(matches) : records;
  const rows = found.filter(inGroup(groupDef.value));
  // People who match the search but sit in another group: say so, so a near-duplicate name is not taken for the person.
  const elsewhere = group === 'tat-ca' ? 0 : found.length - rows.length;
  const pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const shown = rows.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const received = records.filter((r) => r.status === 'Sở đã tiếp nhận').length;
  const now = counts['can-lam'] + counts['xem-lai'];
  // The first record to fill or fix that nobody else has open.
  const nextUp = records.find((r) => inGroup('can-lam')(r) && !r.openBy);

  const groupOptions = recordGroups.map((g) => ({ value: g.value, label: ready ? `${g.label} · ${formatViInteger(counts[g.value])}` : g.label }));
  const choose = (v: string) => {
    setGroup(v);
    setPage(1);
  };

  return (
    <StaffLayout header={staffHeader}>
      <Breadcrumb items={[{ label: 'Việc của tôi', href: '#' }, { label: BATCH }]} />
      <Inline align="center" gap={10}>
        <h1 className={styles.Title}>{BATCH}</h1>
        <StatusTag tone="muted">Bạn nhập liệu · Minh duyệt gửi</StatusTag>
      </Inline>

      {/* Search first, then the group: on phones the field sits right under the title. */}
      <div className={styles.Search}>
        <TextField
          label="Tìm người"
          type="search"
          hint="STT, mã lượt khám, tên hoặc 4 số cuối CCCD. Gõ không dấu cũng được."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {/* One filter control per width: pills from 40rem, a Select on phones. */}
      <div className={styles.WideOnly}>
        <RadioGroup label="Nhóm người" name="nhom" variant="pills" layout="wrap" value={group} onValueChange={choose} options={groupOptions} />
      </div>
      <div className={styles.PhoneOnly}>
        <Select label="Nhóm người" value={group} onChange={(e) => choose(e.target.value)} options={groupOptions} />
      </div>

      {ready && query.trim() && elsewhere > 0 ? (
        <p className={styles.Elsewhere}>
          <span>
            Còn {formatViInteger(elsewhere)} người khớp “{query.trim()}” ở nhóm khác.
          </span>
          <Button onClick={() => choose('tat-ca')}>Tìm trong Tất cả</Button>
        </p>
      ) : null}

      <div className={styles.Toolbar}>
        {ready ? (
          <p className={`${styles.Stats} ${styles.WideOnly}`}>
            Cả đợt <strong>{formatViInteger(records.length)}</strong> người · <strong>{formatViInteger(now)}</strong> làm được ngay ·{' '}
            <strong>{formatViInteger(counts['dang-cho'])}</strong> đang chờ · <strong>{formatViInteger(received)}</strong> Sở đã tiếp nhận
          </p>
        ) : null}
        <Inline gap={10} className={styles.Actions}>
          <Button>Lấy kết quả xét nghiệm cả đợt</Button>
          {ready && nextUp ? (
            <Button variant="primary" href={`#ho-so-${nextUp.recordCode}`}>
              Làm tiếp: {nextUp.name}
            </Button>
          ) : null}
        </Inline>
      </div>

      <DataTable
        caption={`${groupDef.label}${query.trim() ? `, khớp “${query.trim()}”` : ''}`}
        columns={recordColumns}
        rows={shown}
        getRowKey={(r) => r.recordCode}
        stackBelow="phone"
        // Tablets (768px) fit every column without a sideways scroll inside the box; phones stack the rows.
        minWidth="40rem"
        status={loading ? 'loading' : failed ? 'error' : 'ready'}
        errorText="Không tải được danh sách: mất mạng. Kiểm tra wifi rồi bấm Tải lại; chữ tìm và nhóm đang chọn vẫn giữ."
        onRetry={() => setFailed(false)}
        emptyText={
          !query.trim()
            ? `Nhóm ${groupDef.label} đang trống.`
            : elsewhere > 0
              ? `Không có ai khớp “${query.trim()}” trong nhóm ${groupDef.label}. Bấm Tìm trong Tất cả ở trên, hoặc xóa chữ tìm.`
              : `Không có ai khớp “${query.trim()}” trong cả đợt. Xóa chữ tìm, hoặc tìm bằng STT, mã lượt khám hay 4 số cuối CCCD.`
        }
        pagination={{ page: current, pageSize: PAGE_SIZE, total: rows.length, itemLabel: 'người', onPageChange: setPage }}
      />
    </StaffLayout>
  );
}

const meta = {
  title: 'Pages/Nhân viên/Danh sách hồ sơ',
  component: RecordList,
  parameters: { layout: 'fullscreen', density: 'compact' },
} satisfies Meta<typeof RecordList>;
export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The working list: people to fill in or fix (a refusal from the department is work to redo, so it is here too),
 * 50 a page, with a long name, a missing ID and a record open elsewhere.
 */
export const CanLam: Story = {};

/** All 2.033 people: 41 pages; "Sau ›" moves on and the range is announced. */
export const TatCa: Story = {
  args: { initialGroup: 'tat-ca' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nav = canvas.getByRole('navigation', { name: 'Trang của danh sách' });
    await expect(nav).toHaveTextContent('Hiển thị 1–50 trong 2.033 người');
    await userEvent.click(within(nav).getByRole('button', { name: 'Sau ›' }));
    await expect(nav).toHaveTextContent('Hiển thị 51–100 trong 2.033 người');
  },
};

/** Typed without tone marks, and every word counts: "ton nu thao" finds Tôn Nữ Hoàng Bảo Ngọc Phương Thảo. */
export const TimKhongDau: Story = { args: { initialQuery: 'ton nu thao' } };

/** No match anywhere in the batch: the table says why and how to get back. */
export const KhongKhop: Story = { args: { initialQuery: 'Hằng Nga' } };

/** Loading: the header stays, the counts and the next person wait for the list. */
export const DangTai: Story = { args: { loading: true } };

/** The list did not load: say what failed, keep the search and the group, "Tải lại". */
export const MatMang: Story = {
  args: { failFirstLoad: true, initialQuery: 'ton nu' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('alert')).toHaveTextContent('mất mạng');
    await userEvent.click(canvas.getByRole('button', { name: 'Tải lại' }));
    await expect(canvas.getByRole('rowheader', { name: /Tôn Nữ Hoàng Bảo Ngọc Phương Thảo/ })).toBeInTheDocument();
    await expect(canvas.getByRole('searchbox', { name: /Tìm người/ })).toHaveValue('ton nu');
  },
};

/** Phone: search under the title, the group as a Select, each record a block; the first screen shows records. */
export const DienThoai: Story = { parameters: { viewport: { defaultViewport: 'mobile1' } } };

/**
 * Near-duplicate names: in Tất cả, "pham van nam" finds Phạm Văn Nam (08/08/1990, CCCD …0005) and Phạm Văn Năm
 * (18/08/1991, CCCD …0011); the birth date and the ID set them apart.
 */
export const TrungTen: Story = { args: { initialGroup: 'tat-ca', initialQuery: 'pham van nam' } };
