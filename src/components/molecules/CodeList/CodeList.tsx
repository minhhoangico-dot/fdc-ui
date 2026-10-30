import { useId, useMemo, useRef, useState } from 'react';
import { cx } from '../../../utils/cx';
import { VisuallyHidden } from '../../atoms/VisuallyHidden';
import { Combobox, optionText, type ComboboxOption } from '../Combobox';
import { matchOptions, notFoundText } from '../Combobox/Combobox';
import styles from './CodeList.module.css';

export type CodeListProps = {
  /** The group question, read as the fieldset legend: "Bệnh, tật". */
  label: string;
  hint?: string;
  /** One message for the whole group, with one red bar. */
  error?: string;
  errorPrefix?: string;
  options: ComboboxOption[];
  /** Controlled list of chosen values, in the order they were added. */
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (values: string[]) => void;
  /** Label of the field that adds the next item. Default "Thêm bệnh, tật". */
  addLabel?: string;
  /** Text of each item's remove button; the item's name is added for screen readers. Default "Bỏ". */
  removeLabel?: string;
  /** Shown while nothing is chosen. Default "Chưa có mục nào." */
  emptyText?: string;
  /** id of the add field's input, so an ErrorSummary can link to it. */
  id?: string;
  className?: string;
};

/**
 * Several coded items for one question, such as every disease found at a check-up: "Tăng huyết áp (I10)",
 * "Đái tháo đường type 2 (E11)". Chosen items read name first, code after and lighter, each with "Bỏ".
 * A Combobox under the list adds the next one: it leaves out what is already chosen, empties itself after
 * each choice and keeps focus, ready for the next. Adding and removing are announced politely.
 * The doctor's own wording stays in a separate text field on the page.
 */
export function CodeList({
  label,
  hint,
  error,
  errorPrefix = 'Lỗi:',
  options,
  value,
  defaultValue = [],
  onValueChange,
  addLabel = 'Thêm bệnh, tật',
  removeLabel = 'Bỏ',
  emptyText = 'Chưa có mục nào.',
  id,
  className,
}: CodeListProps) {
  const autoId = useId();
  const baseId = `fdc-codelist-${autoId}`;
  const hintId = hint ? `${baseId}-hint` : undefined;
  const errorId = error ? `${baseId}-error` : undefined;
  const rootRef = useRef<HTMLFieldSetElement>(null);

  const [inner, setInner] = useState<string[]>(defaultValue);
  const chosen = value ?? inner;
  const [message, setMessage] = useState('');

  // A value missing from the options (e.g. an old code) still shows, so nothing is hidden from the doctor.
  const items = useMemo(
    () => chosen.map((v) => options.find((o) => o.value === v) ?? { value: v, label: v }),
    [chosen, options],
  );
  const remaining = useMemo(() => options.filter((o) => !chosen.includes(o.value)), [options, chosen]);

  const update = (next: string[]) => {
    if (value === undefined) setInner(next);
    onValueChange?.(next);
  };

  const add = (o: ComboboxOption | null) => {
    if (!o || chosen.includes(o.value)) return;
    update([...chosen, o.value]);
    setMessage(`Đã thêm ${optionText(o)}`);
  };

  // Typing something already chosen ("i10" with I10 in the list) finds nothing to add: say it is there,
  // so nobody is told the code does not exist.
  const noResultsText = (q: string) => {
    if (!q.trim() && items.length) return 'Mọi mục đã có trong danh sách.';
    const there = matchOptions(items, q, 3).map(optionText);
    if (!there.length) return notFoundText(q);
    return there.length === 1 ? `${there[0]} đã có trong danh sách.` : `Đã có trong danh sách: ${there.join('; ')}.`;
  };

  const remove = (o: ComboboxOption) => {
    update(chosen.filter((v) => v !== o.value));
    setMessage(`Đã bỏ ${optionText(o)}`);
    // The button goes away with its item; the add field is the next sensible place.
    rootRef.current?.querySelector<HTMLInputElement>('[role="combobox"]')?.focus();
  };

  return (
    <fieldset
      ref={rootRef}
      className={cx(styles.CodeList, className)}
      aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
      data-component="CodeList"
      data-invalid={error ? 'true' : undefined}
    >
      <legend className={styles.Legend} data-part="label">
        {label}
      </legend>
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
      {items.length ? (
        <ul className={styles.List} data-part="list">
          {items.map((o) => (
            <li key={o.value} className={styles.Item}>
              <span className={styles.Name}>
                {o.label}
                {o.code ? <span className={styles.Code}> ({o.code})</span> : null}
              </span>
              <button type="button" className={styles.Remove} onClick={() => remove(o)}>
                {removeLabel}
                <VisuallyHidden> {optionText(o)}</VisuallyHidden>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.Empty} data-part="empty">
          {emptyText}
        </p>
      )}
      {/* Always empty (value null): each choice moves into the list above. */}
      <Combobox
        className={styles.Add}
        label={addLabel}
        options={remaining}
        value={null}
        onValueChange={(_, o) => add(o)}
        noResultsText={noResultsText}
        id={id}
        // The group's error is the add field's error too: a link from an ErrorSummary lands here and reads it.
        aria-describedby={errorId}
        aria-invalid={error ? true : undefined}
      />
      <VisuallyHidden role="status">{message}</VisuallyHidden>
    </fieldset>
  );
}
