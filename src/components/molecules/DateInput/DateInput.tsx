import { useId, useState, type ChangeEvent } from 'react';
import { cx } from '../../../utils/cx';
import { VisuallyHidden } from '../../atoms/VisuallyHidden';
import type { DateParts } from './dateParts';
import styles from './DateInput.module.css';

export type DateInputProps = {
  /** The question, read as the group's legend: "Ngày sinh của người bệnh". */
  label: string;
  /** Default "Ví dụ: 27 3 1950" (the date joined by no-break spaces). */
  hint?: string;
  error?: string;
  errorPrefix?: string;
  /** Adds bday-* autocomplete so browsers can fill a date of birth. Default true. */
  birthday?: boolean;
  /** Field names become `${name}-day`, `${name}-month`, `${name}-year`. */
  name?: string;
  value?: DateParts;
  defaultValue?: DateParts;
  onValueChange?: (value: DateParts) => void;
  /** Part labels. Default Ngày / Tháng / Năm. */
  partLabels?: { day: string; month: string; year: string };
  required?: boolean;
  /** Base id; the parts get `${id}-day`, `${id}-month`, `${id}-year` (link an error summary to `${id}-day`). */
  id?: string;
  className?: string;
};

const EMPTY: DateParts = { day: '', month: '', year: '' };

/**
 * A date people already know (date of birth), typed as three boxes: Ngày / Tháng / Năm.
 * Typing beats a calendar picker for older users; use partsToDate() to validate.
 */
export function DateInput({
  label,
  // No-break spaces: the example date never breaks over two lines.
  hint = 'Ví dụ: 27\u00a03\u00a01950',
  error,
  errorPrefix = 'Lỗi:',
  birthday = true,
  name = 'date',
  value,
  defaultValue = EMPTY,
  onValueChange,
  partLabels = { day: 'Ngày', month: 'Tháng', year: 'Năm' },
  required,
  id: givenId,
  className,
}: DateInputProps) {
  const autoId = useId();
  const id = givenId ?? `fdc-date-${autoId}`;
  const [inner, setInner] = useState(defaultValue);
  const current = value ?? inner;
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  const update = (part: keyof DateParts) => (e: ChangeEvent<HTMLInputElement>) => {
    const next = { ...current, [part]: e.target.value.replace(/\D/g, '') };
    if (value === undefined) setInner(next);
    onValueChange?.(next);
  };

  const parts: Array<{ key: keyof DateParts; max: number; auto: string }> = [
    { key: 'day', max: 2, auto: 'bday-day' },
    { key: 'month', max: 2, auto: 'bday-month' },
    { key: 'year', max: 4, auto: 'bday-year' },
  ];

  return (
    <fieldset
      className={cx(styles.DateInput, className)}
      aria-describedby={describedBy}
      data-component="DateInput"
      data-invalid={error ? 'true' : undefined}
    >
      <legend className={styles.Legend}>
        {label}
        {required ? (
          <span className={styles.Required} aria-hidden="true">
            {' '}*
          </span>
        ) : null}
      </legend>
      {hint ? (
        <span id={hintId} className={styles.Hint}>
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
      <div className={styles.Parts}>
        {parts.map(({ key, max, auto }) => (
          <div key={key} className={styles.Part} data-part={key}>
            <label className={styles.PartLabel} htmlFor={`${id}-${key}`}>
              {partLabels[key]}
            </label>
            <input
              id={`${id}-${key}`}
              className={styles.Input}
              name={`${name}-${key}`}
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={max}
              autoComplete={birthday ? auto : 'off'}
              required={required}
              aria-invalid={error ? true : undefined}
              value={current[key]}
              onChange={update(key)}
            />
          </div>
        ))}
      </div>
    </fieldset>
  );
}
