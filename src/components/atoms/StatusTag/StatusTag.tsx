import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../../utils/cx';
import styles from './StatusTag.module.css';

export type StatusTagTone =
  | 'neutral'
  | 'muted'
  | 'info'
  | 'success'
  | 'error'
  | 'attention'
  /** @deprecated Since 2.4: no screen used it, and in the nursing-home theme it looked like the orange primary button. Shown as neutral; removed in 3.0. */
  | 'strong';

/** Tones that carry a state get a leading dot; muted (a source, not a state) does not. */
const dotted: ReadonlySet<StatusTagTone> = new Set(['neutral', 'info', 'success', 'error', 'attention']);

export type StatusTagProps = {
  /**
   * Tinted fills with no edge, so a tag never reads as a button. No tag is solid.
   * - neutral (default): grey fill, a state with no color of its own ("Cần điền", "Sẵn sàng xem lại").
   * - muted: the same pale grey fill with muted words and no dot, the quietest tag: a source rather than a state
   *   ("Nhập tay"), or a record nothing has been typed into yet ("Chưa điền").
   * - info: pending work ("Chờ gửi", "Đang gửi"); never green for pending.
   * - success: done and confirmed by the other side ("Sở đã tiếp nhận", "Bộ đã xác nhận").
   * - error: something must be fixed before going on ("Cần sửa", "Bị từ chối").
   * - attention: worth a look, not an input error: a value outside the normal range ("Cao", "Thấp") or an
   *   outcome not known yet ("Chưa rõ kết quả").
   * - strong: deprecated, shown as neutral.
   */
  tone?: StatusTagTone;
  /** sm sits next to a value in tables and summaries; md (default) stands alone. */
  size?: 'sm' | 'md';
  /** Always words: the tag must make sense without its color. */
  children: ReactNode;
} & HTMLAttributes<HTMLSpanElement>;

/**
 * A rounded status label for staff tools: "Cao", "Nhập tay", "Chờ gửi", "Sở đã tiếp nhận".
 * It is text, not a control; when the state needs an action, put a Button next to it.
 */
export const StatusTag = forwardRef<HTMLSpanElement, StatusTagProps>(function StatusTag(
  { tone = 'neutral', size = 'md', className, children, ...rest },
  ref,
) {
  const shown: StatusTagTone = tone === 'strong' ? 'neutral' : tone;
  return (
    <span ref={ref} {...rest} className={cx(styles.StatusTag, className)} data-component="StatusTag" data-tone={shown} data-size={size}>
      {dotted.has(shown) ? <span className={styles.Dot} aria-hidden="true" data-part="dot" /> : null}
      {children}
    </span>
  );
});
StatusTag.displayName = 'StatusTag';
