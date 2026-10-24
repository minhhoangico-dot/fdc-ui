import { cx } from '../../../utils/cx';
import { Icon } from '../../atoms/Icon';
import type { IconName } from '../../atoms/Icon';
import styles from './ServiceCard.module.css';

export type ServiceCardProps = {
  title: string;
  /** About 30 words; clamps at four lines. */
  excerpt?: string;
  /** Illustration URL (Claude Design › Assets › Services). Decorative. */
  image?: string;
  /** Used when there is no image. */
  icon?: IconName;
  /** Makes the whole card a link. */
  href?: string;
  /** Bottom link text; false hides it. Default "Xem chi tiết". */
  moreLabel?: string | false;
  headingLevel?: 2 | 3 | 4;
  className?: string;
};

/** Centered card for one service line: illustration, title, excerpt, optional link. */
export function ServiceCard({ title, excerpt, image, icon, href, moreLabel = 'Xem chi tiết', headingLevel = 3, className }: ServiceCardProps) {
  const Tag = href ? 'a' : 'div';
  const Heading = `h${headingLevel}` as 'h3';
  return (
    <Tag className={cx(styles.ServiceCard, className)} href={href} data-component="ServiceCard" data-link={href ? 'true' : undefined}>
      {image ? (
        <img className={styles.Image} src={image} alt="" width={66} height={66} />
      ) : icon ? (
        <span className={styles.IconBox}>
          <Icon name={icon} size={40} />
        </span>
      ) : null}
      <Heading className={styles.Title}>{title}</Heading>
      {excerpt ? <p className={styles.Excerpt}>{excerpt}</p> : null}
      {href && moreLabel !== false ? (
        <span className={styles.More}>
          {moreLabel}
          <Icon name="double-right" size={12} />
        </span>
      ) : null}
    </Tag>
  );
}
