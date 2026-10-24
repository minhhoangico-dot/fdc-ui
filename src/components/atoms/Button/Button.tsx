import { forwardRef, type ButtonHTMLAttributes, type MouseEvent, type ReactNode } from 'react';
import { cx } from '../../../utils/cx';
import { Icon } from '../Icon';
import type { IconName } from '../Icon';
import styles from './Button.module.css';

export type ButtonProps = {
  /** neutral = grey; primary = brand (one per view); hotline = pink, only for calling the hotline. Default neutral. */
  variant?: 'neutral' | 'primary' | 'hotline';
  /** Renders a link that looks like a button (for example href="tel:02435430430"). */
  href?: string;
  /** Leading icon. */
  icon?: IconName;
  /** Full width (recommended on phones for the main action). */
  block?: boolean;
  /** Shows a busy state and blocks repeat clicks while a request runs. */
  loading?: boolean;
  /** Label read during loading. Default "Đang xử lý…". */
  loadingLabel?: string;
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

/** The action button: 48px tall, sentence-case label. Write labels verb first: "Đặt lịch khám". */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'neutral',
    href,
    icon,
    block,
    loading,
    loadingLabel = 'Đang xử lý…',
    type = 'button',
    disabled,
    className,
    children,
    onClick,
    ...rest
  },
  ref,
) {
  const classes = cx(styles.Button, className);
  const content = (
    <>
      {icon ? <Icon name={icon} size={18} /> : null}
      <span>{loading ? loadingLabel : children}</span>
    </>
  );
  if (href && !disabled) {
    return (
      <a
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
