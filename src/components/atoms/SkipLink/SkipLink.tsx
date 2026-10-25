import type { AnchorHTMLAttributes } from 'react';
import { cx } from '../../../utils/cx';
import styles from './SkipLink.module.css';

export type SkipLinkProps = {
  /** id of the main content. Default "main". */
  targetId?: string;
  /** Default "Bỏ qua, đến nội dung chính". */
  label?: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>;

/** First focusable element on every page: lets keyboard and screen-reader users jump past the header. Visible only on focus. */
export function SkipLink({ targetId = 'main', label = 'Bỏ qua, đến nội dung chính', className, ...rest }: SkipLinkProps) {
  return (
    <a {...rest} href={`#${targetId}`} className={cx(styles.SkipLink, className)} data-component="SkipLink">
      {label}
    </a>
  );
}
