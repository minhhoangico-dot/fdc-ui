import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { cx } from '../../../utils/cx';
import { formatViInteger } from '../../../utils/vi';
import { Button } from '../../atoms/Button';
import { Pagination, rangeText, type PaginationProps } from '../../molecules/Pagination';
import styles from './DataTable.module.css';

export type DataTableColumn<Row> = {
  key: string;
  header: ReactNode;
  /** What the cell shows. */
  cell: (row: Row, index: number) => ReactNode;
  /** end = numbers and dates, right-aligned with even digit widths. Default start. */
  align?: 'start' | 'end';
  /**
   * A CSS width such as "6rem". Columns with a width keep it whatever the rows hold, so they do not move when a filter
   * changes the rows; leave the main column without one so it takes the rest.
   */
  width?: string;
  /** Keep on one line, also when the rows stack on phones (codes, dates, statuses). Names and next steps should wrap. */
  nowrap?: boolean;
  /**
   * This column names the row (usually the person); read before each cell of the row.
   * A link placed first in this cell is stretched over the whole cell, so the target is large on touch screens.
   * On phones (stackBelow="phone") this cell is the block's title and has no label.
   */
  rowHeader?: boolean;
  /** On phones (stackBelow="phone"), the label before the value. Default: the header, when it is plain text. */
  stackLabel?: string;
  /** On phones, show the value with no label, when it speaks for itself (a StatusTag with words). It stays in the value column. */
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
  /**
   * boxed (default): a block on its own, with a 1px edge and a header band.
   * plain: no outer edge and no header band, only the rows and their dividers: for a table inside a card or a
   * SummaryList's details, so there is no box inside a box.
   */
  variant?: 'boxed' | 'plain';
  /** loading keeps the header and says so; error says what failed and offers to try again. */
  status?: 'ready' | 'loading' | 'error';
  loadingText?: string;
  /** What failed, in plain words: "Không tải được danh sách: mất mạng." */
  errorText?: string;
  /** "Tải lại". After it, focus moves to the first row's link (or the message, if the list is still empty or loading). */
  onRetry?: () => void;
  retryLabel?: string;
  /** Shown when there are no rows: say why and what to do ("Không có ai khớp “Hằng”. Xóa chữ tìm để xem cả đợt."). */
  emptyText?: ReactNode;
  /**
   * A sentence the live region adds after the count or the empty text, for what the table cannot know:
   * "Còn 1 người khớp “pham van nam” ở nhóm khác."
   */
  resultNote?: string;
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
 * Loading, empty and failed states keep the header so the page does not jump; their message sits under the table,
 * outside the sideways scroll, so it and "Tải lại" are always on screen. One polite live region, always on the page,
 * says the count, the empty result or the failure whenever it changes.
 */
export function DataTable<Row>({
  caption,
  showCaption,
  columns,
  rows,
  getRowKey,
  variant = 'boxed',
  status = 'ready',
  loadingText = 'Đang tải danh sách…',
  errorText = 'Không tải được danh sách.',
  onRetry,
  retryLabel = 'Tải lại',
  emptyText = 'Không có dòng nào.',
  resultNote,
  minWidth = '48rem',
  stackBelow = 'none',
  pagination,
  className,
}: DataTableProps<Row>) {
  const captionId = useId();
  const root = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const table = useRef<HTMLTableElement>(null);
  const messageBox = useRef<HTMLDivElement>(null);
  const [overflows, setOverflows] = useState(false);
  const [said, setSaid] = useState('');
  const lastSaid = useRef<string | null>(null);
  const refocus = useRef(false);
  const stacked = stackBelow === 'phone';
  // Changing a table's display (as stacking does) drops its table semantics in some browsers,
  // so a table that stacks states every role itself.
  const role = (name: string) => (stacked ? name : undefined);
  const empty = status === 'ready' && rows.length === 0;
  const scrollable = overflows && status === 'ready' && rows.length > 0;
  const count = pagination ? rangeText(pagination) : `${formatViInteger(rows.length)} dòng`;

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

  // The live region: what the person would see change, said once. A table that opens with its rows says nothing
  // (they are there to read); a table that opens empty or failed, and every later change, is announced.
  // An empty text that is not a plain string is read from the message as shown.
  const emptyWords = typeof emptyText === 'string' ? emptyText : '';
  useEffect(() => {
    let text: string;
    if (status === 'loading') text = loadingText;
    else if (status === 'error') text = errorText;
    else if (empty) text = emptyWords || (messageBox.current?.textContent?.trim() ?? '');
    else text = `${caption}: ${count.charAt(0).toLowerCase()}${count.slice(1)}.`;
    if (resultNote) text = `${text} ${resultNote}`;
    if (lastSaid.current === null && status === 'ready' && !empty) {
      lastSaid.current = text;
      return;
    }
    if (text === lastSaid.current) return;
    lastSaid.current = text;
    setSaid(text);
  }, [status, loadingText, errorText, empty, emptyWords, caption, count, resultNote]);

  // After "Tải lại" the button goes away with the error: move focus to what replaced it, never to the page body.
  useEffect(() => {
    if (!refocus.current) return;
    if (status === 'loading') {
      messageBox.current?.focus();
      return;
    }
    refocus.current = false;
    if (status === 'error') {
      root.current?.querySelector<HTMLElement>('[data-retry]')?.focus();
      return;
    }
    const firstControl = table.current?.querySelector<HTMLElement>('tbody a[href], tbody button, tbody input, tbody select');
    if (firstControl) firstControl.focus();
    else if (empty) messageBox.current?.focus();
    else if (table.current) {
      table.current.tabIndex = -1;
      table.current.focus();
    }
  }, [status, rows.length, empty]);

  const message =
    status === 'loading' ? (
      loadingText
    ) : status === 'error' ? (
      <span className={styles.ErrorLine}>
        <span className={styles.ErrorText}>
          {/* The sign carries the type, not only the red: in nursing-home the orange brand sits close to it. */}
          <span className={styles.Sign} aria-hidden="true">
            !
          </span>
          <span>{errorText}</span>
        </span>
        {onRetry ? (
          <Button
            data-retry=""
            onClick={() => {
              refocus.current = true;
              onRetry();
            }}
          >
            {retryLabel}
          </Button>
        ) : null}
      </span>
    ) : empty ? (
      emptyText
    ) : null;

  const body =
    message === null
      ? rows.map((row, r) => (
          <tr key={getRowKey(row)} role={role('row')} className={styles.Row}>
            {columns.map((c) => {
              const Cell = c.rowHeader ? 'th' : 'td';
              // Stacked, every cell but the title is a line: a label column (empty when hidden) and a value column,
              // so a value without a label (a status tag) still lines up with the other values.
              const lined = stacked && !c.rowHeader;
              const label = lined ? stackLabelOf(c) : undefined;
              return (
                <Cell
                  key={c.key}
                  scope={c.rowHeader ? 'row' : undefined}
                  role={role(c.rowHeader ? 'rowheader' : 'cell')}
                  className={styles.Cell}
                  data-align={c.align}
                  data-nowrap={c.nowrap || undefined}
                  data-labelled={lined || undefined}
                >
                  {lined ? (
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
        ))
      : null;

  return (
    <div ref={root} className={cx(styles.DataTable, className)} data-component="DataTable" data-variant={variant}>
      <div
        ref={scroller}
        className={styles.Scroller}
        // Only a box that really scrolls to something needs to be a tab stop (WCAG 2.1.1). With no rows (loading,
        // failed, nothing found) it would scroll only the column names: the message under it says what matters.
        role={scrollable ? 'region' : undefined}
        aria-labelledby={scrollable ? captionId : undefined}
        tabIndex={scrollable ? 0 : undefined}
      >
        <table
          ref={table}
          className={styles.Table}
          style={{ '--table-min': minWidth } as CSSProperties}
          // The <caption> names the table (also with role="table"); no aria-labelledby, or it is read twice.
          role={role('table')}
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
      {message !== null ? (
        // Outside the sideways scroll, so the words and "Tải lại" are on screen at any width. Focusable from script
        // only: it takes focus after "Tải lại" while the list loads or comes back empty.
        <div ref={messageBox} className={styles.Message} data-tone={status === 'error' ? 'error' : undefined} tabIndex={-1}>
          {message}
        </div>
      ) : null}
      <div role="status" className={styles.Live}>
        {said}
      </div>
      {pagination && status === 'ready' && rows.length > 0 ? (
        <div className={styles.Footer}>
          <Pagination {...pagination} live={false} />
        </div>
      ) : null}
    </div>
  );
}
