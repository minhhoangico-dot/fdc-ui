import { cx } from '../../../utils/cx';
import { Icon } from '../../atoms/Icon';
import styles from './WorkingHours.module.css';

export type WorkingHoursProps = {
  /** Default "Thời gian làm việc". */
  title?: string;
  /** Times as 07:00–20:00 with an en dash. */
  rows: { label: string; hours: string }[];
  note?: string;
  className?: string;
};

/** Opening hours as a short labeled list. */
export function WorkingHours({ title = 'Thời gian làm việc', rows, note, className }: WorkingHoursProps) {
  return (
    <div className={cx(styles.WorkingHours, className)} data-component="WorkingHours">
      <p className={styles.Title}>
        <Icon name="ui-calendar" size={18} />
        <span>{title}</span>
      </p>
      <dl className={styles.List}>
        {rows.map((r) => (
          <div key={r.label} className={styles.Row}>
            <dt className={styles.Label}>{r.label}</dt>
            <dd className={styles.Time}>{r.hours}</dd>
          </div>
        ))}
      </dl>
      {note ? <p className={styles.Note}>{note}</p> : null}
    </div>
  );
}
