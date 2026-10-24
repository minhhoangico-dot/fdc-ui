import type { HTMLAttributes } from 'react';
import { cx } from '../../../utils/cx';
import styles from './VisuallyHidden.module.css';

/** Text for screen readers only, such as the "Lỗi:" prefix before an error message. */
export function VisuallyHidden({ className, ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return <span {...rest} className={cx(styles.VisuallyHidden, className)} />;
}
