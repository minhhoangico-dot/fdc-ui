import { cx } from '../../../utils/cx';
import styles from './Avatar.module.css';

export type AvatarProps = {
  /** Photo URL. Use patient and resident photos only with written consent. */
  src?: string;
  /** Person's name; used for alt text and initials. */
  name?: string;
  /** Override the computed initials. */
  initials?: string;
  alt?: string;
  /** Pixel size. Default 64. */
  size?: number;
  /** 5px brand-300 ring, as on the nursing home testimonials. */
  ring?: boolean;
  className?: string;
};

/** Initials from the last two words of a Vietnamese name: "Bùi Hiền" → "BH". */
export function initialsOf(name = ''): string {
  const words = name.normalize('NFC').trim().split(/\s+/).filter(Boolean);
  if (!words.length) return '?';
  const picked = words.length > 1 ? words.slice(-2) : words;
  return picked.map((w) => w.charAt(0)).join('').toLocaleUpperCase('vi');
}

/** Round photo, or initials on brand-100 when there is no photo (the safe default). */
export function Avatar({ src, name, initials, alt, size = 64, ring, className }: AvatarProps) {
  return (
    <span
      className={cx(styles.Avatar, className)}
      data-component="Avatar"
      data-ring={ring || undefined}
      style={{ inlineSize: size, blockSize: size, fontSize: Math.round(size * 0.34) }}
    >
      {src ? (
        <img className={styles.Image} src={src} alt={alt ?? name ?? ''} />
      ) : (
        <span role={name ? 'img' : undefined} aria-label={name}>
          {initials ?? initialsOf(name)}
        </span>
      )}
    </span>
  );
}
