import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../../../utils/cx';
import { foldVi } from '../../../utils/vi';
import { Icon } from '../../atoms/Icon';
import { VisuallyHidden } from '../../atoms/VisuallyHidden';
import styles from './Combobox.module.css';

export type ComboboxOption = {
  value: string;
  /** The name people know: "Tăng huyết áp". */
  label: string;
  /** The code, shown after the name in brackets and lighter: "I10". Never shown alone. */
  code?: string;
  /** A second line, e.g. the group it belongs to. */
  hint?: string;
  /** Other words that should find it: "cao huyet ap, THA". */
  keywords?: string;
};

export type ComboboxProps = {
  /** Visible label. */
  label: string;
  hideLabel?: boolean;
  /** Help under the label. Default says what can be typed: "Gõ tên hoặc mã, có dấu hay không dấu đều được." */
  hint?: string;
  error?: string;
  errorPrefix?: string;
  options: ComboboxOption[];
  /** Controlled value (an option's value); null = nothing chosen. */
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null, option: ComboboxOption | null) => void;
  /** Most options shown at once; staff refine by typing. Default 50. */
  maxResults?: number;
  /** Shown when nothing matches. */
  noResultsText?: (query: string) => string;
  /** Read after the result count changes. */
  resultsText?: (count: number) => string;
  /** Text of the button that empties the field. Default "Xóa". */
  clearLabel?: string;
  required?: boolean;
  disabled?: boolean;
  /** id of the input, so an ErrorSummary can link to it. */
  id?: string;
  name?: string;
  className?: string;
};

/** "Tăng huyết áp (I10)": how a chosen option reads in the field and in summaries. */
export const optionText = (o: ComboboxOption) => (o.code ? `${o.label} (${o.code})` : o.label);

function rank(o: ComboboxOption, q: string): number {
  if (!q) return 1;
  const code = o.code ? foldVi(o.code) : '';
  const label = foldVi(o.label);
  if (code && code === q) return 0;
  if (code && code.startsWith(q)) return 1;
  if (label.startsWith(q)) return 2;
  if (label.split(' ').some((w) => w.startsWith(q))) return 3;
  if (label.includes(q) || foldVi(o.keywords ?? '').includes(q)) return 4;
  return -1;
}

/**
 * Choose one coded item by typing part of its name or its code: diagnoses (ICD-10), occupations, wards.
 * Typing without tone marks works ("tang huyet ap" finds "Tăng huyết áp"). The field only accepts an item
 * from the list; leaving it without choosing puts back the previous choice. Follows the ARIA 1.2 combobox pattern.
 */
