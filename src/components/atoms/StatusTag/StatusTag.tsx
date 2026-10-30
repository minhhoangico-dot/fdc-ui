import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../../utils/cx';
import styles from './StatusTag.module.css';

export type StatusTagTone = 'neutral' | 'muted' | 'info' | 'success' | 'error' | 'attention' | 'strong';

/** Tones that carry a state get a leading dot; muted (a source) and strong (already solid) do not. */
const dotted: ReadonlySet<StatusTagTone> = new Set(['neutral', 'info', 'success', 'error', 'attention']);

export type StatusTagProps = {
  /**
   * Tinted fills, never a dark edge, so a tag never reads as a button.
   * - neutral (default): grey fill, a state with no color of its own ("Cần điền").
   * - muted: white with a light edge and muted words, for sources such as "Nhập tay"; no dot.
   * - info: pending work ("Chờ gửi · còn 27 giây"); never green for pending.
   * - success: done and confirmed ("Đã gửi").
   * - error: something must be fixed before going on ("Cần sửa", "Gửi lỗi").
   * - attention: a value outside the normal range ("Cao", "Thấp"): worth a look, not an input error.
   * - strong: brand fill, for the one state that matters most on a screen; no dot.
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
      {dotted.has(tone) ? <span className={styles.Dot} aria-hidden="true" data-part="dot" /> : null}
      {children}
    </span>
  );
});
StatusTag.displayName = 'StatusTag';
