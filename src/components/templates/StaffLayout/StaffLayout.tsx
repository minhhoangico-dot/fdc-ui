import type { ReactNode } from 'react';
import { cx } from '../../../utils/cx';
import { SkipLink } from '../../atoms/SkipLink';
import { Header, type HeaderProps } from '../../organisms/Header';
import styles from './StaffLayout.module.css';

export type StaffLayoutProps = {
  /** The compact header; `variant` is set for you. */
  header: Omit<HeaderProps, 'variant'>;
  /** Full-width bar under the header, e.g. a sticky PatientContextBar on a record form. */
  context?: ReactNode;
  /**
   * A column beside the content (from 64rem up; above the content on smaller screens). It is the `<nav>` landmark,
   * so put the form's parts in it as a FormPartNav: a full list on computers, one "4. Thể lực · còn 2" toggle on phones.
   */
  aside?: ReactNode;
  /** aria-label of the aside's landmark. Default "Các phần của phiếu". */
  asideLabel?: string;
  /** Page content; rendered inside <main id="main">. */
  children: ReactNode;
  /** Sticky bar at the bottom for the save line and the screen's actions. */
  actionBar?: ReactNode;
  /** Keyboard shortcut hints under the action bar ("Ctrl + S lưu"). Shown from 1024px up only: phones have no Ctrl key. */
  shortcuts?: ReactNode;
  /** aria-label of the action bar. Default "Lưu và chuyển bước". */
  actionBarLabel?: string;
  /** Sets the brand theme on the shell. Leave it out to inherit the theme already set on <html> or a parent. */
  theme?: 'clinic' | 'nursing-home';
  skipLabel?: string;
  className?: string;
};

/**
 * Page shell for staff tools (hoso, FDC Manager): compact density, a grey work surface, the one-row header,
 * an optional context bar and side column, and a sticky action bar. Blocks inside are separated by edges and space,
 * not shadows; only the action bar, which floats over content, has one. Below 40rem the spacing is tighter
 * (10px above the content, 15px between blocks), so the work area starts sooner on a phone.
 */
export function StaffLayout({
  header,
  context,
  aside,
  asideLabel = 'Các phần của phiếu',
  children,
  actionBar,
  shortcuts,
  actionBarLabel = 'Lưu và chuyển bước',
  theme,
  skipLabel,
  className,
}: StaffLayoutProps) {
  return (
    <div className={cx(styles.StaffLayout, className)} data-theme={theme} data-density="compact" data-component="StaffLayout">
      <SkipLink label={skipLabel} />
      <Header {...header} variant="compact" />
      {context}
      <div className={styles.Body} data-aside={aside ? 'true' : undefined}>
        {aside ? (
          <nav aria-label={asideLabel} className={styles.Aside}>
            {aside}
          </nav>
        ) : null}
        <main id="main" tabIndex={-1} className={styles.Main}>
          {children}
        </main>
      </div>
      {actionBar ? (
        <section aria-label={actionBarLabel} className={styles.ActionBar}>
          <div className={styles.ActionInner}>{actionBar}</div>
          {shortcuts ? <p className={styles.Shortcuts}>{shortcuts}</p> : null}
        </section>
      ) : null}
    </div>
  );
}
