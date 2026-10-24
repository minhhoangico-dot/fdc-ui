import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../../utils/cx';
import styles from './Stack.module.css';

export type Space = 5 | 10 | 15 | 20 | 30 | 40 | 50;

export type StackProps = {
  /** Vertical gap, from the space-* tokens. Default 15. */
  gap?: Space;
  /** Cross-axis alignment. Default stretch. */
  align?: 'start' | 'center' | 'end' | 'stretch';
  as?: 'div' | 'section' | 'ul' | 'ol' | 'form' | 'fieldset';
} & HTMLAttributes<HTMLElement>;

/** Vertical layout: owns the spacing between children so components never need margins. */
export const Stack = forwardRef<HTMLElement, StackProps>(function Stack(
  { gap = 15, align = 'stretch', as: Tag = 'div', className, ...rest },
  ref,
) {
  return (
    <Tag
      ref={ref as never}
      {...rest}
      className={cx(styles.Stack, className)}
      data-gap={gap}
      data-align={align}
    />
  );
});
Stack.displayName = 'Stack';
