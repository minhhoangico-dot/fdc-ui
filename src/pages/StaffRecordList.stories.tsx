import { useEffect, useMemo, useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, waitFor, within } from '@storybook/test';
import { Button } from '../components/atoms/Button';
import { Select } from '../components/atoms/Select';
import { TextField } from '../components/atoms/TextField';
import { Inline } from '../components/layout/Inline';
import { Breadcrumb } from '../components/molecules/Breadcrumb';
import { RadioGroup } from '../components/molecules/RadioGroup';
import { DataTable } from '../components/organisms/DataTable';
import { StaffLayout } from '../components/templates/StaffLayout';
import { actionableStatuses, recordGroups, records as allRecords, type KskRecord } from '../fixtures/ksk';
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
  // "Tìm trong Tất cả" goes away once the group is Tất cả: focus then moves to the group control that now says so.
  const focusGroup = useRef(false);
  const pills = useRef<HTMLDivElement>(null);
  const groupSelect = useRef<HTMLSelectElement>(null);
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

  // "làm được ngay": fill or fix, review, and check an unknown outcome (it waits for staff, not for the department).
  const now = records.filter((r) => actionableStatuses.includes(r.status)).length;
  // An unknown outcome is work for staff but sits in Đang gửi, so the figure says where it is: then the groups add up
  // (1.019 Cần điền hoặc sửa + 253 Sẵn sàng xem lại + 1 in Đang gửi = 1.273).
  const unknown = records.filter((r) => r.status === 'Chưa rõ kết quả').length;
  const unknownGroup = recordGroups.find((g) => g.statuses.includes('Chưa rõ kết quả'))?.label;
  // The first record to fill or fix that nobody else has open.
  const nextUp = records.find((r) => inGroup('can-lam')(r) && !r.openBy);

  const groupOptions = recordGroups.map((g) => ({ value: g.value, label: ready ? `${g.label} · ${formatViInteger(counts[g.value])}` : g.label }));
  const choose = (v: string) => {
    setGroup(v);
    setPage(1);
  };
  const findInAll = () => {
    focusGroup.current = true;
    choose('tat-ca');
  };
  useEffect(() => {
    if (!focusGroup.current) return;
    focusGroup.current = false;
    // The checked "Tất cả" pill from 40rem; the Select on phones (the pills are not shown there).
    const wide = pills.current && getComputedStyle(pills.current).display !== 'none';
    const target = wide ? pills.current?.querySelector<HTMLInputElement>('input:checked') : groupSelect.current;
    target?.focus();
  }, [group]);
  const elsewhereNote = ready && query.trim() && elsewhere > 0 ? `Còn ${formatViInteger(elsewhere)} người khớp “${query.trim()}” ở nhóm khác.` : undefined;
  const batchAction = <Button>Lấy kết quả xét nghiệm cả đợt</Button>;

  return (
    <StaffLayout header={staffHeader}>
      <Breadcrumb items={[{ label: 'Việc của tôi', href: '#' }, { label: BATCH }]} />
      <div className={styles.Heading}>
        <h1 className={styles.Title}>{BATCH}</h1>
        {/* How this batch is sent, in plain words (not a tag: it is a note, not a state). */}
        <p className={styles.Mode}>Đợt này gửi tay: chị xem lại rồi tự gửi từng hồ sơ.</p>
      </div>

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
      <div className={styles.WideOnly} ref={pills}>
        <RadioGroup label="Nhóm người" name="nhom" variant="pills" layout="wrap" value={group} onValueChange={choose} options={groupOptions} />
      </div>
      <div className={styles.PhoneOnly}>
        <Select ref={groupSelect} label="Nhóm người" value={group} onChange={(e) => choose(e.target.value)} options={groupOptions} />
      </div>

      {elsewhereNote ? (
        <p className={styles.Elsewhere}>
          <span>{elsewhereNote}</span>
          <Button onClick={findInAll}>Tìm trong Tất cả</Button>
        </p>
      ) : null}

      <div className={styles.Toolbar}>
        {ready ? (
          // Each figure is one unbreakable chunk; the "·" sits in the gap before a chunk and is clipped when that
          // chunk starts a line, so no line starts or ends with a dot.
          <p className={`${styles.Stats} ${styles.WideOnly}`}>
            <span>
              Cả đợt <strong>{formatViInteger(records.length)}</strong> người
            </span>{' '}
            <span>
              <strong>{formatViInteger(now)}</strong> làm được ngay
              {unknown > 0 && unknownGroup ? ` (${formatViInteger(unknown)} chưa rõ kết quả ở nhóm ${unknownGroup})` : null}
            </span>{' '}
            <span>
              <strong>{formatViInteger(counts['dang-cho'])}</strong> đang chờ
            </span>{' '}
            <span>
              <strong>{formatViInteger(counts['da-gui'])}</strong> Sở đã tiếp nhận
            </span>
          </p>
        ) : null}
        <Inline gap={10} className={styles.Actions}>
          {/* The rare batch action: here from 40rem; on phones under the list, so the records come first. */}
          <div className={styles.WideOnly}>{batchAction}</div>
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
        resultNote={elsewhereNote}
        emptyText={
          !query.trim()
            ? `Nhóm ${groupDef.label} đang trống.`
            : elsewhere > 0
              ? `Không có ai khớp “${query.trim()}” trong nhóm ${groupDef.label}. Bấm Tìm trong Tất cả ở trên, hoặc xóa chữ tìm.`
              : `Không có ai khớp “${query.trim()}” trong cả đợt. Xóa chữ tìm, hoặc tìm bằng STT, mã lượt khám hay 4 số cuối CCCD.`
        }
        pagination={{ page: current, pageSize: PAGE_SIZE, total: rows.length, itemLabel: 'người', onPageChange: setPage }}
      />
      <div className={styles.PhoneOnly}>{batchAction}</div>
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

/** The table's one live region: it says the count, the empty result or the failure whenever it changes. */
const liveRegion = (canvasElement: HTMLElement) => within(canvasElement.querySelector<HTMLElement>('[data-component="DataTable"]')!).getByRole('status');

/**
 * The working list: people to fill in or fix (a refusal from the department is work to redo, so it is here too),
 * 50 a page, with a long name, a missing ID and a record open elsewhere. The batch line adds up with the groups:
 * 1.019 to fill or fix + 253 to review + the one unknown outcome, which sits in Đang gửi and says so.
 */
export const CanLam: Story = {
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('[class*="Stats"]')).toHaveTextContent('1.273 làm được ngay (1 chưa rõ kết quả ở nhóm Đang gửi)');
  },
};

