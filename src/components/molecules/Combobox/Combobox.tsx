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
  /** Shown when nothing matches, and read out in place of the count. */
  noResultsText?: (query: string) => string;
  /** Read after the result count changes, while something matches. */
  resultsText?: (count: number) => string;
  /** Text of the button that empties the field. Default "Xóa". */
  clearLabel?: string;
  required?: boolean;
  disabled?: boolean;
  /** id of the input, so an ErrorSummary can link to it. */
  id?: string;
  name?: string;
  /** More ids that describe the input, read after the hint and error: e.g. the error of the group the field adds to (CodeList). */
  'aria-describedby'?: string;
  /** Marks the input invalid without a message or red edge of its own, when the message belongs to the group around it (CodeList). */
  'aria-invalid'?: boolean;
  className?: string;
};

/** "Tăng huyết áp (I10)": how a chosen option reads in the field and in summaries. */
export const optionText = (o: ComboboxOption) => (o.code ? `${o.label} (${o.code})` : o.label);

/** The default message when nothing matches (or, with nothing typed, when there is nothing to choose). */
export const notFoundText = (q: string) => (q.trim() ? `Không tìm thấy “${q}”. Thử gõ tên khác hoặc mã.` : 'Không có mục nào để chọn.');

/** How well an option matches a folded query: 0 exact code, 1 code start, 2 name start, 3 word start, 4 anywhere; -1 no match. */
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

/** The options that match what was typed, best first, as the list shows them (tone marks and case ignored). */
export function matchOptions(options: ComboboxOption[], query: string, max = Infinity): ComboboxOption[] {
  const q = foldVi(query);
  return options
    .map((o, i) => ({ o, i, r: rank(o, q) }))
    .filter((x) => x.r >= 0)
    .sort((a, b) => a.r - b.r || a.i - b.i)
    .slice(0, max)
    .map((x) => x.o);
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
  noResultsText = notFoundText,
  resultsText = (n) => (n === 0 ? 'Không có kết quả' : `${n} kết quả`),
  clearLabel = 'Xóa',
  required,
  disabled,
  id,
  name,
  'aria-describedby': describedBy,
  'aria-invalid': ariaInvalid,
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

  const results = useMemo(() => matchOptions(options, query ?? '', maxResults), [options, query, maxResults]);

  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`);
    el?.scrollIntoView?.({ block: 'nearest' });
  }, [active, open]);

  // While focused the field shows its own full text. When the whole choice is selected (Tab) or the caret sits
  // after it (just chosen), scroll its end into view, so the code just chosen is what shows, not only the name.
  const revealCode = () => {
    const run = () => {
      const el = inputRef.current;
      if (!el || document.activeElement !== el || !selected?.code || el.value !== optionText(selected)) return;
      const end = el.value.length;
      if (el.selectionEnd === end && (el.selectionStart === 0 || el.selectionStart === end)) el.scrollLeft = el.scrollWidth;
    };
    // Two frames: the browser's own caret scroll after a new value comes first, then this one.
    if (typeof window.requestAnimationFrame === 'function') window.requestAnimationFrame(() => window.requestAnimationFrame(run));
    else run();
  };
  useEffect(revealCode, [selectedValue]); // eslint-disable-line react-hooks/exhaustive-deps

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
  // A chosen coded item is drawn over the input while it rests, so a long name is cut but its code never is:
  // "Tăng huyết áp v… (I10)". The input keeps the full text for screen readers, and shows it while focused.
  const coded = query === null && selected?.code ? selected : null;

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
            aria-describedby={[hintId, errorId, describedBy].filter(Boolean).join(' ') || undefined}
            aria-invalid={error || ariaInvalid ? true : undefined}
            aria-required={required || undefined}
            disabled={disabled}
            data-masked={coded ? '' : undefined}
            value={shown}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            onClick={() => (open ? setOpen(false) : openList())}
            onFocus={revealCode}
            onBlur={() => {
              setOpen(false);
              setQuery(null);
            }}
          />
          {coded ? (
            <span className={styles.Shown} aria-hidden="true" data-part="shown">
              <span className={styles.ShownName}>{coded.label}</span>
              <span className={styles.ShownCode}>{`\u00a0(${coded.code})`}</span>
            </span>
          ) : null}
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
        <VisuallyHidden role="status">
          {open && typed ? (results.length === 0 ? noResultsText(query ?? '') : resultsText(results.length)) : ''}
        </VisuallyHidden>
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
