import { forwardRef, useRef, useState, type ChangeEvent, type FocusEvent } from 'react';
import { formatViNumber, parseViNumber } from '../../../utils/vi';
import { StatusTag } from '../../atoms/StatusTag';
import { TextField, type TextFieldProps, type TextFieldReserve } from '../../atoms/TextField';
import styles from './NumberField.module.css';

/** No-break space: keeps "ví dụ 78" and "Từ 50 đến 300" in whole chunks. */
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
   * A typical value, shown as "ví dụ 78" while the field has focus (empty or typing). Empty and not focused, the line
   * says "Chưa điền"; filled and left, nothing. The line keeps its room in every state.
   */
  example?: string;
  /** Hint when the field is empty and not focused. Default "Chưa điền". Keep it to a word or two (one line). */
  emptyLabel?: string;
  /** Controlled text, as typed ("52,5"). */
  value?: string;
  defaultValue?: string;
  /** Called on every change with the number (null when empty or not a number) and the text typed. */
  onValueChange?: (value: number | null, text: string) => void;
  /**
   * An error from the page, e.g. a required field still empty after pressing "Xem lại". Wins over the field's own
   * checks and shows in the same line, as given. Keep it short ("Điền mạch", "Điền tâm thu"): the line is one line
   * in a 9rem column; the error summary can keep its own short name. Pass an "Điền …" only while the field is empty:
   * once something is typed, the line shows the field's own message ("Cao" tag, range error) even if the page keeps
   * its summary until the next press. The line keeps the room of the last page error, so dropping it moves nothing.
   */
  error?: string;
  /** Fixed help text instead of the automatic "Chưa điền" / "ví dụ 78"; an error or a "Cao" tag takes its place. */
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
 * always has its column's full width. Every text it writes itself fits one line of a 9rem (144px) column.
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

  // Short messages, so each fits one line of a 9rem staff column (144px) with the error sign: the unit is in the box,
  // the label above. Measured at 16px, bold with the sign: "Từ 50 đến 300" 141px, "Chỉ số nguyên" 135px,
  // "Chỉ nhập số" 118px, "Chỉ 1 số lẻ" 102px; hints "Chưa điền" 79px, "ví dụ 52,5" 77px.
  const exampleText = example ? `ví${NBSP}dụ${NBSP}${example}` : undefined;
  const rangeError =
    min !== undefined && max !== undefined
      ? `Từ${NBSP}${fmt(min)} đến${NBSP}${fmt(max)}`
      : min !== undefined
        ? `Từ${NBSP}${fmt(min)} trở lên`
        : max !== undefined
          ? `Tối đa${NBSP}${fmt(max)}`
          : undefined;
  const numberError = 'Chỉ nhập số';
  const decimalsError = decimals === 0 ? 'Chỉ số nguyên' : `Chỉ ${decimals} số lẻ`;

  // The range first, then the decimals: "1,58" in a field for centimetres needs "Từ 50 đến 250", not "Chỉ số nguyên".
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
  const shownError = error ?? ownError;

  // The page's last error keeps its room after the page clears it, so clearing it moves nothing either.
  const lastPageError = useRef<string | undefined>(undefined);
  if (error) lastPageError.current = error;

  // Every text the line may show while the person works here; the line keeps the room of the tallest.
  const reserve: TextFieldReserve[] = [emptyLabel];
  if (exampleText) reserve.push(exampleText);
  if (hint) reserve.push(hint);
  if (rangeError) reserve.push({ error: rangeError });
  reserve.push({ error: numberError }, { error: decimalsError });
  if (lastPageError.current) reserve.push({ error: lastPageError.current });

  // One line: the error (TextField puts it in this line), else the tag, else the screen's hint, else the automatic
  // hint: "ví dụ 78" while the field has focus (the moment it helps), "Chưa điền" while empty and not focused,
  // nothing once filled and left. Each is short, so the line is one line in a 9rem column (both on a phone).
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
    hint ?? (focused && exampleText ? exampleText : !text.trim() ? emptyLabel : undefined)
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
