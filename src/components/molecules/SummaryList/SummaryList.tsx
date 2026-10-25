import type { MouseEvent, ReactNode } from 'react';
import { cx } from '../../../utils/cx';
import { VisuallyHidden } from '../../atoms/VisuallyHidden';
import styles from './SummaryList.module.css';

export type SummaryRow = {
  key: string;
  value: ReactNode;
  /** Where "Thay đổi" goes. Use onChange for in-page flows. */
  changeHref?: string;
  onChange?: () => void;
};

export type SummaryListProps = {
  rows: SummaryRow[];
  /** Default "Thay đổi". Screen readers hear it with the row key: "Thay đổi Họ và tên". */
  changeLabel?: string;
  className?: string;
};

/** "Check your answers": key, value and a change link per row, before anything is booked or sent. */
export function SummaryList({ rows, changeLabel = 'Thay đổi', className }: SummaryListProps) {
  return (
    <dl className={cx(styles.SummaryList, className)} data-component="SummaryList">
      {rows.map((row) => (
        <div key={row.key} className={styles.Row}>
          <dt className={styles.Key}>{row.key}</dt>
          <dd className={styles.Value}>{row.value}</dd>
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
        </div>
      ))}
    </dl>
  );
}
