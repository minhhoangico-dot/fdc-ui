import { cx } from '../../../utils/cx';
import { telHref } from '../../../utils/phone';
import styles from './Footer.module.css';

export type FooterProps = {
  /** Legal or facility name, e.g. "Công ty cổ phần Trung tâm bác sĩ gia đình Hà Nội". */
  name: string;
  tagline?: string;
  address: string;
  /** Shown as text and tap-to-call links. */
  phones: Array<{ number: string; label?: string }>;
  email?: string;
  /** Registration and representative lines. */
  legal?: string[];
  columns?: Array<{ title: string; links: Array<{ label: string; href: string }> }>;
  copyright?: string;
  labels?: { address?: string; phone?: string; email?: string };
  className?: string;
};

/** Site footer on brand-700: who we are, where, how to reach us (as text, not only links), legal lines, site links. */
export function Footer({ name, tagline, address, phones, email, legal = [], columns = [], copyright, labels = {}, className }: FooterProps) {
  const l = { address: 'Địa chỉ', phone: 'Điện thoại', email: 'Email', ...labels };
  return (
    <footer className={cx(styles.Footer, className)} data-component="Footer">
      <div className={styles.Inner}>
        <div className={styles.Org}>
          <p className={styles.Name}>{name}</p>
          {tagline ? <p className={styles.Tagline}>{tagline}</p> : null}
          <dl className={styles.Contact}>
            <div>
              <dt>{l.address}</dt>
              <dd>{address}</dd>
            </div>
            <div>
              <dt>{l.phone}</dt>
              {phones.map((p) => (
                <dd key={p.number}>
                  {p.label ? `${p.label}: ` : null}
                  <a href={telHref(p.number)}>{p.number}</a>
                </dd>
              ))}
            </div>
            {email ? (
              <div>
                <dt>{l.email}</dt>
                <dd>
                  <a href={`mailto:${email}`}>{email}</a>
                </dd>
              </div>
            ) : null}
          </dl>
        </div>
        {columns.map((col) => (
          <nav key={col.title} className={styles.Column} aria-label={col.title}>
            <p className={styles.ColumnTitle}>{col.title}</p>
            <ul className={styles.Links}>
              {col.links.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      {legal.length || copyright ? (
        <div className={styles.Legal}>
          {legal.map((line) => (
            <p key={line}>{line}</p>
          ))}
          {copyright ? <p>{copyright}</p> : null}
        </div>
      ) : null}
    </footer>
  );
}
