import {
  forwardRef,
  useId,
  type ChangeEvent,
  type FocusEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { cx } from '../../../utils/cx';
import { Icon } from '../Icon';
import type { IconName } from '../Icon';
import { VisuallyHidden } from '../VisuallyHidden';
import styles from './TextField.module.css';

/** A text the message line keeps room for: a hint, or an error (drawn with its "!" sign). */
export type TextFieldReserve = string | { error: string };

export type TextFieldProps = {
  /** Visible label. Always pass one; placeholders never replace it. */
  label: string;
  /** Hide the label visually (still read by screen readers) only when a visible heading already names the field. */
  hideLabel?: boolean;
  /** Help text between the label and the field. Usually a string; NumberField passes its "Cao" tag line. */
  hint?: ReactNode;
  /** Error message; shown above the field with a "!" sign and a thicker red border. */
  error?: string;
  /** Screen-reader prefix before the error. Default "Lỗi:". */
  errorPrefix?: string;
  /**
   * One stable message line above the box, for a field whose help changes while the person works in it
   * (NumberField). Setting it, even to [], puts the error in the hint's place instead of a line of its own, and the
   * line keeps the room of the tallest text listed here (and at least one line), so the box never moves when the
   * hint, a tag or an error comes or goes. The texts are drawn hidden from CSS, so they are not in the page text.
   */
  reserve?: TextFieldReserve[];
  /** Leading icon (the nursing home's icon-led fields). */
  icon?: IconName;
  /** Unit shown inside the box on the right ("kg", "lần/phút"), and read after the label. */
  unit?: string;
  /**
   * @deprecated Since 2.4: a tag beside the box takes the box's width, so a typed value can be cut off and boxes in a
   * column stop lining up. Put a tag in the hint line instead (NumberField does). Still drawn beside the box; removed in 3.0.
   */
  after?: ReactNode;
  /** Renders a resizable textarea. */
  multiline?: boolean;
  rows?: number;
  type?: 'text' | 'tel' | 'email' | 'number' | 'search' | 'password';
  onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange' | 'onBlur'>;

/** A labeled input or textarea with hint and error, for every FDC form. The consumer owns the value and validation. */
export const TextField = forwardRef<HTMLInputElement | HTMLTextAreaElement, TextFieldProps>(function TextField(
  { label, hideLabel, hint, error, errorPrefix = 'Lỗi:', reserve, icon, unit, after, multiline, rows = 4, type = 'text', id, required, className, ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? `fdc-field-${autoId}`;
  const oneLine = reserve !== undefined;
  const hasHint = hint != null && hint !== '' && hint !== false;
  // In one message line the error takes the hint's place; otherwise both show, the hint first.
  const showHint = hasHint && !(oneLine && error);
  const hintId = showHint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const unitId = unit ? `${inputId}-unit` : undefined;
  const describedBy = [unitId, hintId, errorId].filter(Boolean).join(' ') || undefined;
  const common = {
    ...rest,
    id: inputId,
    required,
    className: styles.Input,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy,
  };

  const errorText = (
    <>
      {/* The type as a sign, not only red: in the nursing-home theme red sits next to the orange brand. */}
      <span className={styles.Mark} aria-hidden="true" data-part="mark">
        !
      </span>
      <span className={styles.ErrorText}>
        <VisuallyHidden>{errorPrefix} </VisuallyHidden>
        {error}
      </span>
    </>
  );

  return (
    <div
      className={cx(styles.TextField, className)}
      data-component="TextField"
      data-invalid={error ? 'true' : undefined}
      data-icon={icon ? 'true' : undefined}
      data-unit={unit ? 'true' : undefined}
      data-message={oneLine ? 'one-line' : undefined}
      // Room on the right for the unit, sized to its text so "lần/phút" never sits under the digits.
      style={unit ? ({ '--unit-space': `calc(${unit.length}ch + var(--space-30))` } as React.CSSProperties) : undefined}
    >
      <label className={hideLabel ? styles.HiddenLabel : styles.Label} htmlFor={inputId} data-part="label">
        {label}
        {required ? (
          <span className={styles.Required} aria-hidden="true">
            {' '}*
          </span>
        ) : null}
      </label>
      {oneLine ? (
        // Every text the line may show sits in one grid cell; only the current one is visible, so the cell (and the
        // box under it) keeps the height of the tallest.
        <span className={styles.Message} data-part="hint">
          {error ? (
            <span id={errorId} className={styles.Error}>
              {errorText}
            </span>
          ) : showHint ? (
            <span id={hintId} className={styles.Hint}>
              {hint}
            </span>
          ) : null}
          {reserve.map((r, i) =>
            typeof r === 'string' ? (
              <span key={i} className={styles.Reserve} aria-hidden="true" data-text={r} />
            ) : (
              <span key={i} className={cx(styles.Reserve, styles.ReserveError)} aria-hidden="true" data-text={r.error} />
            ),
          )}
        </span>
      ) : (
        <>
          {showHint ? (
            <span id={hintId} className={styles.Hint} data-part="hint">
              {hint}
            </span>
          ) : null}
          {error ? (
            <span id={errorId} className={styles.Error} data-part="error">
              {errorText}
            </span>
          ) : null}
        </>
      )}
      <div className={styles.Control} data-part="control">
        <div className={styles.Box}>
          {icon ? <Icon name={icon} size={18} className={styles.Icon} /> : null}
          {multiline ? (
            <textarea {...(common as object)} rows={rows} ref={ref as React.Ref<HTMLTextAreaElement>} />
          ) : (
            <input {...common} type={type} ref={ref as React.Ref<HTMLInputElement>} />
          )}
          {unit ? (
            <span id={unitId} className={styles.Unit}>
              {unit}
            </span>
          ) : null}
        </div>
        {after ? <span className={styles.After}>{after}</span> : null}
      </div>
    </div>
  );
});
TextField.displayName = 'TextField';
