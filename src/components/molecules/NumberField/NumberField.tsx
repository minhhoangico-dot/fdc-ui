import { forwardRef, useRef, useState, type ChangeEvent, type FocusEvent } from 'react';
import { formatViNumber, parseViNumber } from '../../../utils/vi';
import { StatusTag } from '../../atoms/StatusTag';
import { TextField, type TextFieldProps, type TextFieldReserve } from '../../atoms/TextField';
import styles from './NumberField.module.css';

/** No-break space: keeps "ví dụ 78" together and the "·" on the line of the word before it. */
const NBSP = ' ';

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
  /**
   * Normal range: a value outside it gets a word tag in the message line above the box ("Cao · bình thường 60–100",
   * the range only when it fits), never color alone and never beside the box. It is not an error.
   */
  normalRange?: [number, number];
  highLabel?: string;
  lowLabel?: string;
  /**
   * A typical value. Empty: "Chưa điền · ví dụ 78". While typing: "ví dụ 78". Next to an error: in the error
   * ("Điền mạch, ví dụ 78"). Filled and left: nothing. The line keeps its room in every state.
   */
  example?: string;
  /** Hint when the field is empty. Default "Chưa điền". */
  emptyLabel?: string;
  /** Controlled text, as typed ("52,5"). */
  value?: string;
  defaultValue?: string;
  /** Called on every change with the number (null when empty or not a number) and the text typed. */
  onValueChange?: (value: number | null, text: string) => void;
  /**
   * An error from the page, e.g. a required field still empty after pressing "Xem lại". Wins over the field's own
   * checks and shows in the same line, with the example after it. Keep it short ("Điền mạch"): the line is one line wide.
   */
  error?: string;
  /** Fixed help text instead of the automatic "Chưa điền · ví dụ 78"; an error or a "Cao" tag takes its place. */
  hint?: string;
} & Omit<
  TextFieldProps,
  'type' | 'value' | 'defaultValue' | 'error' | 'hint' | 'reserve' | 'unit' | 'after' | 'multiline' | 'icon' | 'min' | 'max'
>;

/**
 * A number with its unit, for measurements and results: "52,5 kg", "78 lần/phút".
 * Accepts a decimal comma or dot, checks the range when the user leaves the field (not while typing),
 * and flags values outside the normal range with a word. An empty field stays neutral: a grey hint, no red.
 * Everything it says is in one message line above the box (hint, "Cao" tag, error), and that line keeps its room
 * whatever it shows, so nothing above or below the field moves while it is focused, typed into or left, and the box
 * always has its column's full width.
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
    onFocus,
    onBlur,
    ...rest
  },
  ref,
) {
  const [inner, setInner] = useState(defaultValue);
  const text = value ?? inner;
  const [checked, setChecked] = useState<string | undefined>(undefined);
  const [focused, setFocused] = useState(false);
  const number = parseViNumber(text);
  const fmt = (n: number) => formatViNumber(n, decimals);

  // Short messages, so each fits one line in a staff column (about 13rem): the unit is in the box, the label above.
  const exampleText = example ? `ví${NBSP}dụ${NBSP}${example}` : undefined;
  const emptyHint = exampleText ? `${emptyLabel}${NBSP}· ${exampleText}` : emptyLabel;
  const rangeError =
    min !== undefined && max !== undefined
      ? `Nhập từ${NBSP}${fmt(min)} đến${NBSP}${fmt(max)}`
      : min !== undefined
        ? `Nhập từ${NBSP}${fmt(min)} trở lên`
        : max !== undefined
          ? `Nhập tối đa${NBSP}${fmt(max)}`
          : undefined;
  const numberError = exampleText ? `Nhập số, ${exampleText}` : 'Nhập số';
  const decimalsError = decimals === 0 ? 'Nhập số nguyên' : `Chỉ ${decimals} số sau dấu phẩy`;
  /** The page's error, with the example after it unless it already has one: "Điền mạch, ví dụ 78". */
  const withExample = (message: string) =>
    exampleText && !/ví\sdụ/i.test(message) ? `${message.replace(/[.\s]+$/, '')}, ${exampleText}` : message;

  // The range first, then the decimals: "1,58" in a field for centimetres needs "Nhập từ 50 đến 250", not "Nhập số nguyên".
  const problem = (n: number | null): string | undefined => {
    if (n === null) return undefined;
    if (Number.isNaN(n)) return numberError;
    if ((min !== undefined && n < min) || (max !== undefined && n > max)) return rangeError;
    const places = (String(n).split('.')[1] ?? '').length;
    if (places > decimals) return decimalsError;
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
  const shownError = error ? withExample(error) : ownError;

  // The page's last error keeps its room after the page clears it, so clearing it moves nothing either.
  const lastPageError = useRef<string | undefined>(undefined);
  if (error) lastPageError.current = withExample(error);

  // Every text the line may show while the person works here; the line keeps the room of the tallest.
  const reserve: TextFieldReserve[] = [emptyHint];
  if (hint) reserve.push(hint);
  if (rangeError) reserve.push({ error: rangeError });
  reserve.push({ error: numberError }, { error: decimalsError });
  if (lastPageError.current) reserve.push({ error: lastPageError.current });

  // One line: the error (TextField puts it in this line), else the tag, else the screen's hint, else the automatic
  // hint: "Chưa điền · ví dụ 78" while empty, "ví dụ 78" while typing, nothing once filled and left.
  const message = flag ? (
    <span className={styles.Flag}>
      <StatusTag tone="attention" size="sm">
        {flag}
      </StatusTag>{' '}
      {normalRange ? (
        <span className={styles.Range}>
          · bình thường {fmt(normalRange[0])}–{fmt(normalRange[1])}
        </span>
      ) : null}
    </span>
  ) : (
    hint ?? (!text.trim() ? emptyHint : focused ? exampleText : undefined)
  );

  return (
    <TextField
      {...rest}
      ref={ref as React.Ref<HTMLInputElement>}
      label={label}
      unit={unit}
      type="text"
      inputMode={decimals > 0 ? 'decimal' : 'numeric'}
      autoComplete="off"
      hint={message}
      error={shownError}
      reserve={reserve}
      value={text}
      onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const next = e.target.value;
        if (value === undefined) setInner(next);
        const n = parseViNumber(next);
        if (checked !== undefined) setChecked(problem(n));
        onValueChange?.(n === null || Number.isNaN(n) ? null : n, next);
        onChange?.(e);
      }}
      onFocus={(e: FocusEvent<HTMLInputElement>) => {
        setFocused(true);
        onFocus?.(e);
      }}
      onBlur={(e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFocused(false);
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
