import { cx } from '../../../utils/cx';
import { Avatar } from '../../atoms/Avatar';
import styles from './TestimonialCard.module.css';

export type TestimonialCardProps = {
  /** Real words, unedited, short. */
  quote: string;
  name: string;
  role?: string;
  /** Photo URL, only with written consent; initials otherwise. */
  photo?: string;
  /** Default 120. */
  avatarSize?: number;
  className?: string;
};

/** A quote from a resident, family member or patient with a ringed avatar. */
export function TestimonialCard({ quote, name, role, photo, avatarSize = 120, className }: TestimonialCardProps) {
  return (
    <figure className={cx(styles.TestimonialCard, className)} data-component="TestimonialCard">
      <Avatar src={photo} name={name} size={avatarSize} ring />
      <blockquote className={styles.Quote}>{quote}</blockquote>
      <figcaption className={styles.Name}>
        {name}
        {role ? <span className={styles.Role}>{role}</span> : null}
      </figcaption>
    </figure>
  );
}
