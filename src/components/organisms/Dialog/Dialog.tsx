import { useEffect, useId, useRef, type ReactNode } from 'react';
import { cx } from '../../../utils/cx';
import styles from './Dialog.module.css';

export type DialogProps = {
  open: boolean;
  /** Called on Esc, on the close action, or when the browser closes it. */
  onClose: () => void;
  title: string;
  children?: ReactNode;
  /** Buttons row; put the least destructive action first. */
  actions?: ReactNode;
  /** role="alertdialog" for warnings that need an answer (e.g. session timeout). */
  alert?: boolean;
  className?: string;
};

/**
 * Modal dialog on the native <dialog> element: the browser traps focus, closes on Esc and returns focus to
 * the trigger. Use sparingly; a page is usually kinder than a dialog for older users.
 */
export function Dialog({ open, onClose, title, children, actions, alert, className }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const bodyId = useId();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) {
      opener.current = document.activeElement as HTMLElement | null;
      if (typeof el.showModal === 'function') el.showModal();
      else el.setAttribute('open', '');
    } else if (!open && el.open) {
      if (typeof el.close === 'function') el.close();
      else el.removeAttribute('open');
      // Browsers differ on restoring focus after close(); do it explicitly.
      opener.current?.focus();
      opener.current = null;
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={cx(styles.Dialog, className)}
      role={alert ? 'alertdialog' : undefined}
      aria-labelledby={titleId}
      aria-describedby={children ? bodyId : undefined}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onKeyDown={(e) => {
        // Native Esc only fires for real key presses; handle it for scripted and assistive input too.
        if (e.key === 'Escape') {
          e.preventDefault();
          onClose();
        }
      }}
      data-component="Dialog"
    >
      <h2 id={titleId} className={styles.Title}>
        {title}
      </h2>
      {children ? (
        <div id={bodyId} className={styles.Body}>
          {children}
        </div>
      ) : null}
      {actions ? <div className={styles.Actions}>{actions}</div> : null}
    </dialog>
  );
}
