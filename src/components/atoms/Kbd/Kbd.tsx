import { forwardRef, Fragment, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../../utils/cx';
import styles from './Kbd.module.css';

export type KbdProps = {
  /** A key combination, e.g. ['Ctrl', 'S']: one key cap each, joined by the separator. */
  keys?: string[];
  /** Shown between keys. Default " + ". */
  separator?: string;
  /** A single key, when `keys` is not given. */
  children?: ReactNode;
} & HTMLAttributes<HTMLElement>;

/**
 * A keyboard key, for the shortcut hint shown where a shortcut works: "Ctrl + S lưu".
 * Staff tools use Ctrl combinations only: single-letter shortcuts fire by accident while typing Vietnamese (Telex).
 */
export const Kbd = forwardRef<HTMLElement, KbdProps>(function Kbd({ keys, separator = ' + ', className, children, ...rest }, ref) {
  if (keys?.length) {
    // HTML spec: a key combination is a <kbd> holding one <kbd> per key.
    return (
      <kbd ref={ref} {...rest} className={cx(styles.Combo, className)} data-component="Kbd">
        {keys.map((k, i) => (
          <Fragment key={`${k}-${i}`}>
            {i > 0 ? <span className={styles.Separator}>{separator}</span> : null}
            <kbd className={styles.Kbd}>{k}</kbd>
          </Fragment>
        ))}
      </kbd>
    );
  }
  return (
    <kbd ref={ref} {...rest} className={cx(styles.Kbd, className)} data-component="Kbd">
      {children}
    </kbd>
  );
});
Kbd.displayName = 'Kbd';
