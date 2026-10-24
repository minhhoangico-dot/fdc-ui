import type { ReactNode } from 'react';
import { cx } from '../../../utils/cx';
import styles from './ValueCard.module.css';

export type ValueCardProps = {
  /** "F – Family" */
  title: string;
  text?: string;
  children?: ReactNode;
  className?: string;
};

/** Bordered box for one brand value or promise. The title stays group blue in every theme. */
export function ValueCard({ title, text, children, className }: ValueCardProps) {
  return (
    <div className={cx(styles.ValueCard, className)} data-component="ValueCard">
      <p className={styles.Title}>{title}</p>
      <p className={styles.Text}>{children ?? text}</p>
    </div>
  );
}
