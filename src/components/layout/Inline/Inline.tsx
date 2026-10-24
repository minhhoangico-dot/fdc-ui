import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../../utils/cx';
import type { Space } from '../Stack/Stack';
import styles from './Inline.module.css';

export type InlineProps = {
  /** Gap between items, from the space-* tokens. Default 10. */
  gap?: Space;
  align?: 'start' | 'center' | 'end' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'between';
  /** Wrap onto new lines on narrow screens. Default true. */
  wrap?: boolean;
  as?: 'div' | 'ul' | 'nav';
} & HTMLAttributes<HTMLElement>;

/** Horizontal layout that wraps on narrow screens; owns the gap between items. */
export const Inline = forwardRef<HTMLElement, InlineProps>(function Inline(
  { gap = 10, align = 'center', justify = 'start', wrap = true, as: Tag = 'div', className, ...rest },
  ref,
) {
  return (
    <Tag
      ref={ref as never}
      {...rest}
      className={cx(styles.Inline, className)}
      data-gap={gap}
      data-align={align}
      data-justify={justify}
      data-wrap={wrap ? 'true' : 'false'}
    />
  );
});
Inline.displayName = 'Inline';
