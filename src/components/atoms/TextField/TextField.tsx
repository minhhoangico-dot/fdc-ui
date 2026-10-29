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

export type TextFieldProps = {
  /** Visible label. Always pass one; placeholders never replace it. */
  label: string;
  /** Hide the label visually (still read by screen readers) only when a visible heading already names the field. */
  hideLabel?: boolean;
  /** Help text between the label and the field. */
  hint?: string;
  /** Error message; shown under the label with a thicker red border. */
  error?: string;
  /** Screen-reader prefix before the error. Default "Lỗi:". */
  errorPrefix?: string;
  /** Leading icon (the nursing home's icon-led fields). */
  icon?: IconName;
  /** Unit shown inside the box on the right ("kg", "lần/phút"), and read after the label. */
  unit?: string;
  /** Next to the box, outside it: a StatusTag such as "Cao" for the value typed. */
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
  { label, hideLabel, hint, error, errorPrefix = 'Lỗi:', icon, unit, after, multiline, rows = 4, type = 'text', id, required, className, ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? `fdc-field-${autoId}`;
  const hintId = hint ? `${inputId}-hint` : undefined;
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

  return (
    <div
      className={cx(styles.TextField, className)}
      data-component="TextField"
      data-invalid={error ? 'true' : undefined}
      data-icon={icon ? 'true' : undefined}
      data-unit={unit ? 'true' : undefined}
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
      {hint ? (
        <span id={hintId} className={styles.Hint} data-part="hint">
          {hint}
        </span>
      ) : null}
      {error ? (
        <span id={errorId} className={styles.Error} data-part="error">
          <VisuallyHidden>{errorPrefix} </VisuallyHidden>
          {error}
        </span>
      ) : null}
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
