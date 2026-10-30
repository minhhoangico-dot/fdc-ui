import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../../utils/cx';
import { Button } from '../../atoms/Button';
import styles from './SaveStatus.module.css';

export type SaveStatusState =
  /** Everything typed is on the server. */
  | { state: 'saved'; at?: string }
  /** Changes typed, not written yet ("ô chưa lưu"). */
  | { state: 'unsaved'; count: number; lastSavedAt?: string }
  /** The save request is on its way. */
  | { state: 'saving' }
  /**
   * Someone else changed the same fields while this person was typing: nothing is saved until each of the
   * `count` values is settled. Amber, never green: the last save time says what is safe, not that this is.
   */
  | { state: 'conflict'; count: number; lastSavedAt?: string }
  /** The server refused or the network failed. `reason` in plain words: "mất mạng". */
  | { state: 'error'; reason: string; count?: number };

export type SaveStatusProps = {
  status: SaveStatusState;
  /** Shown with the error; the typed data is kept, so this only tries again. */
  onRetry?: () => void;
  retryLabel?: string;
} & Omit<HTMLAttributes<HTMLDivElement>, 'children'>;

/**
 * The save line of a staff form, one of five moments:
 *
 * | State | Reads | Color |
 * |---|---|---|
 * | unsaved | "8 ô chưa lưu · Lưu lần cuối 09:12" | `status-info-text` |
 * | saving | "Đang lưu…" | `status-info-text` |
 * | saved | "✓ Đã lưu 09:15" | `status-success-text` |
 * | conflict | "(!) Cần xử lý 2 giá trị trước khi lưu · Lưu lần cuối 09:12" | `status-warning-text` (never green) |
 * | error | "(!) Lưu không được: mất mạng. Chữ đã gõ vẫn còn (8 ô chưa lưu)." + "Lưu lại" | `status-error-text` |
 *
 * It counts unsaved fields only ("ô chưa lưu"); items still to fill ("mục còn thiếu") are a different count, shown elsewhere.
 * The conflict and the failed save carry the "!" sign in a circle, as FormNotice does: in the nursing-home theme the
 * red and the amber sit next to an orange button, so color alone does not tell them apart.
 *
 * One live region per change: a polite `role="status"` that is always in the page (unsaved, saving, saved, conflict),
 * and, for a failed save only, a `role="alert"` added with its sentence, so it is read once and at once. The count in
 * brackets and the "Lưu lại" button sit outside both regions: typing into another field while the network is down
 * does not read the failure again, and the button's name is never part of the message.
 */
export function SaveStatus({ status, onRetry, retryLabel = 'Lưu lại', className, ...rest }: SaveStatusProps) {
  let polite: ReactNode = null;
  let sign: ReactNode = null;
  if (status.state === 'saved') {
    sign = (
      <span className={styles.Tick} aria-hidden="true">
        ✓
      </span>
    );
    polite = <span className={styles.Saved}>{status.at ? `Đã lưu ${status.at}` : 'Đã lưu'}</span>;
  } else if (status.state === 'unsaved') {
    polite = (
      <>
        <span className={styles.Unsaved}>{status.count} ô chưa lưu</span>
        {status.lastSavedAt ? <span className={styles.Aside}>Lưu lần cuối {status.lastSavedAt}</span> : null}
      </>
    );
  } else if (status.state === 'saving') {
    polite = <span className={styles.Unsaved}>Đang lưu…</span>;
  } else if (status.state === 'conflict') {
    polite = (
      <>
        <span className={styles.Conflict}>Cần xử lý {status.count} giá trị trước khi lưu</span>
        {status.lastSavedAt ? <span className={styles.Aside}>Lưu lần cuối {status.lastSavedAt}</span> : null}
      </>
    );
  }
  if (status.state === 'conflict' || status.state === 'error') {
    sign = (
      <span className={styles.Mark} aria-hidden="true" data-part="mark">
        !
      </span>
    );
  }

  return (
    <div {...rest} className={cx(styles.SaveStatus, className)} data-component="SaveStatus" data-state={status.state}>
      <span className={styles.Message}>
        {sign}
        <span className={styles.Text}>
          {/* Always in the page, so each change of its words is read (politely). Empty while a failed save shows. */}
          <span role="status" className={styles.Live}>
            {polite}
          </span>
          {status.state === 'error' ? (
            <span className={styles.Error}>
              {/* Added with its words: an alert is read when it appears, once. */}
              <span role="alert">
                Lưu không được: {status.reason}. Chữ đã gõ vẫn còn
              </span>
              {status.count ? ` (${status.count} ô chưa lưu).` : '.'}
            </span>
          ) : null}
        </span>
      </span>
      {status.state === 'error' && onRetry ? <Button onClick={onRetry}>{retryLabel}</Button> : null}
    </div>
  );
}
