import { cx } from '../../../utils/cx';
import styles from './FormNotice.module.css';

export type FormNoticeValue = { type?: 'info' | 'success' | 'warning' | 'error'; text: string };

/** The sign inside the leading circle; the words carry the meaning. */
const marks: Record<NonNullable<FormNoticeValue['type']>, string> = { error: '!', warning: '!', info: 'i', success: '✓' };

export type FormNoticeProps = {
  notice?: FormNoticeValue | null;
  /**
   * Stand-alone notice in a page (not under a form): a box tinted in the type's color, with a 1px edge and a
   * 6px bar on the left in the same color (warning amber, error red, success green, info blue; the same in every theme).
   */
  boxed?: boolean;
  className?: string;
};

/**
 * Status line under a form ("Đã gửi…"), announced by screen readers without moving focus. `boxed` for a notice that stands alone.
 * A leading circle with "!", "i" or "✓" shows the type without relying on color; it is hidden from screen readers.
 */
export function FormNotice({ notice, boxed, className }: FormNoticeProps) {
  const type = notice?.type ?? 'info';
  return (
    // The live region is always in the page; only its content changes, so the change is announced.
    <p className={cx(styles.FormNotice, className)} role="status" data-type={type} data-boxed={boxed || undefined} data-component="FormNotice">
      {notice?.text ? (
        <>
          <span className={styles.Mark} aria-hidden="true" data-part="mark">
            {marks[type]}
          </span>
          <span className={styles.Text}>{notice.text}</span>
        </>
      ) : null}
    </p>
  );
}
