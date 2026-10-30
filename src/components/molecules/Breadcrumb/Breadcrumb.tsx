import type { HTMLAttributes } from 'react';
import { cx } from '../../../utils/cx';
import styles from './Breadcrumb.module.css';

export type BreadcrumbItem = { label: string; href?: string };

export type BreadcrumbProps = {
  /** From the top level down; the last item is the current page and is not a link. */
  items: BreadcrumbItem[];
  /** aria-label of the nav. Default "Vị trí". */
  label?: string;
  /** Below 40rem show only the way back to the parent ("‹ Rạng Đông KSK 2026"), so a long trail does not take three lines on a phone. */
  collapseOnPhone?: boolean;
} & HTMLAttributes<HTMLElement>;

/** Where this page sits: "Việc của tôi › Rạng Đông KSK 2026 › Người 6/2.033". Staff tools only; public pages are shallow. */
export function Breadcrumb({ items, label = 'Vị trí', collapseOnPhone, className, ...rest }: BreadcrumbProps) {
  // The parent is the last item that is a link: on a collapsed phone trail it is the only one shown.
  const parent = items.reduce((p, item, i) => (item.href && i < items.length - 1 ? i : p), -1);
  return (
    <nav {...rest} aria-label={label} className={cx(styles.Breadcrumb, className)} data-component="Breadcrumb" data-collapse={collapseOnPhone || undefined}>
      <ol className={styles.List}>
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className={styles.Item} data-parent={i === parent || undefined}>
              {last || !item.href ? (
                <span className={styles.Current} aria-current={last ? 'page' : undefined}>
                  {item.label}
                </span>
              ) : (
                <a className={styles.Link} href={item.href}>
                  {item.label}
                </a>
              )}
              {/* The separator ends its item, so a wrapped line never starts with "›". */}
              {last ? null : (
                <span className={styles.Separator} aria-hidden="true">
                  ›
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
