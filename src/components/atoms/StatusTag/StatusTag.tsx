import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../../utils/cx';
import styles from './StatusTag.module.css';

export type StatusTagTone = 'neutral' | 'muted' | 'info' | 'strong' | 'success' | 'error';

export type StatusTagProps = {
  /**
   * neutral = outlined (default); muted = grey, for sources like "Nhập tay"; info = pending work ("Chờ gửi");
   * strong = brand fill, for the one state that matters most; success = done ("Đã gửi"); error = needs attention ("Cao", "Thấp").
   */
  tone?: StatusTagTone;
  /** sm sits next to a value in tables and summaries; md (default) stands alone. */
  size?: 'sm' | 'md';
  /** Always words: the tag must make sense without its color. */
  children: ReactNode;
} & HTMLAttributes<HTMLSpanElement>;

/**
 * A rounded status label for staff tools: "Cao", "Nhập tay", "Chờ gửi", "Đã gửi".
 * It is text, not a control; when the state needs an action, put a Button next to it.
 */
export const StatusTag = forwardRef<HTMLSpanElement, StatusTagProps>(function StatusTag(
  { tone = 'neutral', size = 'md', className, children, ...rest },
  ref,
) {
  return (
    <span ref={ref} {...rest} className={cx(styles.StatusTag, className)} data-component="StatusTag" data-tone={tone} data-size={size}>
      {children}
    </span>
  );
});
StatusTag.displayName = 'StatusTag';
