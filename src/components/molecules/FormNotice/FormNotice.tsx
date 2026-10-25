import { cx } from '../../../utils/cx';
import styles from './FormNotice.module.css';

export type FormNoticeValue = { type?: 'info' | 'success' | 'warning' | 'error'; text: string };

export type FormNoticeProps = {
  notice?: FormNoticeValue | null;
  /**
   * Stand-alone notice in a page (not under a form): a box with a 1px edge and a 6px bar on the left
   * in the type's color (warning brand, error red, success green, info brand).
   */
  boxed?: boolean;
  className?: string;
};

/** Status line under a form ("Đã gửi…"), announced by screen readers without moving focus. `boxed` for a notice that stands alone. */
export function FormNotice({ notice, boxed, className }: FormNoticeProps) {
  return (
    <p
      className={cx(styles.FormNotice, className)}
      role="status"
      data-type={notice?.type ?? 'info'}
      data-boxed={boxed || undefined}
      data-component="FormNotice"
    >
      {notice?.text ?? null}
    </p>
  );
}
