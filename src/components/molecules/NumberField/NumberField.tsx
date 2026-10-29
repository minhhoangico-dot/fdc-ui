import { forwardRef, useState, type ChangeEvent, type FocusEvent } from 'react';
import { formatViNumber, parseViNumber } from '../../../utils/vi';
import { StatusTag } from '../../atoms/StatusTag';
import { TextField, type TextFieldProps } from '../../atoms/TextField';

export type NumberFieldProps = {
  /** The measurement, without the unit: "Cân nặng". The unit goes in `unit`. */
  label: string;
  /** Shown inside the box and read after the label: "kg", "lần/phút", "mmHg". */
  unit?: string;
  /** Lowest and highest value that can be typed at all; outside it is an error after leaving the field. */
  min?: number;
  max?: number;
  /** Digits allowed after the comma. Default 0 (whole numbers). */
  decimals?: number;
  /** Normal range: a value outside it gets a word tag ("Cao", "Thấp"), never color alone. It is not an error. */
  normalRange?: [number, number];
  highLabel?: string;
  lowLabel?: string;
  /** A typical value for the grey hint: "Chưa điền · ví dụ 78". */
  example?: string;
  /** Hint when the field is empty. Default "Chưa điền". */
  emptyLabel?: string;
  /** Controlled text, as typed ("52,5"). */
  value?: string;
  defaultValue?: string;
  /** Called on every change with the number (null when empty or not a number) and the text typed. */
  onValueChange?: (value: number | null, text: string) => void;
  /** An error from the page, e.g. a required field still empty after pressing "Xem lại". Wins over the field's own checks. */
  error?: string;
} & Omit<TextFieldProps, 'type' | 'value' | 'defaultValue' | 'error' | 'unit' | 'after' | 'multiline' | 'icon' | 'min' | 'max'>;

/**
 * A number with its unit, for measurements and results: "52,5 kg", "78 lần/phút".
 * Accepts a decimal comma or dot, checks the range when the user leaves the field (not while typing),
 * and flags values outside the normal range with a word. An empty field stays neutral: a grey hint, no red.
 */
export const NumberField = forwardRef<HTMLInputElement, NumberFieldProps>(function NumberField(
  {
    label,
    unit,
    min,
    max,
    decimals = 0,
    normalRange,
    highLabel = 'Cao',
    lowLabel = 'Thấp',
    example,
    emptyLabel = 'Chưa điền',
    value,
    defaultValue = '',
    onValueChange,
    error,
    hint,
    onChange,
    onBlur,
    ...rest
  },
  ref,
) {
  const [inner, setInner] = useState(defaultValue);
  const text = value ?? inner;
  const [checked, setChecked] = useState<string | undefined>(undefined);
  const number = parseViNumber(text);

  const unitText = unit ? ` ${unit}` : '';
  const rangeText =
    min !== undefined && max !== undefined
      ? `${label} từ ${formatViNumber(min, decimals)} đến ${formatViNumber(max, decimals)}${unitText}.`
      : undefined;

  const problem = (n: number | null): string | undefined => {
    if (n === null) return undefined;
    if (Number.isNaN(n)) return `Nhập một số${example ? `, ví dụ ${example}` : ''}.`;
    const places = (String(n).split('.')[1] ?? '').length;
    if (places > decimals) return decimals === 0 ? 'Nhập số nguyên, không có phần lẻ.' : `Nhập tối đa ${decimals} số sau dấu phẩy.`;
    if ((min !== undefined && n < min) || (max !== undefined && n > max)) return rangeText ?? 'Giá trị nằm ngoài khoảng cho phép.';
    return undefined;
  };

  // Show the field's own error only after the user left it; drop it as soon as the value becomes valid.
  const ownError = checked !== undefined && problem(number) ? checked : undefined;
  const flag =
    normalRange && number !== null && !Number.isNaN(number) && !problem(number)
      ? number > normalRange[1]
        ? highLabel
        : number < normalRange[0]
          ? lowLabel
          : undefined
      : undefined;
  const autoHint = hint ?? [text.trim() ? undefined : emptyLabel, example ? `ví dụ ${example}` : undefined].filter(Boolean).join(' · ');

  return (
    <TextField
      {...rest}
      ref={ref as React.Ref<HTMLInputElement>}
      label={label}
      unit={unit}
      type="text"
      inputMode={decimals > 0 ? 'decimal' : 'numeric'}
      autoComplete="off"
      hint={autoHint || undefined}
      error={error ?? ownError}
      value={text}
      after={
        flag ? (
          <StatusTag tone="error" size="sm">
            {flag}
          </StatusTag>
        ) : undefined
      }
      onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const next = e.target.value;
        if (value === undefined) setInner(next);
        const n = parseViNumber(next);
        if (checked !== undefined) setChecked(problem(n));
        onValueChange?.(n === null || Number.isNaN(n) ? null : n, next);
        onChange?.(e);
      }}
      onBlur={(e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const n = parseViNumber(e.target.value);
        const p = problem(n);
        setChecked(p);
        // Tidy a valid entry into the Vietnamese form: "52.5" becomes "52,5".
        if (!p && n !== null && value === undefined) setInner(formatViNumber(n, decimals));
        onBlur?.(e);
      }}
    />
  );
});
NumberField.displayName = 'NumberField';
