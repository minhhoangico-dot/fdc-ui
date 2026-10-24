import { useEffect, useId, useRef, type MouseEvent } from 'react';
import { cx } from '../../../utils/cx';
import styles from './ErrorSummary.module.css';

export type ErrorSummaryItem = {
  /** id of the input to focus, e.g. "lookup-phone" or a DateInput's "<id>-day". */
  fieldId: string;
  /** Same words as the field's own message: "Nhập số điện thoại gồm 10 chữ số". */
  text: string;
};

export type ErrorSummaryProps = {
  errors: ErrorSummaryItem[];
  /** Default "Vui lòng kiểm tra lại thông tin". */
  title?: string;
  /** Move focus here when it appears (after a failed submit). Default true. */
  focusOnMount?: boolean;
  className?: string;
};

/**
 * The list of problems at the top of a form after a failed submit. Each item links to its field.
 * Render it only when there are errors; it takes focus so screen-reader and keyboard users land on it.
 */
export function ErrorSummary({ errors, title = 'Vui lòng kiểm tra lại thông tin', focusOnMount = true, className }: ErrorSummaryProps) {
  const ref = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const signature = errors.map((e) => e.fieldId).join('|');

  useEffect(() => {
    if (focusOnMount && errors.length) ref.current?.focus();
    // Refocus only when the set of failing fields changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature, focusOnMount]);

  if (!errors.length) return null;

  const go = (fieldId: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById(fieldId);
    if (!target) return;
    e.preventDefault();
    target.focus();
    target.scrollIntoView({ block: 'center' });
  };

  return (
    <div ref={ref} className={cx(styles.ErrorSummary, className)} tabIndex={-1} role="alert" aria-labelledby={titleId} data-component="ErrorSummary">
      <h2 id={titleId} className={styles.Title}>
        {title}
      </h2>
      <ul className={styles.List}>
        {errors.map((e) => (
          <li key={e.fieldId}>
            <a className={styles.Link} href={`#${e.fieldId}`} onClick={go(e.fieldId)}>
              {e.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
