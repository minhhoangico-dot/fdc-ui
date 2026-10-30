import { forwardRef, type AnchorHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../../utils/cx';
import { Icon } from '../Icon';
import styles from './TextLink.module.css';

export type TextLinkProps = {
  /** Default "Xem chi tiết". Prefer a specific label when the destination is not obvious. */
  children?: ReactNode;
  /**
   * The mark beside the words, hidden from screen readers so the link's name is only its words.
   * true (default) = the double chevron after them, for "Xem chi tiết »" at the end of a card or panel;
   * "back" = one chevron before them and "next" = one after them, for moving between the parts of a form
   * ("‹ 3. Tiền sử", "5. Lâm sàng ›"); false = none, for a plain link such as "Đăng xuất".
   */
  arrow?: boolean | 'back' | 'next';
} & AnchorHTMLAttributes<HTMLAnchorElement>;

/**
 * A text link: underlined `text-link` words at body size, a 44px tall target and the 3px focus ring.
 * Use it for every link that is not a button, so no link falls back to the browser's thin default ring.
 * For a main action use Button.
 */
export const TextLink = forwardRef<HTMLAnchorElement, TextLinkProps>(function TextLink(
  { children = 'Xem chi tiết', arrow = true, className, ...rest },
  ref,
) {
  const dir = arrow === 'back' || arrow === 'next' ? arrow : arrow ? 'more' : undefined;
  const mark = dir ? (
    <Icon name={dir === 'back' ? 'simple-left' : dir === 'next' ? 'simple-right' : 'double-right'} size={12} className={styles.Arrow} data-dir={dir} />
  ) : null;
  return (
    <a ref={ref} {...rest} className={cx(styles.TextLink, className)} data-component="TextLink">
      {dir === 'back' ? mark : null}
      <span>{children}</span>
      {dir === 'back' ? null : mark}
    </a>
  );
});
TextLink.displayName = 'TextLink';
