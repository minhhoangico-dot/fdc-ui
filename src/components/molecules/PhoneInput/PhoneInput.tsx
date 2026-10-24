import { forwardRef, useState, type ChangeEvent, type FocusEvent } from 'react';
import { formatVnPhone, normalizeVnPhone } from '../../../utils/phone';
import { TextField, type TextFieldProps } from '../../atoms/TextField';

export type PhoneInputProps = {
  /** Default "Số điện thoại". */
  label?: string;
  /** Default "Ví dụ: 0912 345 678". */
  hint?: string;
  /** Called with the normalized digits (0912345678), or null while incomplete or invalid. */
  onPhoneChange?: (digits: string | null, raw: string) => void;
} & Omit<TextFieldProps, 'label' | 'type' | 'inputMode' | 'autoComplete'>;

/**
 * Phone field that accepts how people really type: spaces, dots, dashes, +84.
 * Tidies the number on blur (0912 345 678); validate with normalizeVnPhone().
 */
export const PhoneInput = forwardRef<HTMLInputElement | HTMLTextAreaElement, PhoneInputProps>(function PhoneInput(
  { label = 'Số điện thoại', hint = 'Ví dụ: 0912 345 678', onPhoneChange, value, defaultValue, onChange, onBlur, ...rest },
  ref,
) {
  const [inner, setInner] = useState(String(defaultValue ?? ''));
  const current = value !== undefined ? String(value) : inner;

  const set = (raw: string) => {
    if (value === undefined) setInner(raw);
    onPhoneChange?.(normalizeVnPhone(raw), raw);
  };

  return (
    <TextField
      ref={ref}
      {...rest}
      label={label}
      hint={hint}
      type="tel"
      inputMode="tel"
      autoComplete="tel"
      value={current}
      onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        set(e.target.value);
        onChange?.(e);
      }}
      onBlur={(e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const digits = normalizeVnPhone(e.target.value);
        if (digits) set(formatVnPhone(digits));
        onBlur?.(e);
      }}
    />
  );
});
PhoneInput.displayName = 'PhoneInput';
