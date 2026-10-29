import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../../utils/cx';
import styles from './FieldRow.module.css';

export type FieldRowProps = {
  /** Narrowest a column may get before fields wrap onto the next line. Default "15rem". */
  minColumn?: string;
} & HTMLAttributes<HTMLDivElement>;

/**
 * Fields side by side in a form (Họ và tên · Ngày sinh · Số điện thoại). Labels line up with labels and
 * inputs with inputs, even when only some fields have a hint or an error. Wraps to one column on phones.
 */
export const FieldRow = forwardRef<HTMLDivElement, FieldRowProps>(function FieldRow({ minColumn, className, style, ...rest }, ref) {
  return (
    <div
      ref={ref}
      {...rest}
      className={cx(styles.FieldRow, className)}
      style={minColumn ? { ...style, ['--field-min' as string]: minColumn } : style}
      data-component="FieldRow"
    />
  );
});
FieldRow.displayName = 'FieldRow';
