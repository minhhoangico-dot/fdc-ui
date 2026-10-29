import type { HTMLAttributes } from 'react';
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
  /** The server refused or the network failed. `reason` in plain words: "mất mạng". */
  | { state: 'error'; reason: string; count?: number };

export type SaveStatusProps = {
  status: SaveStatusState;
  /** Shown with the error; the typed data is kept, so this only tries again. */
  onRetry?: () => void;
  retryLabel?: string;
} & Omit<HTMLAttributes<HTMLDivElement>, 'children'>;

/**
 * The save line of a staff form, one of four moments: "8 ô chưa lưu · Lưu lần cuối 09:12", "Đang lưu…",
 * "Đã lưu 09:15", or "Lưu không được: mất mạng. Chữ đã gõ vẫn còn." with "Lưu lại".
 * It counts unsaved fields only ("ô chưa lưu"); items still to fill ("mục còn thiếu") are a different count, shown elsewhere.
 * Changes are announced politely; a failed save is announced at once.
 */
export function SaveStatus({ status, onRetry, retryLabel = 'Lưu lại', className, ...rest }: SaveStatusProps) {
  return (
    <div {...rest} role="status" className={cx(styles.SaveStatus, className)} data-component="SaveStatus" data-state={status.state}>
      {status.state === 'saved' ? (
        <span className={styles.Saved}>
          <span className={styles.Mark} aria-hidden="true">
            ✓
          </span>
          {status.at ? `Đã lưu ${status.at}` : 'Đã lưu'}
        </span>
      ) : null}
      {status.state === 'unsaved' ? (
        <span>
          <span className={styles.Unsaved}>{status.count} ô chưa lưu</span>
          {status.lastSavedAt ? <span className={styles.Muted}> · Lưu lần cuối {status.lastSavedAt}</span> : null}
        </span>
      ) : null}
      {status.state === 'saving' ? <span className={styles.Unsaved}>Đang lưu…</span> : null}
      {status.state === 'error' ? (
        <>
          <span role="alert" className={styles.Error}>
            Lưu không được: {status.reason}. Chữ đã gõ vẫn còn{status.count ? ` (${status.count} ô chưa lưu)` : ''}.
          </span>
          {onRetry ? <Button onClick={onRetry}>{retryLabel}</Button> : null}
        </>
      ) : null}
    </div>
  );
}
