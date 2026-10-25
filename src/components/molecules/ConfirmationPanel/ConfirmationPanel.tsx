import { useEffect, useRef, type ReactNode } from 'react';
import { cx } from '../../../utils/cx';
import styles from './ConfirmationPanel.module.css';

export type ConfirmationPanelProps = {
  /** "Đã đặt lịch khám" */
  title: string;
  /** Booking or request code, e.g. "FDC-2410-0830". */
  reference?: string;
  /** Default "Mã đặt lịch của bạn". */
  referenceLabel?: string;
  /** What happens next, how to change or cancel. */
  children?: ReactNode;
  /** Move focus to the title when shown (after a submit). Default true. */
  focusOnMount?: boolean;
  className?: string;
};

/** The finish of a flow: a clear success panel with the reference code, then what happens next. */
export function ConfirmationPanel({
  title,
  reference,
  referenceLabel = 'Mã đặt lịch của bạn',
  children,
  focusOnMount = true,
  className,
}: ConfirmationPanelProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (focusOnMount) ref.current?.focus();
  }, [focusOnMount]);
  return (
    <div className={cx(styles.ConfirmationPanel, className)} data-component="ConfirmationPanel">
      <div className={styles.Panel}>
        <h1 ref={ref} tabIndex={-1} className={styles.Title}>
          {title}
        </h1>
        {reference ? (
          <p className={styles.Reference}>
            {referenceLabel}
            <strong className={styles.Code}>{reference}</strong>
          </p>
        ) : null}
      </div>
      {children ? <div className={styles.Next}>{children}</div> : null}
    </div>
  );
}
