import { forwardRef, useId, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type MouseEvent, type ReactNode } from 'react';
import { cx } from '../../../utils/cx';
import { Icon } from '../Icon';
import type { IconName } from '../Icon';
import styles from './Button.module.css';

export type ButtonProps = {
  /**
   * neutral = secondary: white with a brand edge, so it never looks unavailable (default);
   * primary = brand fill, one per screen state; hotline = pink, only for calling the hotline.
   */
  variant?: 'neutral' | 'primary' | 'hotline';
  /** Renders a link that looks like a button (for example href="tel:02435430430"). */
  href?: string;
  /** A glyph beside the label. */
  icon?: IconName;
  /**
   * Where the icon sits. Default "start". Use "end" for "next" and "forward" actions, so the arrow points the way it
   * goes and sits where the eye ends: "Người sau ›", like "5. Lâm sàng ›" and "Sau ›" elsewhere.
   */
  iconPosition?: 'start' | 'end';
  /** Full width (recommended on phones for the main action). */
  block?: boolean;
  /** Shows a busy state and blocks repeat clicks while a request runs. */
  loading?: boolean;
  /** Label read during loading. Default "Đang xử lý…". */
  loadingLabel?: string;
  /**
   * Why the button cannot be used yet, shown right next to it ("Chọn một dòng ở trên trước.").
   * Setting it makes the button unavailable but still reachable with Tab, so screen readers read the reason;
   * clicks do nothing. Prefer it to a bare `disabled`: an unavailable button always says why.
   */
  disabledReason?: string;
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

/** The action button: 48px tall, sentence-case label. Write labels verb first: "Đặt lịch khám". */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'neutral',
    href,
    icon,
    iconPosition = 'start',
    block,
    loading,
    loadingLabel = 'Đang xử lý…',
    disabledReason,
    type = 'button',
    disabled,
    className,
    children,
    onClick,
    ...rest
  },
  ref,
) {
  const reasonId = useId();
  const classes = cx(styles.Button, className);
  const glyph = icon ? <Icon name={icon} size={18} /> : null;
  const content = (
    <>
      {iconPosition === 'start' ? glyph : null}
      <span>{loading ? loadingLabel : children}</span>
      {iconPosition === 'end' ? glyph : null}
    </>
  );
  if (href && !disabled && !disabledReason) {
    // The link keeps the attributes a caller sets (aria-label, id, title, data-*): a link that looks like a button
    // still needs its full accessible name, e.g. aria-label="Người sau: Đặng Thanh Chi".
    const anchorRest = rest as AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a
        {...anchorRest}
        className={classes}
        href={href}
        data-component="Button"
        data-variant={variant}
        data-block={block || undefined}
        onClick={onClick as unknown as (e: MouseEvent<HTMLAnchorElement>) => void}
      >
        {content}
      </a>
    );
  }
  if (disabledReason) {
    // aria-disabled instead of disabled: the button stays in the Tab order and announces its reason.
    const describedBy = [rest['aria-describedby'], reasonId].filter(Boolean).join(' ');
    return (
      <span className={styles.WithReason} data-block={block || undefined}>
        <button
          ref={ref}
          type={type}
          {...rest}
          className={classes}
          aria-disabled="true"
          aria-describedby={describedBy}
          onClick={(e) => e.preventDefault()}
          data-component="Button"
          data-variant={variant}
          data-block={block || undefined}
        >
          {content}
        </button>
        <span id={reasonId} className={styles.Reason}>
          {disabledReason}
        </span>
      </span>
    );
  }
  return (
    <button
      ref={ref}
      type={type}
      {...rest}
      className={classes}
      disabled={disabled}
      aria-busy={loading || undefined}
      onClick={loading ? (e) => e.preventDefault() : onClick}
      data-component="Button"
      data-variant={variant}
      data-block={block || undefined}
    >
      {content}
    </button>
  );
});
Button.displayName = 'Button';
