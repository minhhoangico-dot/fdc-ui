import { forwardRef, type AnchorHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../../utils/cx';
import { Icon } from '../Icon';
import styles from './TextLink.module.css';

export type TextLinkProps = {
  /** Default "Xem chi tiết". Prefer a specific label when the destination is not obvious. */
  children?: ReactNode;
  /** Show the double chevron. Default true. */
  arrow?: boolean;
} & AnchorHTMLAttributes<HTMLAnchorElement>;

/** The "Xem chi tiết »" link that ends cards and panels. For a main action use Button. */
export const TextLink = forwardRef<HTMLAnchorElement, TextLinkProps>(function TextLink(
  { children = 'Xem chi tiết', arrow = true, className, ...rest },
  ref,
) {
  return (
    <a ref={ref} {...rest} className={cx(styles.TextLink, className)} data-component="TextLink">
      <span>{children}</span>
      {arrow ? <Icon name="double-right" size={12} className={styles.Arrow} /> : null}
    </a>
  );
});
TextLink.displayName = 'TextLink';
