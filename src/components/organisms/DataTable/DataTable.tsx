import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from 'react';
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
   * On phones (stackBelow="phone") this cell is the block's title and has no label.
   */
  rowHeader?: boolean;
  /** On phones (stackBelow="phone"), the label before the value. Default: the header, when it is plain text. */
  stackLabel?: string;
  /** On phones, show the value with no label, when it speaks for itself (a StatusTag with words). */
  hideLabelWhenStacked?: boolean;
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
  /**
   * phone: below 40rem each row becomes a block: the row header (the name) as its title, then one line per cell
   * with its column's name before the value, so the first screen shows records instead of a sideways scroll.
   * Default none: the table keeps minWidth and scrolls inside its box.
   */
  stackBelow?: 'none' | 'phone';
  /** Under the table, inside the same box. */
  pagination?: PaginationProps;
  className?: string;
};

/** The label of a stacked line: stackLabel, else a plain-text header; none for the row header or when hidden. */
function stackLabelOf<Row>(c: DataTableColumn<Row>): string | undefined {
  if (c.rowHeader || c.hideLabelWhenStacked) return undefined;
  return c.stackLabel ?? (typeof c.header === 'string' ? c.header : undefined);
}

/**
 * A list of records for staff tools: one row per record, the name first, a status word, the next step.
 * The box scrolls sideways on narrow screens instead of the page, and becomes a keyboard-scrollable region
 * only when it actually overflows; with stackBelow="phone" each row becomes a block on phones instead.
 * Loading, empty and failed states keep the header so the page does not jump.
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
  stackBelow = 'none',
  pagination,
  className,
}: DataTableProps<Row>) {
  const captionId = useId();
  const scroller = useRef<HTMLDivElement>(null);
  const [overflows, setOverflows] = useState(false);
  const stacked = stackBelow === 'phone';
  // Changing a table's display (as stacking does) drops its table semantics in some browsers,
  // so a table that stacks states every role itself.
  const role = (name: string) => (stacked ? name : undefined);

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
    <tr role={role('row')}>
      <td colSpan={columns.length} role={role('cell')} className={styles.Message} data-tone={tone}>
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
      <tr key={getRowKey(row)} role={role('row')} className={styles.Row}>
        {columns.map((c) => {
          const Cell = c.rowHeader ? 'th' : 'td';
          const label = stacked ? stackLabelOf(c) : undefined;
          return (
            <Cell
              key={c.key}
              scope={c.rowHeader ? 'row' : undefined}
              role={role(c.rowHeader ? 'rowheader' : 'cell')}
              className={styles.Cell}
              data-align={c.align}
              data-nowrap={c.nowrap || undefined}
              data-labelled={label ? true : undefined}
            >
              {label ? (
                <>
                  {/* The column header already names the cell for screen readers; this is the visible copy on phones. */}
                  <span className={styles.StackLabel} aria-hidden="true">
                    {label}
                  </span>
                  <div className={styles.StackValue}>{c.cell(row, r)}</div>
                </>
              ) : (
                c.cell(row, r)
              )}
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
        <table
          className={styles.Table}
          style={{ '--table-min': minWidth } as CSSProperties}
          role={role('table')}
          aria-labelledby={stacked ? captionId : undefined}
          aria-busy={status === 'loading' || undefined}
          data-stack={stacked ? 'phone' : undefined}
        >
          <caption id={captionId} className={showCaption ? styles.Caption : styles.HiddenCaption}>
            {caption}
          </caption>
          <thead role={role('rowgroup')}>
            <tr role={role('row')}>
              {columns.map((c) => (
                <th
                  key={c.key}
                  scope="col"
                  role={role('columnheader')}
                  className={styles.Head}
                  data-align={c.align}
                  style={c.width ? { inlineSize: c.width } : undefined}
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody role={role('rowgroup')}>{body}</tbody>
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
