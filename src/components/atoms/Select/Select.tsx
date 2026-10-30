import { forwardRef, useId, type ReactNode, type SelectHTMLAttributes } from 'react';
import { cx } from '../../../utils/cx';
import { Icon } from '../Icon';
import { VisuallyHidden } from '../VisuallyHidden';
import styles from './Select.module.css';

export type SelectOption = {
  value: string;
  /** What the person reads: "Cần điền hoặc sửa · 1.019". */
  label: string;
  disabled?: boolean;
};

export type SelectProps = {
  /** Visible label. Always pass one. */
  label: string;
  /** Hide the label visually (still read by screen readers) only when a visible heading already names the field. */
  hideLabel?: boolean;
  /** Help text between the label and the field. */
  hint?: string;
  /** Error message; shown under the label with a thicker red border. */
  error?: string;
  /** Screen-reader prefix before the error. Default "Lỗi:". */
  errorPrefix?: string;
  /** The choices. Or pass <option>/<optgroup> elements as children. */
  options?: SelectOption[];
  children?: ReactNode;
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'>;

/**
 * One choice from a list, as a native select dressed like a TextField (same parts, height and edge),
 * so it lines up in a FieldRow. Use it where tiles would take too much room: a list filter on a phone,
 * a long fixed list. For a short question on its own page use RadioGroup; for coded items people type
 * to find, Combobox. The consumer owns the value (value / defaultValue / onChange).
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, hideLabel, hint, error, errorPrefix = 'Lỗi:', options, children, id, required, multiple, className, ...rest },
  ref,
) {
  const autoId = useId();
  const selectId = id ?? `fdc-select-${autoId}`;
  const hintId = hint ? `${selectId}-hint` : undefined;
  const errorId = error ? `${selectId}-error` : undefined;

  return (
    <div className={cx(styles.Select, className)} data-component="Select" data-invalid={error ? 'true' : undefined}>
      <label className={hideLabel ? styles.HiddenLabel : styles.Label} htmlFor={selectId} data-part="label">
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
      <div className={styles.Control} data-part="control">
        <select
          {...rest}
          ref={ref}
          id={selectId}
          className={styles.Input}
          required={required}
          multiple={multiple}
          aria-invalid={error ? true : undefined}
          aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
        >
          {options?.map((o) => (
            <option key={o.value} value={o.value} disabled={o.disabled}>
              {o.label}
            </option>
          ))}
          {children}
        </select>
        {/* A list box (multiple) shows its options, so it has no chevron. */}
        {multiple ? null : <Icon name="rounded-down" size={14} className={styles.Chevron} />}
      </div>
    </div>
  );
});
Select.displayName = 'Select';