export function Combobox({
  label,
  hideLabel,
  hint = 'Gõ tên hoặc mã, có dấu hay không dấu đều được.',
  error,
  errorPrefix = 'Lỗi:',
  options,
  value,
  defaultValue = null,
  onValueChange,
  maxResults = 50,
  noResultsText = (q) => `Không tìm thấy “${q}”. Thử gõ tên khác hoặc mã.`,
  resultsText = (n) => (n === 0 ? 'Không có kết quả' : `${n} kết quả`),
  clearLabel = 'Xóa',
  required,
  disabled,
  id,
  name,
  className,
}: ComboboxProps) {
  const autoId = useId();
  const inputId = id ?? `fdc-combobox-${autoId}`;
  const listId = `${inputId}-list`;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;

  const [inner, setInner] = useState<string | null>(defaultValue);
  const selectedValue = value !== undefined ? value : inner;
  const selected = options.find((o) => o.value === selectedValue) ?? null;

  const [query, setQuery] = useState<string | null>(null); // null = not typing; the field shows the choice
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const results = useMemo(() => {
    const q = foldVi(query ?? '');
    return options
      .map((o, i) => ({ o, i, r: rank(o, q) }))
      .filter((x) => x.r >= 0)
      .sort((a, b) => a.r - b.r || a.i - b.i)
      .slice(0, maxResults)
      .map((x) => x.o);
  }, [options, query, maxResults]);

  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`);
    el?.scrollIntoView?.({ block: 'nearest' });
  }, [active, open]);

  const choose = (o: ComboboxOption | null) => {
    if (value === undefined) setInner(o ? o.value : null);
    onValueChange?.(o ? o.value : null, o);
    setQuery(null);
    setOpen(false);
  };

  const openList = (startAt?: number) => {
    setOpen(true);
    const current = selected ? results.findIndex((o) => o.value === selected.value) : -1;
    setActive(startAt ?? (current >= 0 ? current : 0));
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!open) openList();
        else setActive((a) => Math.min(a + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (!open) openList();
        else setActive((a) => Math.max(a - 1, 0));
        break;
      case 'Enter':
        if (open && results[active]) {
          e.preventDefault();
          choose(results[active]);
        }
        break;
      case 'Escape':
        if (open) {
          e.preventDefault();
          setOpen(false);
          setQuery(null);
        }
        break;
      case 'Tab':
        // Tab never chooses for the user: it leaves and keeps the previous choice.
        setOpen(false);
        setQuery(null);
        break;
    }
  };

  const shown = query ?? (selected ? optionText(selected) : '');
  const activeId = open && results[active] ? `${listId}-${active}` : undefined;
  const typed = query !== null && query.trim() !== '';

  return (
    <div className={cx(styles.Combobox, className)} data-component="Combobox" data-invalid={error ? 'true' : undefined}>
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
          <Icon name="search-1" size={18} className={styles.Icon} />
          <input
            ref={inputRef}
            id={inputId}
            name={name}
            className={styles.Input}
            type="text"
            role="combobox"
            autoComplete="off"
            spellCheck={false}
            aria-autocomplete="list"
            aria-expanded={open && results.length > 0}
            aria-controls={listId}
            aria-activedescendant={activeId}
            aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
            aria-invalid={error ? true : undefined}
            aria-required={required || undefined}
            disabled={disabled}
            value={shown}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            onClick={() => (open ? setOpen(false) : openList())}
            onBlur={() => {
              setOpen(false);
              setQuery(null);
            }}
          />
          <Icon name={open ? 'rounded-up' : 'rounded-down'} size={14} className={styles.Chevron} />
        </div>
        {selected && !required && !disabled ? (
          <button
            type="button"
            className={styles.Clear}
            onClick={() => {
              choose(null);
              inputRef.current?.focus();
            }}
          >
            {clearLabel}
            <VisuallyHidden> {label}</VisuallyHidden>
          </button>
        ) : null}
        <ul ref={listRef} id={listId} role="listbox" aria-label={label} className={styles.List} hidden={!open || results.length === 0}>
          {results.map((o, i) => (
            <li
              key={o.value}
              id={`${listId}-${i}`}
              data-index={i}
              role="option"
              aria-selected={selected?.value === o.value}
              data-active={i === active || undefined}
              className={styles.Option}
              // Keep focus in the input so the list stays a single tab stop.
              onMouseDown={(e) => e.preventDefault()}
              onMouseMove={() => setActive(i)}
              onClick={() => choose(o)}
            >
              <OptionLabel option={o} />
            </li>
          ))}
        </ul>
        {open && results.length === 0 ? <div className={styles.Empty}>{noResultsText(query ?? '')}</div> : null}
        <VisuallyHidden role="status">{open && typed ? resultsText(results.length) : ''}</VisuallyHidden>
      </div>
    </div>
  );
}

function OptionLabel({ option }: { option: ComboboxOption }): ReactNode {
  return (
    <span className={styles.OptionText}>
      <span>
        {option.label}
        {option.code ? <span className={styles.Code}> ({option.code})</span> : null}
      </span>
      {option.hint ? <span className={styles.OptionHint}>{option.hint}</span> : null}
    </span>
  );
}
