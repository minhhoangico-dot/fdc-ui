import { useId, useState } from 'react';
import { cx } from '../../../utils/cx';
import { VisuallyHidden } from '../../atoms/VisuallyHidden';
import styles from './TimeSlotPicker.module.css';

export type TimeSlot = {
  /** 24-hour "HH:mm", Hanoi time. */
  time: string;
  /** Already booked: shown, but cannot be chosen. */
  taken?: boolean;
};

export type TimeSlotPickerProps = {
  /** The question, e.g. "Chọn giờ khám, thứ Bảy 24/10". */
  label: string;
  slots: TimeSlot[];
  hint?: string;
  error?: string;
  errorPrefix?: string;
  /** Form field name. Default "time". */
  name?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (time: string) => void;
  /** Text on a taken slot. Default "Đã kín". */
  takenLabel?: string;
  /** Shown when no slot is free. */
  emptyText?: string;
  required?: boolean;
  /** id placed on the first free slot's radio, so an ErrorSummary can link to it. */
  id?: string;
  className?: string;
};

/**
 * Pick one appointment time from a day's slots. Native radios inside a fieldset:
 * arrow keys move between free times, taken times stay visible but disabled, with words not just color.
 * The chosen tile fills with the brand color: a large lightness change, not hue alone.
 */
export function TimeSlotPicker({
  label,
  slots,
  hint,
  error,
  errorPrefix = 'Lỗi:',
  name = 'time',
  value,
  defaultValue,
  onValueChange,
  takenLabel = 'Đã kín',
  emptyText = 'Ngày này đã kín lịch. Vui lòng chọn ngày khác hoặc gọi tổng đài.',
  required,
  id: firstSlotId,
  className,
}: TimeSlotPickerProps) {
  const id = useId();
  const [inner, setInner] = useState(defaultValue);
  const selected = value ?? inner;
  const free = slots.filter((s) => !s.taken);
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <fieldset
      className={cx(styles.TimeSlotPicker, className)}
      aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
      data-component="TimeSlotPicker"
      data-invalid={error ? 'true' : undefined}
    >
      <legend className={styles.Legend}>{label}</legend>
      {hint ? (
        <span id={hintId} className={styles.Hint}>
          {hint}
        </span>
      ) : null}
      {error ? (
        <span id={errorId} className={styles.Error} data-part="error">
          <span className={styles.Mark} aria-hidden="true" data-part="mark">
            !
          </span>
          <span className={styles.ErrorText}>
            <VisuallyHidden>{errorPrefix} </VisuallyHidden>
            {error}
          </span>
        </span>
      ) : null}
      {free.length === 0 ? (
        <p className={styles.Empty} role="status">
          {emptyText}
        </p>
      ) : null}
      <div className={styles.Grid}>
        {slots.map((slot) => {
          const isSelected = slot.time === selected;
          return (
            <label key={slot.time} className={styles.Slot} data-taken={slot.taken || undefined} data-selected={isSelected || undefined}>
              <input
                id={firstSlotId && slot === free[0] ? firstSlotId : undefined}
                className={styles.Radio}
                type="radio"
                name={name}
                value={slot.time}
                checked={isSelected}
                disabled={slot.taken}
                required={required}
                aria-invalid={error ? true : undefined}
                onChange={() => {
                  if (value === undefined) setInner(slot.time);
                  onValueChange?.(slot.time);
                }}
              />
              <span className={styles.Time}>{slot.time}</span>
              {slot.taken ? <span className={styles.Taken}>{takenLabel}</span> : null}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
