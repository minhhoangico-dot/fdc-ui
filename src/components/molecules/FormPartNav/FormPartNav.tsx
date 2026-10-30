import { useId, useRef, useState, type KeyboardEvent } from 'react';
import { cx } from '../../../utils/cx';
import { Icon } from '../../atoms/Icon';
import styles from './FormPartNav.module.css';

export type FormPartNavItem = {
  /** The part's number and name: "4. Thể lực". */
  label: string;
  /** Where the part is. With `href` the item is a link and the browser follows it; leave it out for an in-page switch (a button). */
  href?: string;
  /** Called when the item is chosen, before the list closes. */
  onSelect?: () => void;
  /** Items still to fill: "còn 2". Leave it out with `done` to read "Đủ". */
  count?: string;
  /** Every item of the part is filled: the count is green and reads "Đủ". */
  done?: boolean;
  /** The part on screen now (`aria-current="step"`). */
  current?: boolean;
  /** A muted second line: "12 chỉ số từ HIS, 09:12". */
  sub?: string;
  /** Something to fix in this part, in words: "1 cần sửa". Red, and repeated on the phone toggle. */
  problem?: string;
};

export type FormPartNavProps = {
  /** The parts in order; mark one `current`. */
  items: FormPartNavItem[];
  /** Text of the phone toggle. Default: the current item's label and count, "4. Thể lực · còn 2". */
  toggleLabel?: string;
  className?: string;
};

const countOf = (item: FormPartNavItem) => item.count ?? (item.done ? 'Đủ' : undefined);

/** One line for the closed phone toggle, so a part to fix is never hidden behind it. */
function problemLine(items: FormPartNavItem[]) {
  const withProblem = items.filter((i) => i.problem);
  if (!withProblem.length) return undefined;
  if (withProblem.length > 1) return `${withProblem.length} phần cần sửa`;
  const [only] = withProblem;
  return only.current ? only.problem : `${only.label}: ${only.problem}`;
}

/**
 * The parts of a long staff form with what is left in each ("còn 2", "Đủ"). From 64rem up the list is always
 * shown (StaffLayout's side column); below that only a full-width toggle shows ("4. Thể lực · còn 2"), so the
 * form starts near the top of a phone screen, and it opens the list under itself.
 *
 * It renders a div, not a nav: StaffLayout's `aside` already is the `<nav>` landmark ("Các phần của phiếu").
 * Outside StaffLayout, put it in a labelled `<nav>`.
 *
 * Choosing an item closes the list. A link lets the browser move to its target; a button (no `href`) returns
 * focus to the toggle, which then names the new part. Escape closes the list too.
 */
export function FormPartNav({ items, toggleLabel, className }: FormPartNavProps) {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const listId = useId();
  const current = items.find((i) => i.current);
  const currentCount = current ? countOf(current) : undefined;
  const label = toggleLabel ?? (current ? `${current.label}${currentCount ? ` · ${currentCount}` : ''}` : 'Các phần của phiếu');
  const problem = problemLine(items);

  const choose = (item: FormPartNavItem) => {
    item.onSelect?.();
    setOpen(false);
    // A hidden button would drop focus to the page; the toggle is hidden from 64rem up, so this is a no-op there.
    if (!item.href) toggle.current?.focus();
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Escape' || !open) return;
    setOpen(false);
    toggle.current?.focus();
  };

  return (
    <div className={cx(styles.FormPartNav, className)} onKeyDown={onKeyDown} data-component="FormPartNav" data-open={open || undefined}>
      <button ref={toggle} type="button" className={styles.Toggle} aria-expanded={open} aria-controls={listId} onClick={() => setOpen((v) => !v)}>
        <span className={styles.ToggleText}>
          <span>{label}</span>{' '}
          {problem ? <span className={styles.Problem}>{problem}</span> : null}
        </span>
        <Icon name={open ? 'rounded-up' : 'rounded-down'} size={14} className={styles.Chevron} />
      </button>
      <ol id={listId} className={styles.List}>
        {items.map((item) => {
          const count = countOf(item);
          const content = (
            <>
              <span className={styles.Text}>
                <span className={styles.Label}>{item.label}</span>{' '}
                {item.sub ? <span className={styles.Sub}>{item.sub}</span> : null}{' '}
                {item.problem ? <span className={styles.Problem}>{item.problem}</span> : null}
              </span>{' '}
              {count ? (
                <span className={styles.Count} data-done={item.done || undefined}>
                  {item.done ? (
                    <span className={styles.Mark} aria-hidden="true">
                      ✓
                    </span>
                  ) : null}
                  {count}
                </span>
              ) : null}
            </>
          );
          const shared = {
            className: styles.Link,
            'aria-current': item.current ? ('step' as const) : undefined,
            'data-problem': item.problem ? 'true' : undefined,
            onClick: () => choose(item),
          };
          return (
            <li key={item.label}>
              {item.href ? (
                <a {...shared} href={item.href}>
                  {content}
                </a>
              ) : (
                <button {...shared} type="button">
                  {content}
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
