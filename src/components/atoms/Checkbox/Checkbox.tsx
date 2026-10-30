import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../../utils/cx';
import { VisuallyHidden } from '../VisuallyHidden';
import styles from './Checkbox.module.css';

export type CheckboxProps = {
  /** What ticking means, said as a statement: "Tôi đã xem phần nhập tay". */
  label: ReactNode;
  /** Help under the label, lined up with its text: "1 kết quả nhập tay: X-quang tim phổi". */
  hint?: ReactNode;
  /** Error message; shown above the box with one red bar on the left. */
  error?: string;
  /** Screen-reader prefix before the error. Default "Lỗi:". */
  errorPrefix?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>;

/**
 * One yes/no statement the person ticks: a native checkbox inside its label, so the whole row
 * (at least 44px tall) is the click target. For one choice from a list, use RadioGroup.
 * The consumer owns the value and validation (checked / defaultChecked / onChange).
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, hint, error, errorPrefix = 'Lỗi:', id, required, disabled, className, ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? `fdc-checkbox-${autoId}`;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div
      className={cx(styles.Checkbox, className)}
      data-component="Checkbox"
      data-invalid={error ? 'true' : undefined}
      data-disabled={disabled ? 'true' : undefined}
    >
      {error ? (
        <span id={errorId} className={styles.Error} data-part="error">
          {/* The type as a sign, not only red (as TextField): in the nursing-home theme red sits next to the orange brand. */}
          <span className={styles.Mark} aria-hidden="true" data-part="mark">
            !
          </span>
          <span className={styles.ErrorText}>
            <VisuallyHidden>{errorPrefix} </VisuallyHidden>
            {error}
          </span>
        </span>
      ) : null}
      <label className={styles.Row} htmlFor={inputId}>
        <input
          {...rest}
          ref={ref}
          id={inputId}
          type="checkbox"
          className={styles.Input}
          required={required}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
        />
        <span className={styles.Text}>
          {label}
          {required ? (
            <span className={styles.Required} aria-hidden="true">
              {' '}*
            </span>
          ) : null}
        </span>
      </label>
      {hint ? (
        <span id={hintId} className={styles.Hint}>
          {hint}
        </span>
      ) : null}
    </div>
  );
});
Checkbox.displayName = 'Checkbox';
