import type { HTMLAttributes } from 'react';
import { cx } from '../../../utils/cx';
import styles from './Breadcrumb.module.css';

export type BreadcrumbItem = { label: string; href?: string };

export type BreadcrumbProps = {
  /** From the top level down; the last item is the current page and is not a link. */
  items: BreadcrumbItem[];
  /** aria-label of the nav. Default "Vị trí". */
  label?: string;
} & HTMLAttributes<HTMLElement>;

/** Where this page sits: "Việc của tôi › Rạng Đông KSK 2026 › Người 6/2.033". Staff tools only; public pages are shallow. */
export function Breadcrumb({ items, label = 'Vị trí', className, ...rest }: BreadcrumbProps) {
  return (
    <nav {...rest} aria-label={label} className={cx(styles.Breadcrumb, className)} data-component="Breadcrumb">
      <ol className={styles.List}>
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className={styles.Item}>
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
