import type { FormEvent, ReactNode } from 'react';
import { cx } from '../../../utils/cx';
import { Button } from '../../atoms/Button';
import { Icon } from '../../atoms/Icon';
import { HotlineCard } from '../../molecules/HotlineCard';
import styles from './BookingStep.module.css';

export type BookingStepProps = {
  /** The one question this step asks; becomes the page h1. */
  title: string;
  /** Progress in words, e.g. "Bước 2 trên 4". */
  progress?: string;
  /** Short help under the title. */
  hint?: ReactNode;
  /** Slot for an ErrorSummary after a failed submit. */
  errorSummary?: ReactNode;
  /** The step's fields. */
  children: ReactNode;
  /** Back link. Omit on the first step. */
  backHref?: string;
  /** Default "Quay lại". */
  backLabel?: string;
  /** Default "Tiếp tục". */
  continueLabel?: string;
  onContinue?: (e: FormEvent<HTMLFormElement>) => void;
  submitting?: boolean;
  /** Clinic hotline by default, always in the same place (WCAG 3.2.6). */
  hotline?: { number: string; label?: string } | false;
  className?: string;
};

/**
 * One question per page, as in GOV.UK/NHS booking flows: back link, progress, question as h1,
 * error summary, fields, one primary action, hotline. Layout only; the page supplies the content.
 */
export function BookingStep({
  title,
  progress,
  hint,
  errorSummary,
  children,
  backHref,
  backLabel = 'Quay lại',
  continueLabel = 'Tiếp tục',
  onContinue,
  submitting,
  hotline = { number: '024 35 430 430', label: 'Cần giúp? Gọi tổng đài' },
  className,
}: BookingStepProps) {
  return (
    <main className={cx(styles.BookingStep, className)} data-component="BookingStep">
      {backHref ? (
        <a className={styles.Back} href={backHref}>
          <Icon name="simple-left" size={14} />
          <span>{backLabel}</span>
        </a>
      ) : null}
      <form
        className={styles.Form}
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          onContinue?.(e);
        }}
      >
        <header className={styles.Header}>
          {progress ? <p className={styles.Progress}>{progress}</p> : null}
          <h1 className={styles.Title}>{title}</h1>
          {hint ? <p className={styles.Hint}>{hint}</p> : null}
        </header>
        {errorSummary}
        <div className={styles.Fields}>{children}</div>
        <div className={styles.Actions}>
          <Button type="submit" variant="primary" block loading={submitting}>
            {continueLabel}
          </Button>
        </div>
      </form>
      {hotline ? (
        <aside className={styles.Help}>
          <HotlineCard number={hotline.number} label={hotline.label} />
        </aside>
      ) : null}
    </main>
  );
}
