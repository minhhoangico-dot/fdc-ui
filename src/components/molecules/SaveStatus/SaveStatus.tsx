import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../../utils/cx';
import { Button } from '../../atoms/Button';
import { VisuallyHidden } from '../../atoms/VisuallyHidden';
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
 * One live region per moment: a polite `role="status"` that is always in the page and says the moment when it changes
 * (unsaved, saving, saved, conflict), and, for a failed save only, a `role="alert"` added with its sentence, so it is
 * read once and at once. Counts are never part of a region: while a person types, "1 ô chưa lưu" becoming "2 ô chưa
 * lưu" is not read out over the typing. On the line the count shows in the words as before; a screen reader hears the
 * same words in place (the count beside the region, outside it), so reading the line gives the current count once.
 * The count in brackets on a failed save and the "Lưu lại" button sit outside both regions: typing into another
 * field while the network is down does not read the failure again, and the button's name is never part of the message.
 */
export function SaveStatus({ status, onRetry, retryLabel = 'Lưu lại', className, ...rest }: SaveStatusProps) {
  /** The state's color and weight. */
  let tone: string | undefined;
  /** What the polite region says: the moment, without a count. */
  let said: string | null = null;
  /** With a count: the words as they show on the line, and the count heard beside the region, before or after it. */
  let counted: { shown: string; before?: string; after?: string } | null = null;
  let lastSavedAt: string | undefined;
  let sign: ReactNode = null;
  if (status.state === 'saved') {
    tone = styles.Saved;
    said = status.at ? `Đã lưu ${status.at}` : 'Đã lưu';
    sign = (
      <span className={styles.Tick} aria-hidden="true">
        ✓
      </span>
    );
  } else if (status.state === 'saving') {
    tone = styles.Unsaved;
    said = 'Đang lưu…';
  } else if (status.state === 'unsaved') {
    tone = styles.Unsaved;
    said = 'ô chưa lưu';
    counted = { shown: `${status.count} ô chưa lưu`, before: `${status.count} ` };
    lastSavedAt = status.lastSavedAt;
  } else if (status.state === 'conflict') {
    tone = styles.Conflict;
    said = 'Cần xử lý';
    counted = { shown: `Cần xử lý ${status.count} giá trị trước khi lưu`, after: ` ${status.count} giá trị trước khi lưu` };
    lastSavedAt = status.lastSavedAt;
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
          <span className={styles.Line}>
            {/* With a count the words show here for the eye only; a screen reader hears them from the three below. */}
            {counted ? (
              <span className={tone} aria-hidden="true">
                {counted.shown}
              </span>
            ) : null}
            {counted?.before ? <VisuallyHidden>{counted.before}</VisuallyHidden> : null}
            {/* The same element in every state, so each new moment is read (politely). Empty while a failed save shows. */}
            <span role="status" className={counted ? styles.Heard : tone}>
              {said}
            </span>
            {counted?.after ? <VisuallyHidden>{counted.after}</VisuallyHidden> : null}
            {lastSavedAt ? <span className={styles.Aside}>Lưu lần cuối {lastSavedAt}</span> : null}
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
