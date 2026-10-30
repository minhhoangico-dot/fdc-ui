import { createElement, useEffect, useRef, type ReactNode } from 'react';
import { cx } from '../../../utils/cx';
import { VisuallyHidden } from '../../atoms/VisuallyHidden';
import styles from './ConfirmationPanel.module.css';

export type StepState = 'done' | 'current' | 'todo' | 'failed';
/** A step and what has actually happened to it. Each state should come from a real event (a receipt, an answer). */
export type ConfirmationStep = { label: string; state: StepState };
export type ConfirmationTone = 'success' | 'pending' | 'error' | 'attention';

/** The sign in the circle before the title of a pale panel; hidden from screen readers, which read the title. */
const signs: Record<ConfirmationTone, string> = { success: '✓', pending: 'i', error: '!', attention: '!' };

export type ConfirmationPanelProps = {
  /** "Đã đặt lịch khám" (success), "Chờ gửi · còn 27 giây" (pending), "Bị từ chối" (error), "Chưa rõ kết quả" (attention). */
  title: string;
  /** Booking or receipt code, e.g. "FDC-2410-0830" or "SYT-HN-2026-118204". It never breaks across lines. */
  reference?: string;
  /** Default "Mã đặt lịch của bạn". */
  referenceLabel?: string;
  /** What happens next, how to change or cancel, and the buttons for the next step. */
  children?: ReactNode;
  /** Move focus to the title when shown (after a submit). Default true. */
  focusOnMount?: boolean;
  /**
   * What the result is. Every tone except a strong success is a pale panel: a tint, a sign in a circle before the
   * title and ordinary text, with no edge and no side bar (status colors are the same in both themes).
   * - success (default): the work is done and confirmed. Green is only ever for success.
   * - pending: pressed but not finished ("Chờ gửi · còn 27 giây"): status-info tint, sign "i".
   * - error: the other side refused and said why ("Bị từ chối"): status-error tint, sign "!". Say the reason,
   *   where to fix it and what comes after the fix.
   * - attention: the outcome is not known ("Chưa rõ kết quả"): status-warning tint, sign "!". Offer a check,
   *   never a resend, while the other side may already hold the record.
   */
  tone?: ConfirmationTone;
  /**
   * How loud a success is. strong (default) = the solid green panel with white text that ends a patient flow
   * ("Đã đặt lịch khám"). subtle = for staff screens, where a result is one block among many: a pale
   * status-success-bg panel with a "✓" sign, the title in green, ordinary text, left-aligned, the reference code
   * in a white box and the explanation inside the panel. Other tones are always pale.
   */
  emphasis?: 'strong' | 'subtle';
  /**
   * Short step line. Prefer objects with an explicit state per step, set from real events. Done steps say what
   * happened ("Đã gửi lên Sở", "Sở đã tiếp nhận"), the step waited for says "Chờ …" ("Chờ Bộ xác nhận"),
   * later steps are plain event names ("Bộ xác nhận"):
   * [{ label: 'Sở đã tiếp nhận', state: 'done' }, { label: 'Chờ Bộ xác nhận', state: 'current' }].
   * Plain strings with `currentStep` still work (earlier steps are then shown as done).
   */
  steps?: Array<string | ConfirmationStep>;
  /** For plain-string steps: index of the current step (0-based). */
  currentStep?: number;
  /** Read before a done step. Default "Xong:". */
  donePrefix?: string;
  /** Read before the step being waited for. Default "Hiện tại:". */
  currentPrefix?: string;
  /** Read before a step still to come. Default "Bước sau:". */
  todoPrefix?: string;
  /** Read before a failed step. Default "Lỗi:". */
  failedPrefix?: string;
  /** Read before the step line. Default "Tiến trình". */
  stepsLabel?: string;
  /** Heading level of the title. Default 1 (the page result); use 2 or 3 inside a page that has its own h1. */
  headingLevel?: 1 | 2 | 3;
  className?: string;
};

/** A small clock: the step is being waited for. Drawn in the text color; never a dashed edge, which means an unavailable button. */
function WaitMark() {
  return (
    <svg className={styles.Clock} viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <circle cx="8" cy="8" r="6.25" />
      <path d="M8 4.5V8l2.25 1.5" />
    </svg>
  );
}

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
  donePrefix = 'Xong:',
  currentPrefix = 'Hiện tại:',
  todoPrefix = 'Bước sau:',
  failedPrefix = 'Lỗi:',
  headingLevel = 1,
  className,
}: ConfirmationPanelProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (focusOnMount) ref.current?.focus();
  }, [focusOnMount]);
  // Only a strong success is the solid green panel; every other panel is pale and holds its explanation
  // ("Chị có thể hủy."). The strong panel puts the explanation under the panel, on the page.
  const pale = tone !== 'success' || emphasis === 'subtle';
  const prefixes: Record<StepState, string> = { done: donePrefix, current: currentPrefix, todo: todoPrefix, failed: failedPrefix };
  const heading = createElement(`h${headingLevel}`, { ref, tabIndex: -1, className: styles.Title }, title);
  return (
    <div
      className={cx(styles.ConfirmationPanel, className)}
      data-component="ConfirmationPanel"
      data-tone={tone}
      data-emphasis={tone === 'success' ? emphasis : undefined}
      data-pale={pale || undefined}
    >
      <div className={styles.Panel}>
        {pale ? (
          <div className={styles.Head}>
            <span className={styles.Mark} aria-hidden="true" data-part="mark">
              {signs[tone]}
            </span>
            {heading}
          </div>
        ) : (
          heading
        )}
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
                    {/* The state in words for screen readers; the signs on screen are hidden from them. */}
                    {state ? <VisuallyHidden>{prefixes[state]} </VisuallyHidden> : null}
                    {state === 'done' ? (
                      <span className={styles.StepMark} aria-hidden="true" data-part="done-mark">
                        ✓
                      </span>
                    ) : state === 'current' ? (
                      <span className={styles.StepMark} aria-hidden="true" data-part="wait-mark">
                        <WaitMark />
                      </span>
                    ) : state === 'failed' ? (
                      <span className={styles.StepMark} aria-hidden="true" data-part="failed-mark">
                        !
                      </span>
                    ) : null}
                    <span>{label}</span>
                  </span>
                </li>
              );
            })}
          </ol>
        ) : null}
        {children && pale ? <div className={styles.Next}>{children}</div> : null}
      </div>
      {children && !pale ? <div className={styles.Next}>{children}</div> : null}
    </div>
  );
}
