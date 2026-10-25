import type { ReactNode } from 'react';
import { cx } from '../../../utils/cx';
import { SkipLink } from '../../atoms/SkipLink';
import { Footer, type FooterProps } from '../../organisms/Footer';
import { Header, type HeaderProps } from '../../organisms/Header';
import styles from './SiteLayout.module.css';

export type SiteLayoutProps = {
  header: HeaderProps;
  footer: FooterProps;
  /** Page content; rendered inside <main id="main">. Do not nest another <main>. */
  children: ReactNode;
  /** "clinic" (default) or "nursing-home". */
  theme?: 'clinic' | 'nursing-home';
  skipLabel?: string;
  className?: string;
};

/** Page shell: skip link, header, main content, footer. Every public FDC page uses it. */
export function SiteLayout({ header, footer, children, theme = 'clinic', skipLabel, className }: SiteLayoutProps) {
  return (
    <div className={cx(styles.SiteLayout, className)} data-theme={theme} data-component="SiteLayout">
      <SkipLink label={skipLabel} />
      <Header {...header} />
      <main id="main" tabIndex={-1} className={styles.Main}>
        {children}
      </main>
      <Footer {...footer} />
    </div>
  );
}
