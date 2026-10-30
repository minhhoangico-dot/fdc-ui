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
  'Bị từ chối': 'error',
  'Chưa rõ kết quả': 'attention',
};

const muted = { color: 'var(--text-muted)' } as const;
/** Facts that tell people apart, set apart by space rather than "·"; each fact stays on one line. */
const facts = { display: 'flex', flexWrap: 'wrap', columnGap: 'var(--space-15)', color: 'var(--text-muted)' } as const;
const fact = { whiteSpace: 'nowrap' } as const;

export const recordColumns: Array<DataTableColumn<KskRecord>> = [
  { key: 'stt', header: 'STT', cell: (r) => r.stt.toLocaleString('vi-VN'), align: 'end', width: '4.5rem', nowrap: true },
  {
    key: 'name',
    header: 'Họ tên',
    rowHeader: true,
    cell: (r) => (
      <>
        <a href={`#ho-so-${r.recordCode}`} style={{ color: 'var(--text-link)', fontWeight: 600 }}>
          {r.name}
        </a>
        {/* The spaces between the facts are for screen readers; on screen the gap separates them. */}
        <div style={facts}>
          <span style={fact}>{r.sex}</span> <span style={fact}>Sinh {r.birthDate}</span>{' '}
          <span style={fact}>{r.idEnd ? `CCCD …${r.idEnd}` : 'Chưa có CCCD'}</span>
        </div>
      </>
    ),
  },
  { key: 'code', header: 'Mã lượt khám', cell: (r) => r.recordCode, nowrap: true, width: '9rem' },
  {
    key: 'status',
    header: 'Trạng thái',
    width: '12rem',
    // On phones the tag's words say it all ("Cần điền · còn 61 mục"), so its line needs no label.
    hideLabelWhenStacked: true,
    cell: (r) => (
      <StatusTag tone={statusTone[r.status]} size="sm">
        {r.status === 'Cần điền' || r.status === 'Cần sửa' ? `${r.status} · còn ${r.missing} mục` : r.status}
      </StatusTag>
    ),
  },
  {
    key: 'next',
    header: 'Việc tiếp theo',
    cell: (r) => (
      <>
        {r.next}
        {r.openBy ? <div style={muted}>{r.openBy}</div> : null}
      </>
    ),
  },
];
