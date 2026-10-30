// Columns of the KSK record list, shared by the DataTable stories and the staff list page.
import { StatusTag, type StatusTagTone } from '../components/atoms/StatusTag';
import type { DataTableColumn } from '../components/organisms/DataTable';
import type { KskRecord, RecordStatus } from './ksk';

/**
 * Record state → StatusTag tone, as in the README's table of record states (v2.4): green only once the department
 * has a receipt, red only for what must be fixed, amber for an unknown outcome (check, do not resend).
 */
export const statusTone: Record<RecordStatus, StatusTagTone> = {
  'Cần điền': 'neutral',
  'Cần sửa': 'error',
  'Sẵn sàng xem lại': 'neutral',
  'Đang chờ': 'info',
  'Chờ gửi': 'info',
  'Đang gửi': 'info',
  'Sở đã tiếp nhận': 'success',
  'Bộ đã xác nhận': 'success',
  'Bị từ chối': 'error',
  'Chưa rõ kết quả': 'attention',
};

/**
 * Metadata under a value (the facts under the name, the count under the state): the caption size, 14px in the
 * compact density of staff screens (16px in the comfortable one), muted, so the name and the state lead the row.
 */
const meta = { fontSize: 'calc(var(--font-size-body) - 0.125rem)', color: 'var(--text-muted)' } as const;
/** Facts that tell people apart, set apart by space rather than "·"; each fact stays on one line. */
const facts = { ...meta, display: 'flex', flexWrap: 'wrap', columnGap: 'var(--space-15)' } as const;
const nowrap = { whiteSpace: 'nowrap' } as const;

/**
 * Column widths are set for every column but "Việc tiếp theo", so no column moves when the filter changes the rows,
 * and the width left over goes to the next step. The state column fits its longest word ("Sẵn sàng xem lại") on one
 * line; the count of missing items sits under the tag, not in it.
 */
export const recordColumns: Array<DataTableColumn<KskRecord>> = [
  { key: 'stt', header: 'STT', cell: (r) => r.stt.toLocaleString('vi-VN'), align: 'end', width: '4.5rem', nowrap: true },
  {
    key: 'name',
    header: 'Họ tên',
    rowHeader: true,
    // A length, so the column keeps its width whatever the rows hold (a percentage mixed with rem is treated as
    // auto and moves with the rows). 12rem up to 768px (the name and two lines of facts, or a table that scrolls
    // sideways on a phone), so "Việc tiếp theo" keeps its room on a tablet; then it grows to 19.5rem at 1024px,
    // where the facts ("Nam  Sinh 12/04/1985  CCCD …0001", 280px) fit one line; from 1280px a quarter of the screen.
    width: 'clamp(12rem, calc(46.875vw - 10.5rem), max(25vw, 20rem))',
    cell: (r) => (
      <>
        <a href={`#ho-so-${r.recordCode}`} style={{ color: 'var(--text-link)', fontWeight: 600 }}>
          {r.name}
        </a>
        {/* The spaces between the facts are for screen readers; on screen the gap separates them. */}
        <div style={facts}>
          <span style={nowrap}>{r.sex}</span> <span style={nowrap}>Sinh {r.birthDate}</span>{' '}
          <span style={nowrap}>{r.idEnd ? `CCCD …${r.idEnd}` : 'Chưa có CCCD'}</span>
        </div>
      </>
    ),
  },
  { key: 'code', header: 'Mã lượt khám', cell: (r) => r.recordCode, nowrap: true, width: '9rem' },
  {
    key: 'status',
    header: 'Trạng thái',
    width: '11rem',
    nowrap: true,
    // On phones the tag's words say it all, so its line needs no label (it still sits in the value column).
    hideLabelWhenStacked: true,
    cell: (r) => (
      <>
        <StatusTag tone={statusTone[r.status]} size="sm">
          {r.status}
        </StatusTag>
        {(r.status === 'Cần điền' || r.status === 'Cần sửa') && r.missing > 0 ? <div style={meta}>còn {r.missing} mục</div> : null}
      </>
    ),
  },
  {
    key: 'next',
    header: 'Việc tiếp theo',
    cell: (r) => (
      <>
        {r.next}
        {r.receipt ? (
          // Like "CCCD …0001": the end of the department's code tells records apart in the list; the record shows the
          // whole code, where it is read out. It never breaks across lines.
          <div style={{ ...meta, ...nowrap }}>Mã Sở …{r.receipt.slice(-6)}</div>
        ) : null}
        {r.openBy ? <div style={{ color: 'var(--text-muted)' }}>{r.openBy}</div> : null}
      </>
    ),
  },
];
