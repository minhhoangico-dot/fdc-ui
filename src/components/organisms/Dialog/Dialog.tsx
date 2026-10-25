import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from 'react';
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
  /** wide (about 52rem) for dialogs that hold a list or table. Default default (32rem). */
  size?: 'default' | 'wide';
  /**
   * The body scrolls between a fixed title and a fixed Actions row, with a fade at the bottom while
   * more content is below. Use with long lists so the buttons never scroll away.
   */
  scrollBody?: boolean;
  /** Label of the scrolling body for keyboard and screen-reader users. Default: the title. */
  bodyLabel?: string;
  className?: string;
};

/**
 * Modal dialog on the native <dialog> element: the browser traps focus, closes on Esc and returns focus to
 * the trigger. Use sparingly; a page is usually kinder than a dialog for older users.
 */
export function Dialog({ open, onClose, title, children, actions, alert, size = 'default', scrollBody, bodyLabel, className }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const body = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const bodyId = useId();
  const [more, setMore] = useState(false);

  // Is there content below the visible part of the scrolling body?
  const measure = useCallback(() => {
    const el = body.current;
    setMore(Boolean(el && el.scrollHeight - el.scrollTop - el.clientHeight > 1));
  }, []);
  useEffect(() => {
    if (!scrollBody || !open) return;
    measure();
    const el = body.current;
    const ro = typeof ResizeObserver === 'function' ? new ResizeObserver(measure) : null;
    if (el) ro?.observe(el);
    return () => ro?.disconnect();
  }, [scrollBody, open, children, measure]);

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
      aria-describedby={children && !scrollBody ? bodyId : undefined}
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
      data-size={size}
      data-scroll-body={scrollBody || undefined}
    >
      <h2 id={titleId} className={styles.Title}>
        {title}
      </h2>
      {children && scrollBody ? (
        <div className={styles.Scroller} data-more={more || undefined}>
          {/* Focusable so keyboard users can scroll it; named after the dialog. */}
          <div
            ref={body}
            id={bodyId}
            className={styles.Body}
            tabIndex={0}
            role="region"
            aria-label={bodyLabel ?? title}
            onScroll={measure}
          >
            {children}
          </div>
        </div>
      ) : children ? (
        <div id={bodyId} className={styles.Body}>
          {children}
        </div>
      ) : null}
      {actions ? <div className={styles.Actions}>{actions}</div> : null}
    </dialog>
  );
}
