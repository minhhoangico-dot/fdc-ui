// Columns of the KSK record list, shared by the DataTable stories and the staff list page.
import { StatusTag, type StatusTagTone } from '../components/atoms/StatusTag';
import type { DataTableColumn } from '../components/organisms/DataTable';
import type { KskRecord, RecordStatus } from './ksk';

/** Record state → StatusTag tone, as in the README's table of record states. */
export const statusTone: Record<RecordStatus, StatusTagTone> = {
  'Cần điền': 'neutral',
  'Cần sửa': 'error',
  'Sẵn sàng xem lại': 'neutral',
  'Đang chờ': 'info',
  'Đang gửi': 'info',
  'Đã gửi lên Sở': 'success',
  'Gửi lỗi': 'error',
};

const muted = { color: 'var(--text-muted)' } as const;

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
        <div style={muted}>
          {r.sex} · {r.birthDate} · {r.idEnd ? `CCCD …${r.idEnd}` : 'Chưa có CCCD'}
        </div>
        {r.role ? <div style={muted}>{r.role}</div> : null}
      </>
    ),
  },
  { key: 'code', header: 'Mã lượt khám', cell: (r) => r.recordCode, nowrap: true, width: '9rem' },
  {
    key: 'status',
    header: 'Trạng thái',
    width: '12rem',
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
