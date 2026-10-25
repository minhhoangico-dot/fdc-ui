import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '../../atoms/Button';
import { Dialog } from '../Dialog';
import styles from './IdleTimeoutDialog.module.css';

export type IdleTimeoutDialogProps = {
  /** Inactivity before onTimeout runs. Default 20 minutes. */
  timeoutMs?: number;
  /** How long before the timeout the warning opens. Default 2 minutes (WCAG 2.2.1 needs at least 20 seconds). */
  warnBeforeMs?: number;
  /** Save what you can and sign out or clear the form. */
  onTimeout: () => void;
  /** Person chose "Thoát". Defaults to onTimeout. */
  onSignOut?: () => void;
  /** Person chose to continue; refresh the session here. */
  onStay?: () => void;
  /** Pause the timer (e.g. when nothing is entered yet). Default false. */
  disabled?: boolean;
  title?: string;
  /** Text before the remaining time. */
  message?: string;
  stayLabel?: string;
  signOutLabel?: string;
};

/** "2 phút 05 giây", "45 giây". */
export function formatRemaining(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  if (m === 0) return `${s} giây`;
  return s === 0 ? `${m} phút` : `${m} phút ${String(s).padStart(2, '0')} giây`;
}

/** What screen readers hear: once per minute, then at 30 and 10 seconds, not every second. */
const announcement = (ms: number) => {
  const s = Math.ceil(ms / 1000);
  if (s > 60) return `Còn ${Math.ceil(s / 60)} phút`;
  if (s > 30) return 'Còn 1 phút';
  if (s > 10) return 'Còn 30 giây';
  return 'Còn 10 giây';
};

const ACTIVITY = ['pointerdown', 'keydown', 'scroll', 'touchstart'] as const;

/**
 * Warns before a session ends after inactivity and lets the person continue with one tap.
 * Keep what they typed: older users are often slow, interrupted, or helped by a relative.
 */
export function IdleTimeoutDialog({
  timeoutMs = 20 * 60_000,
  warnBeforeMs = 2 * 60_000,
  onTimeout,
  onSignOut,
  onStay,
  disabled,
  title = 'Bạn vẫn đang ở đây chứ?',
  message = 'Để bảo vệ thông tin của bạn, trang sẽ tự đóng sau',
  stayLabel = 'Tiếp tục',
  signOutLabel = 'Thoát',
}: IdleTimeoutDialogProps) {
  const lastActivity = useRef(Date.now());
  const [remaining, setRemaining] = useState(timeoutMs);
  const warning = !disabled && remaining <= warnBeforeMs;
  const fired = useRef(false);

  const reset = useCallback(() => {
    lastActivity.current = Date.now();
    fired.current = false;
    setRemaining(timeoutMs);
  }, [timeoutMs]);

  useEffect(() => {
    if (disabled) return;
    reset();
    const onActivity = () => {
      // Once the warning shows, only the buttons count as "still here".
      if (Date.now() - lastActivity.current < timeoutMs - warnBeforeMs) lastActivity.current = Date.now();
    };
    ACTIVITY.forEach((ev) => window.addEventListener(ev, onActivity, { passive: true }));
    const timer = window.setInterval(() => {
      const left = timeoutMs - (Date.now() - lastActivity.current);
      setRemaining(left);
      if (left <= 0 && !fired.current) {
        fired.current = true;
        onTimeout();
      }
    }, 1000);
    return () => {
      ACTIVITY.forEach((ev) => window.removeEventListener(ev, onActivity));
      window.clearInterval(timer);
    };
  }, [disabled, timeoutMs, warnBeforeMs, onTimeout, reset]);

  const stay = () => {
    reset();
    onStay?.();
  };

  return (
    <Dialog
      open={warning && remaining > 0}
      onClose={stay}
      title={title}
      alert
      actions={
        <>
          <Button variant="primary" onClick={stay}>
            {stayLabel}
          </Button>
          <Button onClick={onSignOut ?? onTimeout}>{signOutLabel}</Button>
        </>
      }
    >
      <p>
        {message} <strong className={styles.Time}>{formatRemaining(remaining)}</strong>.
      </p>
      <p className={styles.Live} role="status" aria-live="polite">
        {warning ? announcement(remaining) : ''}
      </p>
    </Dialog>
  );
}
