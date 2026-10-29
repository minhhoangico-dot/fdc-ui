import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { cx } from '../../../utils/cx';
import { Button } from '../../atoms/Button';
import { Pagination, type PaginationProps } from '../../molecules/Pagination';
import styles from './DataTable.module.css';

export type DataTableColumn<Row> = {
  key: string;
  header: ReactNode;
  /** What the cell shows. */
  cell: (row: Row, index: number) => ReactNode;
  /** end = numbers and dates, right-aligned with even digit widths. Default start. */
  align?: 'start' | 'end';
  /** A CSS width such as "6rem"; leave the main column without one so it takes the rest. */
  width?: string;
  /** Keep on one line (codes, dates, statuses). Names and next steps should wrap. */
  nowrap?: boolean;
  /**
   * This column names the row (usually the person); read before each cell of the row.
   * A link placed first in this cell is stretched over the whole cell, so the target is large on touch screens.
   */
  rowHeader?: boolean;
};

export type DataTableProps<Row> = {
  /** Names the table for screen readers and the scroll region: "Người cần điền hoặc sửa". */
  caption: string;
  /** Show the caption as a heading above the table. Default hidden (the page heading usually says it). */
  showCaption?: boolean;
  columns: Array<DataTableColumn<Row>>;
  rows: Row[];
  getRowKey: (row: Row) => string;
  /** loading keeps the header and says so; error says what failed and offers to try again. */
  status?: 'ready' | 'loading' | 'error';
  loadingText?: string;
  /** What failed, in plain words: "Không tải được danh sách: mất mạng." */
  errorText?: string;
  onRetry?: () => void;
  retryLabel?: string;
  /** Shown when there are no rows: say why and what to do ("Không có ai khớp “Hằng”. Xóa chữ tìm để xem cả đợt."). */
  emptyText?: ReactNode;
  /** Narrowest width before the table scrolls sideways inside its box (never the page). Default 48rem. */
  minWidth?: string;
  /** Under the table, inside the same box. */
  pagination?: PaginationProps;
  className?: string;
};

/**
 * A list of records for staff tools: one row per record, the name first, a status word, the next step.
 * The box scrolls sideways on narrow screens instead of the page, and becomes a keyboard-scrollable region
 * only when it actually overflows. Loading, empty and failed states keep the header so the page does not jump.
 */
export function DataTable<Row>({
  caption,
  showCaption,
  columns,
  rows,
  getRowKey,
  status = 'ready',
  loadingText = 'Đang tải danh sách…',
  errorText = 'Không tải được danh sách.',
  onRetry,
  retryLabel = 'Tải lại',
  emptyText = 'Không có dòng nào.',
  minWidth = '48rem',
  pagination,
  className,
}: DataTableProps<Row>) {
  const captionId = useId();
  const scroller = useRef<HTMLDivElement>(null);
  const [overflows, setOverflows] = useState(false);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const measure = () => setOverflows(el.scrollWidth > el.clientWidth + 1);
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [rows.length, status]);

  const message = (content: ReactNode, tone?: 'error') => (
    <tr>
      <td colSpan={columns.length} className={styles.Message} data-tone={tone}>
        {content}
      </td>
    </tr>
  );

  let body: ReactNode;
  if (status === 'loading') body = message(loadingText);
  else if (status === 'error')
    body = message(
      <span className={styles.ErrorLine}>
        <span role="alert">{errorText}</span>
        {onRetry ? <Button onClick={onRetry}>{retryLabel}</Button> : null}
      </span>,
      'error',
    );
  else if (rows.length === 0) body = message(emptyText);
  else
    body = rows.map((row, r) => (
      <tr key={getRowKey(row)}>
        {columns.map((c) => {
          const Cell = c.rowHeader ? 'th' : 'td';
          return (
            <Cell key={c.key} scope={c.rowHeader ? 'row' : undefined} className={styles.Cell} data-align={c.align} data-nowrap={c.nowrap || undefined}>
              {c.cell(row, r)}
            </Cell>
          );
        })}
      </tr>
    ));

  return (
    <div className={cx(styles.DataTable, className)} data-component="DataTable">
      <div
        ref={scroller}
        className={styles.Scroller}
        // Only a box that really scrolls needs to be a tab stop (WCAG 2.1.1); otherwise it would be an empty stop.
        role={overflows ? 'region' : undefined}
        aria-labelledby={overflows ? captionId : undefined}
        tabIndex={overflows ? 0 : undefined}
      >
        <table className={styles.Table} style={{ minInlineSize: minWidth }} aria-busy={status === 'loading' || undefined}>
          <caption id={captionId} className={showCaption ? styles.Caption : styles.HiddenCaption}>
            {caption}
          </caption>
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c.key} scope="col" className={styles.Head} data-align={c.align} style={c.width ? { inlineSize: c.width } : undefined}>
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{body}</tbody>
        </table>
      </div>
      {pagination && status === 'ready' && rows.length > 0 ? (
        <div className={styles.Footer}>
          <Pagination {...pagination} />
        </div>
      ) : null}
    </div>
  );
}
