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
  /**
   * list = a heading and one link per line: patient forms, where each problem gets its own 44px line. Default.
   * inline = staff forms: a smaller heading, less padding and the links in one wrapping line separated by " · ",
   * so four empty fields do not push the form down. Still a list for screen readers, still focused on mount.
   */
  layout?: 'list' | 'inline';
  className?: string;
};

/**
 * The list of problems at the top of a form after a failed submit. Each item links to its field.
 * Render it only when there are errors; it takes focus so screen-reader and keyboard users land on it.
 */
export function ErrorSummary({
  errors,
  title = 'Vui lòng kiểm tra lại thông tin',
  focusOnMount = true,
  layout = 'list',
  className,
}: ErrorSummaryProps) {
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
    target.scrollIntoView?.({ block: 'center' });
  };

  return (
    <div
      ref={ref}
      className={cx(styles.ErrorSummary, className)}
      tabIndex={-1}
      role="alert"
      aria-labelledby={titleId}
      data-component="ErrorSummary"
      data-layout={layout}
    >
      <h2 id={titleId} className={styles.Title}>
        {title}
      </h2>
      {/* role="list" keeps the list for VoiceOver in Safari, which drops it once list-style is none (inline). */}
      <ul className={styles.List} role={layout === 'inline' ? 'list' : undefined}>
        {errors.map((e, i) => (
          <li key={e.fieldId} className={styles.Item}>
            <a className={styles.Link} href={`#${e.fieldId}`} onClick={go(e.fieldId)}>
              {e.text}
            </a>
            {/* After the link, so a wrapped line starts with a link, flush with the heading. */}
            {layout === 'inline' && i < errors.length - 1 ? (
              <span className={styles.Separator} aria-hidden="true">
                ·
              </span>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
