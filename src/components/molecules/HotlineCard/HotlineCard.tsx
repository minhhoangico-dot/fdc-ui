import { cx } from '../../../utils/cx';
import { telHref } from '../../../utils/phone';
import { Icon } from '../../atoms/Icon';
import styles from './HotlineCard.module.css';

export type HotlineCardProps = {
  /** As printed, e.g. "024 35 430 430" (clinic) or "096 583 7777" (nursing home). */
  number: string;
  /** Default "Tổng đài". */
  label?: string;
  /** inline = header and sticky bars; framed = contact sections. */
  variant?: 'inline' | 'framed';
  /** Small line under the framed number, e.g. "Hỗ trợ 24/7". */
  note?: string;
  className?: string;
};

/**
 * Tap-to-call hotline. Keep it in the same place on every page (WCAG 3.2.6).
 * The number is always selectable text, so it still works where tel: links do nothing.
 */
export function HotlineCard({ number, label = 'Tổng đài', variant = 'inline', note, className }: HotlineCardProps) {
  if (variant === 'framed') {
    return (
      <div className={cx(styles.Framed, className)} data-component="HotlineCard">
        <span className={styles.Legend}>{label}</span>
        <a className={styles.FramedNumber} href={telHref(number)}>
          <Icon name="telephone" size={30} />
          <span>{number}</span>
        </a>
        {note ? <p className={styles.Note}>{note}</p> : null}
      </div>
    );
  }
  return (
    <a className={cx(styles.Inline, className)} href={telHref(number)} data-component="HotlineCard">
      <span className={styles.Disc}>
        <Icon name="phone" size={20} />
      </span>
      <span className={styles.Text}>
        <span className={styles.Label}>{label}</span>
        <span className={styles.Number}>{number}</span>
      </span>
    </a>
  );
}
