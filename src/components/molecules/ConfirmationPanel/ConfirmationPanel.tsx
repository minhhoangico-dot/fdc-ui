import { createElement, useEffect, useRef, type ReactNode } from 'react';
import { cx } from '../../../utils/cx';
import { VisuallyHidden } from '../../atoms/VisuallyHidden';
import styles from './ConfirmationPanel.module.css';

export type StepState = 'done' | 'current' | 'todo' | 'failed';
/** A step and what has actually happened to it. Each state should come from a real event (a receipt, an answer). */
export type ConfirmationStep = { label: string; state: StepState };

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
  /**
   * How loud a success is. strong (default) = the solid green panel with white text that ends a patient flow
   * ("Đã đặt lịch khám"). subtle = for staff screens, where a result is one block among many: a pale
   * status-success-bg panel with a 1px status-success-text edge, the title in green, ordinary text, left-aligned,
   * the reference code in a white box and the explanation inside the panel. Pending panels are always subtle.
   */
  emphasis?: 'strong' | 'subtle';
  /**
   * Short step line. Prefer objects with an explicit state per step, set from real events:
   * [{ label: 'Đã gửi lên Sở', state: 'done' }, { label: 'Bộ đã nhận', state: 'current' }].
   * Plain strings with `currentStep` still work (earlier steps are then shown as done).
   */
  steps?: Array<string | ConfirmationStep>;
  /** For plain-string steps: index of the current step (0-based). */
  currentStep?: number;
  /** Read before a failed step. Default "Lỗi:". */
  failedPrefix?: string;
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
  emphasis = 'strong',
  steps,
  currentStep,
  stepsLabel = 'Tiến trình',
  failedPrefix = 'Lỗi:',
  headingLevel = 1,
  className,
}: ConfirmationPanelProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (focusOnMount) ref.current?.focus();
  }, [focusOnMount]);
  // Pending and subtle panels hold their explanation ("Chị có thể hủy."); the strong panel puts it under the panel, on the page.
  const nextInside = tone === 'pending' || emphasis === 'subtle';
  return (
    <div
      className={cx(styles.ConfirmationPanel, className)}
      data-component="ConfirmationPanel"
      data-tone={tone}
      data-emphasis={tone === 'success' ? emphasis : undefined}
    >
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
            {steps.map((step, i) => {
              const label = typeof step === 'string' ? step : step.label;
              const state: StepState | undefined =
                typeof step === 'string'
                  ? currentStep === undefined
                    ? undefined
                    : i < currentStep
                      ? 'done'
                      : i === currentStep
                        ? 'current'
                        : 'todo'
                  : step.state;
              return (
                <li key={label} className={styles.Step} aria-current={state === 'current' ? 'step' : undefined} data-state={state}>
                  <span className={styles.StepLabel}>
                    {state === 'failed' ? <VisuallyHidden>{failedPrefix} </VisuallyHidden> : null}
                    {/* A done step shows a tick; the current step is only outlined, so it never looks more finished. */}
                    {state === 'done' ? (
                      <span aria-hidden="true" data-part="done-mark">
                        ✓{' '}
                      </span>
                    ) : null}
                    {label}
                  </span>
                </li>
              );
            })}
          </ol>
        ) : null}
        {children && nextInside ? <div className={styles.Next}>{children}</div> : null}
      </div>
      {children && !nextInside ? <div className={styles.Next}>{children}</div> : null}
    </div>
  );
}
