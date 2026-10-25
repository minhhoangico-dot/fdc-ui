import { createElement, useEffect, useRef, type ReactNode } from 'react';
import { cx } from '../../../utils/cx';
import styles from './ConfirmationPanel.module.css';

export type ConfirmationPanelProps = {
  /** "Đã đặt lịch khám" (success) or "Chờ gửi · còn 27 giây" (pending). */
  title: string;
  /** Booking or request code, e.g. "FDC-2410-0830". */
  reference?: string;
  /** Default "Mã đặt lịch của bạn". */
  referenceLabel?: string;
  /** What happens next, how to change or cancel. */
  children?: ReactNode;
  /** Move focus to the title when shown (after a submit). Default true. */
  focusOnMount?: boolean;
  /**
   * success (default) = the work is done: green panel. pending = pressed but not finished yet
   * ("Chờ gửi · còn 27 giây"): pale status-info panel with ordinary text. Green is only ever for success.
   */
  tone?: 'success' | 'pending';
  /** Short step line, e.g. ['Chờ gửi', 'Đang gửi', 'Đã gửi lên Sở', 'Bộ đã nhận']. */
  steps?: string[];
  /** Index of the current step in `steps` (0-based). */
  currentStep?: number;
  /** Read before the step line. Default "Tiến trình". */
  stepsLabel?: string;
  /** Heading level of the title. Default 1 (the page result); use 2 or 3 inside a page that has its own h1. */
  headingLevel?: 1 | 2 | 3;
  className?: string;
};

/**
 * The finish of a flow, or its waiting state: a clear panel with the title, the reference code,
 * an optional step line, then what happens next.
 */
export function ConfirmationPanel({
  title,
  reference,
  referenceLabel = 'Mã đặt lịch của bạn',
  children,
  focusOnMount = true,
  tone = 'success',
  steps,
  currentStep,
  stepsLabel = 'Tiến trình',
  headingLevel = 1,
  className,
}: ConfirmationPanelProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (focusOnMount) ref.current?.focus();
  }, [focusOnMount]);
  return (
    <div className={cx(styles.ConfirmationPanel, className)} data-component="ConfirmationPanel" data-tone={tone}>
      <div className={styles.Panel}>
        {createElement(`h${headingLevel}`, { ref, tabIndex: -1, className: styles.Title }, title)}
        {reference ? (
          <p className={styles.Reference}>
            {referenceLabel}
            <strong className={styles.Code}>{reference}</strong>
          </p>
        ) : null}
        {steps?.length ? (
          <ol className={styles.Steps} aria-label={stepsLabel}>
            {steps.map((s, i) => (
              <li
                key={s}
                className={styles.Step}
                aria-current={i === currentStep ? 'step' : undefined}
                data-state={currentStep === undefined ? undefined : i < currentStep ? 'done' : i === currentStep ? 'current' : 'todo'}
              >
                <span className={styles.StepLabel}>{s}</span>
              </li>
            ))}
          </ol>
        ) : null}
        {/* Pending: the explanation ("Chị có thể hủy.") belongs inside the panel. */}
        {children && tone === 'pending' ? <div className={styles.Next}>{children}</div> : null}
      </div>
      {children && tone !== 'pending' ? <div className={styles.Next}>{children}</div> : null}
    </div>
  );
}
