import { useId, useState, type MouseEvent, type ReactNode } from 'react';
import { cx } from '../../../utils/cx';
import { VisuallyHidden } from '../../atoms/VisuallyHidden';
import styles from './SummaryList.module.css';

export type SummaryRow = {
  key: string;
  value: ReactNode;
  /** Where "Thay đổi" goes. Use onChange for in-page flows. */
  changeHref?: string;
  onChange?: () => void;
  /** Read-only detail opened right under the row (a table of answers or results). */
  details?: ReactNode;
  /** The toggle's words when closed, e.g. "Xem 12 chỉ số". Shown as "▸ Xem 12 chỉ số". Default "Xem chi tiết". */
  detailsLabel?: string;
  /** The toggle's words when open. Default: detailsLabel with "Xem" replaced by "Thu gọn" ("▾ Thu gọn 12 chỉ số"). */
  detailsOpenLabel?: string;
  /** Start with the details open. */
  defaultDetailsOpen?: boolean;
};

export type SummaryListProps = {
  rows: SummaryRow[];
  /** Default "Thay đổi". Screen readers hear it with the row key: "Thay đổi Họ và tên". */
  changeLabel?: string;
  className?: string;
};

const openLabelFor = (label: string) => (/^xem\s+/i.test(label) ? label.replace(/^xem\s+/i, 'Thu gọn ') : `Thu gọn ${label.charAt(0).toLocaleLowerCase('vi')}${label.slice(1)}`);

function Row({ row, changeLabel }: { row: SummaryRow; changeLabel: string }) {
  const id = useId();
  const [open, setOpen] = useState(Boolean(row.defaultDetailsOpen));
  const closedLabel = row.detailsLabel ?? 'Xem chi tiết';
  const openLabel = row.detailsOpenLabel ?? openLabelFor(closedLabel);
  const hasDetails = row.details !== undefined && row.details !== null;
  return (
    <div className={styles.Row} data-open={(hasDetails && open) || undefined}>
      <dt className={styles.Key}>{row.key}</dt>
      <dd className={styles.Value}>
        {row.value}
        {hasDetails ? (
          <button type="button" className={styles.Toggle} aria-expanded={open} aria-controls={`${id}-details`} onClick={() => setOpen((v) => !v)}>
            <span aria-hidden="true">{open ? '▾' : '▸'}</span>
            {open ? openLabel : closedLabel}
          </button>
        ) : null}
      </dd>
      {row.changeHref || row.onChange ? (
        <dd className={styles.Action}>
          <a
            className={styles.Link}
            href={row.changeHref ?? '#'}
            onClick={
              row.onChange
                ? (e: MouseEvent<HTMLAnchorElement>) => {
                    e.preventDefault();
                    row.onChange?.();
                  }
                : undefined
            }
          >
            {changeLabel}
            <VisuallyHidden> {row.key.toLocaleLowerCase('vi')}</VisuallyHidden>
          </a>
        </dd>
      ) : null}
      {hasDetails ? (
        <dd id={`${id}-details`} className={styles.Details} hidden={!open}>
          {row.details}
        </dd>
      ) : null}
    </div>
  );
}

/**
 * "Check your answers": key, value and a change link per row, before anything is booked or sent.
 * A row can also open read-only details right under it ("▸ Xem 12 chỉ số").
 */
export function SummaryList({ rows, changeLabel = 'Thay đổi', className }: SummaryListProps) {
  return (
    <dl className={cx(styles.SummaryList, className)} data-component="SummaryList">
      {rows.map((row) => (
        <Row key={row.key} row={row} changeLabel={changeLabel} />
      ))}
    </dl>
  );
}
