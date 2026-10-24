import { cx } from '../../../utils/cx';
import { Icon } from '../../atoms/Icon';
import type { IconName } from '../../atoms/Icon';
import styles from './SpecialtyTile.module.css';

export type SpecialtyTileProps = {
  /** One line: "Khoa nhi", "Tai - Mũi - Họng". */
  title: string;
  /** White icon URL (Claude Design › Assets › Specialties). */
  image?: string;
  icon?: IconName;
  href?: string;
  className?: string;
};

/** A 60px row: brand-colored square with a white icon, then the specialty name. Follows the theme. */
export function SpecialtyTile({ title, image, icon = 'plus', href, className }: SpecialtyTileProps) {
  const Tag = href ? 'a' : 'div';
  return (
    <Tag className={cx(styles.SpecialtyTile, className)} href={href} data-component="SpecialtyTile" data-link={href ? 'true' : undefined}>
      <span className={styles.Square}>
        {image ? <img src={image} alt="" width={60} height={60} /> : <Icon name={icon} size={28} />}
      </span>
      <span className={styles.Title}>{title}</span>
    </Tag>
  );
}
