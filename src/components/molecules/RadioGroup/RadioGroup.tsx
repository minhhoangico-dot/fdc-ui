import { useId, useState, type ReactNode } from 'react';
import { cx } from '../../../utils/cx';
import { VisuallyHidden } from '../../atoms/VisuallyHidden';
import styles from './RadioGroup.module.css';

export type RadioOption = {
  value: string;
  label: string;
  /** Optional second line, e.g. what the service includes. */
  description?: ReactNode;
  disabled?: boolean;
};

export type RadioGroupProps = {
  /** The question, read as the group's legend: "Bạn đặt lịch cho ai?". */
  label: string;
  options: RadioOption[];
  name: string;
  hint?: string;
  error?: string;
  errorPrefix?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Make the legend the page heading on one-question pages. */
  legendAsHeading?: boolean;
  /** Hide the legend visually when the page heading already asks the question (still read by screen readers). */
  hideLegend?: boolean;
  required?: boolean;
  /** id put on the first option, so an ErrorSummary can link to it. */
  id?: string;
  /**
   * row = options side by side, sharing the width equally: for short answers such as Không / Có or Loại I–V.
   * The question then reads as a field label (body text), so a long list of questions stays calm.
   * wrap = options as wide as their words, flowing onto more lines: for list filters such as "Cần điền hoặc sửa · 15". Default column.
   */
  layout?: 'column' | 'row' | 'wrap';
  /** compact = less padding and gap, so five short options (I–V) fit a 360px phone; targets stay ≥ 44px. */
  density?: 'comfortable' | 'compact';
  /**
   * tiles = a bordered tile with a visible radio circle: for questions on a form ("Bạn đặt lịch cho ai?", Loại I–V).
   * pills = rounded pills without the circle: for list filters, so a filter never looks like a form question.
   * Use pills with layout "wrap". The radio stays in the page for the keyboard and screen readers; the checked
   * pill is marked by its fill, a heavier brand edge and bold text, not by color alone. Default tiles.
   */
  variant?: 'tiles' | 'pills';
  className?: string;
};

/**
 * One choice from a short list, as large tappable tiles built on native radios, or as pills for list filters.
 * Arrow keys move between options; the whole tile or pill is the hit area.
 */
export function RadioGroup({
  label,
  options,
  name,
  hint,
  error,
  errorPrefix = 'Lỗi:',
  value,
  defaultValue,
  onValueChange,
  legendAsHeading,
  hideLegend,
  required,
  id: firstId,
  layout = 'column',
  density = 'comfortable',
  variant = 'tiles',
  className,
}: RadioGroupProps) {
  const id = useId();
  const [inner, setInner] = useState(defaultValue);
  const selected = value ?? inner;
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <fieldset
      className={cx(styles.RadioGroup, className)}
      aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
      data-component="RadioGroup"
      data-invalid={error ? 'true' : undefined}
      data-layout={layout}
      data-density={density}
      data-variant={variant}
    >
      <legend className={hideLegend ? styles.LegendHidden : legendAsHeading ? styles.LegendHeading : styles.Legend}>
        {legendAsHeading ? <h1 className={styles.LegendH1}>{label}</h1> : label}
      </legend>
      {hint ? (
        <span id={hintId} className={styles.Hint}>
          {hint}
        </span>
      ) : null}
      {error ? (
        <span id={errorId} className={styles.Error}>
          <VisuallyHidden>{errorPrefix} </VisuallyHidden>
          {error}
        </span>
      ) : null}
      <div className={styles.Options}>
        {options.map((o, i) => {
          const optionId = i === 0 && firstId ? firstId : `${id}-${i}`;
          const descId = o.description ? `${optionId}-desc` : undefined;
          return (
            <div key={o.value} className={styles.Option} data-checked={selected === o.value || undefined} data-disabled={o.disabled || undefined}>
              <input
                id={optionId}
                className={styles.Input}
                type="radio"
                name={name}
                value={o.value}
                checked={selected === o.value}
                disabled={o.disabled}
                required={required}
                aria-describedby={descId}
                aria-invalid={error ? true : undefined}
                onChange={() => {
                  if (value === undefined) setInner(o.value);
                  onValueChange?.(o.value);
                }}
              />
              <div className={styles.Label}>
                <label htmlFor={optionId} className={styles.Text}>
                  {o.label}
                </label>
                {o.description ? (
                  <span id={descId} className={styles.Description}>
                    {o.description}
                  </span>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}
