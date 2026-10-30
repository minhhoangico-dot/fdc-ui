import { useEffect, useId, useRef, useState, type FocusEvent, type MouseEvent } from 'react';
import { cx } from '../../../utils/cx';
import styles from './ErrorSummary.module.css';

export type ErrorSummaryItem = {
  /** id of the input to focus, e.g. "lookup-phone" or a DateInput's "<id>-day". */
  fieldId: string;
  /**
   * The link's words. `list`: the field's own message ("Nhập số điện thoại gồm 10 chữ số").
   * `inline`: the field's short name ("Mạch", "Tâm thu"), with the count in the title ("Còn 4 mục chưa điền").
   */
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
   * inline = staff forms: a smaller heading, less padding and the links side by side in rows that wrap, set apart by
   * space (no dots), so four empty fields do not push the form down. Pass the fields' short names. Still a list for
   * screen readers, still focused on mount.
   */
  layout?: 'list' | 'inline';
  className?: string;
};

/**
 * The list of problems at the top of a form after a failed submit. Each item links to its field.
 * Render it only when there are errors; it takes focus so screen-reader and keyboard users land on it.
 *
 * It is read once. It appears as an alert (read at once, even when it does not take focus). Once focus has been in it
 * and moved on, or once its list changes without it being shown again (a page that drops filled fields on "Lưu"), it
 * becomes a group named by its title: later changes are not read over what the person is doing. Rendered again after
 * having no errors, or given a new `key`, it is an alert again.
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

  // What the summary says, to tell a new appearance (from nothing) from a change while it shows.
  const content = errors.length ? [title, ...errors.map((e) => `${e.fieldId}\u0000${e.text}`)].join('\u0001') : '';
  const [shown, setShown] = useState(content);
  const [read, setRead] = useState(false);
  if (content !== shown) {
    // Updating state while rendering (React's pattern for state that follows props): the new words and the new role
    // reach the page in the same commit, so a change is never read as an alert.
    setShown(content);
    setRead(shown !== '' && content !== '');
  }

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

  // Focus has been in the summary and left it (to a field, or anywhere): it has been read.
  const onBlur = (e: FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setRead(true);
  };

  return (
    <div
      ref={ref}
      className={cx(styles.ErrorSummary, className)}
      tabIndex={-1}
      role={read ? 'group' : 'alert'}
      aria-labelledby={titleId}
      data-component="ErrorSummary"
      data-layout={layout}
      onBlur={onBlur}
    >
      <h2 id={titleId} className={styles.Title}>
        {/* The type as a sign, not only the red edge: in the nursing-home theme red sits close to the brand orange. */}
        <span className={styles.Mark} aria-hidden="true" data-part="mark">
          !
        </span>
        <span>{title}</span>
      </h2>
      {/* role="list" keeps the list for VoiceOver in Safari, which drops it once list-style is none (inline). */}
      <ul className={styles.List} role={layout === 'inline' ? 'list' : undefined}>
        {errors.map((e) => (
          <li key={e.fieldId} className={styles.Item}>
            <a className={styles.Link} href={`#${e.fieldId}`} onClick={go(e.fieldId)}>
              {e.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
