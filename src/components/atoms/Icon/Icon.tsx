import type { SVGAttributes } from 'react';
import { cx } from '../../../utils/cx';
import { ICONS, type IconName } from './icons';
import styles from './Icon.module.css';

export type IconProps = {
  name: IconName;
  /** Pixel size. Default 16; 12–16 inline with text, 24–40 in cards. */
  size?: number;
  /** Accessible name. Omit for decorative icons (hidden from screen readers). */
  title?: string;
} & Omit<SVGAttributes<SVGSVGElement>, 'name'>;

/** Single-ink glyph that takes the surrounding text color. Set color on the parent, never on the icon. */
export function Icon({ name, size = 16, title, className, ...rest }: IconProps) {
  const d = ICONS[name];
  if (!d) return null;
  return (
    <svg
      {...rest}
      className={cx(styles.Icon, className)}
      viewBox="0 0 1000 1000"
      width={size}
      height={size}
      fill="currentColor"
      focusable="false"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      <path d={d} />
    </svg>
  );
}