/** All 2.033 people: 41 pages; "Sau ›" (named "Sau": the arrow is not read) moves on and the table's live region says the new range once. */
export const TatCa: Story = {
  args: { initialGroup: 'tat-ca' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nav = canvas.getByRole('navigation', { name: 'Trang của danh sách' });
    await expect(nav).toHaveTextContent('Hiển thị 1–50 trong 2.033 người');
    await userEvent.click(within(nav).getByRole('button', { name: 'Sau' }));
    await expect(nav).toHaveTextContent('Hiển thị 51–100 trong 2.033 người');
    await waitFor(() => expect(liveRegion(canvasElement)).toHaveTextContent('Tất cả: hiển thị 51–100 trong 2.033 người.'));
    // Only the table's region speaks: the range line under it is not a second live region.
    await expect(nav.querySelector('[aria-live]')).toBeNull();
  },
};

/** Typed without tone marks, and every word counts: "ton nu thao" finds Tôn Nữ Hoàng Bảo Ngọc Phương Thảo. */
export const TimKhongDau: Story = { args: { initialQuery: 'ton nu thao' } };

/**
 * Search finds a person in another group: "pham van nam" in Cần điền hoặc sửa shows Phạm Văn Năm and says one more
 * matches elsewhere (Phạm Văn Nam, Đang chờ); the live region says so too. "Tìm trong Tất cả" shows both, and focus
 * moves to the group control that now reads Tất cả (the pill from 40rem, the Select on phones), not to the page body.
 */
export const TimTrongTatCa: Story = {
  args: { initialQuery: 'pham van nam' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole('rowheader')).toHaveLength(1);
    await userEvent.click(canvas.getByRole('button', { name: 'Tìm trong Tất cả' }));
    await expect(canvas.getAllByRole('rowheader')).toHaveLength(2);
    const focused = canvasElement.ownerDocument.activeElement as HTMLInputElement | HTMLSelectElement | null;
    await expect(focused?.value).toBe('tat-ca');
    await waitFor(() => expect(liveRegion(canvasElement)).toHaveTextContent('Tất cả, khớp “pham van nam”: hiển thị 1–2 trong 2 người.'));
  },
};

/**
 * No match anywhere in the batch: the table says why and how to get back, and the live region says it too. With no
 * rows the table's box is not a scroll container, so Tab goes from the actions straight past it.
 */
export const KhongKhop: Story = {
  args: { initialQuery: 'Hằng Nga' },
  play: async ({ canvasElement }) => {
    await waitFor(() => expect(liveRegion(canvasElement)).toHaveTextContent('Không có ai khớp “Hằng Nga” trong cả đợt.'));
    const scroller = canvasElement.querySelector<HTMLElement>('[data-component="DataTable"] > div')!;
    await expect(scroller).not.toHaveAttribute('tabindex');
    await expect(['clip', 'hidden']).toContain(getComputedStyle(scroller).overflowX);
  },
};

/** Loading: the header stays, the counts and the next person wait for the list. */
export const DangTai: Story = { args: { loading: true } };

/** The list did not load: say what failed (with the "!" sign), keep the search and the group, "Tải lại". */
export const MatMang: Story = { args: { failFirstLoad: true, initialQuery: 'ton nu' } };

/** After "Tải lại" the list loads; the button is gone, so focus moves to the first record's link, not the page body. */
export const MatMangTaiLai: Story = {
  args: { failFirstLoad: true, initialQuery: 'ton nu' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(liveRegion(canvasElement)).toHaveTextContent('mất mạng'));
    await userEvent.click(canvas.getByRole('button', { name: 'Tải lại' }));
    await expect(canvas.getByRole('link', { name: 'Tôn Nữ Hoàng Bảo Ngọc Phương Thảo' })).toHaveFocus();
    await waitFor(() => expect(liveRegion(canvasElement)).toHaveTextContent('hiển thị 1–1 trong 1 người.'));
    await expect(canvas.getByRole('searchbox', { name: /Tìm người/ })).toHaveValue('ton nu');
  },
};

/**
 * Phone: search under the title, the group as a Select, each record a block (the status tag in the value column);
 * the first screen shows records, and the rare batch action sits under the list.
 */
export const DienThoai: Story = { parameters: { viewport: { defaultViewport: 'mobile1' } } };

/**
 * Near-duplicate names: in Tất cả, "pham van nam" finds Phạm Văn Nam (08/08/1990, CCCD …0005) and Phạm Văn Năm
 * (18/08/1991, CCCD …0011); the birth date and the ID set them apart.
 */
export const TrungTen: Story = { args: { initialGroup: 'tat-ca', initialQuery: 'pham van nam' } };
