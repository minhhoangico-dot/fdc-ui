import { cx } from '../../../utils/cx';
import styles from './FormNotice.module.css';

export type FormNoticeValue = { type?: 'info' | 'success' | 'error'; text: string };

export type FormNoticeProps = { notice?: FormNoticeValue | null; className?: string };

/** Status line under a form ("Đã gửi…"), announced by screen readers without moving focus. */
export function FormNotice({ notice, className }: FormNoticeProps) {
  return (
    <p className={cx(styles.FormNotice, className)} role="status" data-type={notice?.type ?? 'info'} data-component="FormNotice">
      {notice?.text ?? null}
    </p>
  );
}
