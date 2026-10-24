import { cx } from '../../../utils/cx';
import { Icon } from '../../atoms/Icon';
import styles from './NewsCard.module.css';

export type NewsCardProps = {
  title: string;
  excerpt?: string;
  image?: string;
  /** Pre-formatted dd/mm/yyyy, e.g. "12/10/2026". */
  date?: string;
  href?: string;
  headingLevel?: 2 | 3 | 4;
  className?: string;
};

/** Article teaser: image, date, title, excerpt. The image takes the leaf corner in the nursing-home theme. */
export function NewsCard({ title, excerpt, image, date, href, headingLevel = 3, className }: NewsCardProps) {
  const Tag = href ? 'a' : 'div';
  const Heading = `h${headingLevel}` as 'h3';
  return (
    <Tag className={cx(styles.NewsCard, className)} href={href} data-component="NewsCard" data-link={href ? 'true' : undefined}>
      <div className={styles.Media}>
        {image ? (
          <img src={image} alt="" loading="lazy" />
        ) : (
          <span className={styles.Placeholder}>
            <Icon name="comment" size={36} />
          </span>
        )}
      </div>
      {date ? <span className={styles.Date}>{date}</span> : null}
      <Heading className={styles.Title}>{title}</Heading>
      {excerpt ? <p className={styles.Excerpt}>{excerpt}</p> : null}
    </Tag>
  );
}
