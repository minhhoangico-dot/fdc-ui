import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../../../utils/cx';
import { Button } from '../../atoms/Button';
import { Icon } from '../../atoms/Icon';
import { HotlineCard } from '../../molecules/HotlineCard';
import styles from './Header.module.css';

export type NavItem = {
  label: string;
  href: string;
  /** Marks the current page (aria-current="page"). */
  current?: boolean;
  /** Sub-pages; the item becomes a button that opens them. */
  children?: Array<{ label: string; href: string; current?: boolean }>;
};

export type HeaderProps = {
  logo: { src: string; alt: string; href?: string; width?: number; height?: number };
  items: NavItem[];
  hotline?: { number: string; label?: string };
  /** One line such as "Mở cửa 07:00–20:00, tất cả các ngày". Hidden on phones. */
  hours?: string;
  /** Main call to action, e.g. { label: 'Đặt lịch khám', href: '/dat-lich' }. */
  cta?: { label: string; href: string };
  /** aria-label of the nav. Default "Menu chính". */
  navLabel?: string;
  /** Mobile menu button. Default "Menu" / "Đóng menu". */
  menuLabel?: string;
  closeMenuLabel?: string;
  /**
   * site (default) = the two-row public header (logo, hotline, hours, CTA, then the menu).
   * compact = one white row for staff tools: logo, app name, menu and a `tools` slot; nothing else.
   */
  variant?: 'site' | 'compact';
  /** compact: the app's name next to the logo, e.g. "hoso" (Montserrat 700, 18px). */
  appName?: string;
  /** compact: right-hand slot for system status, the signed-in person and "Đăng xuất". Below 1024px (phones, tablets) it moves into the menu. */
  tools?: ReactNode;
  /**
   * compact: stick to the top and, below 1024px, shrink to a thin bar after scrolling down.
   * The thin bar shows `compactBar` (the person being worked on: name, date of birth, record code) and the menu button.
   */
  collapseOnScroll?: boolean;
  /** compact: content of the thin bar shown when collapsed. */
  compactBar?: ReactNode;
  className?: string;
};

/** Scroll distance (px) after which a collapsing compact header shrinks. */
const COLLAPSE_AFTER = 64;

/**
 * Site header: logo, hotline (same place on every page), optional hours and call to action, and the main menu.
 * Sub-menus open on click or Enter/Space, never on hover alone, and close with Esc.
 */
export function Header({
  logo,
  items,
  hotline,
  hours,
  cta,
  navLabel = 'Menu chính',
  menuLabel = 'Menu',
  closeMenuLabel = 'Đóng menu',
  variant = 'site',
  appName,
  tools,
  collapseOnScroll,
  compactBar,
  className,
}: HeaderProps) {
  const id = useId();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openSub, setOpenSub] = useState<number | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const compact = variant === 'compact';

  useEffect(() => {
    if (!compact || !collapseOnScroll) return;
    const onScroll = () => setCollapsed(window.scrollY > COLLAPSE_AFTER);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [compact, collapseOnScroll]);

  useEffect(() => {
    if (openSub === null) return;
    const close = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpenSub(null);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [openSub]);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Escape') return;
    if (openSub !== null) {
      document.getElementById(`${id}-sub-${openSub}-btn`)?.focus();
      setOpenSub(null);
    } else if (menuOpen) {
      setMenuOpen(false);
      menuButton.current?.focus();
    }
  };

  const list = (
    <ul className={styles.List}>
      {items.map((item, i) => {
        const hasSub = Boolean(item.children?.length);
        const subOpen = openSub === i;
        const isCurrent = item.current || item.children?.some((c) => c.current);
        return (
          <li key={item.href} className={styles.Item} data-current={isCurrent || undefined}>
            {hasSub ? (
              <>
                <button
                  id={`${id}-sub-${i}-btn`}
                  type="button"
                  className={styles.Link}
                  aria-expanded={subOpen}
                  aria-controls={`${id}-sub-${i}`}
                  onClick={() => setOpenSub(subOpen ? null : i)}
                >
                  <span>{item.label}</span>
                  <Icon name={subOpen ? 'rounded-up' : 'rounded-down'} size={14} />
                </button>
                <ul id={`${id}-sub-${i}`} className={styles.Sub} hidden={!subOpen}>
                  {item.children!.map((c) => (
                    <li key={c.href}>
                      <a className={styles.SubLink} href={c.href} aria-current={c.current ? 'page' : undefined}>
                        {c.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <a className={styles.Link} href={item.href} aria-current={item.current ? 'page' : undefined}>
                {item.label}
              </a>
            )}
          </li>
        );
      })}
    </ul>
  );

  const menuToggle = (
    <button
      ref={menuButton}
      type="button"
      className={styles.MenuButton}
      aria-expanded={menuOpen}
      aria-controls={`${id}-nav`}
      onClick={() => setMenuOpen((v) => !v)}
    >
      <Icon name="navigation-menu" size={20} />
      <span>{menuOpen ? closeMenuLabel : menuLabel}</span>
    </button>
  );

  if (compact) {
    return (
      <header
        ref={rootRef}
        className={cx(styles.Header, className)}
        onKeyDown={onKeyDown}
        data-component="Header"
        data-variant="compact"
        data-sticky={collapseOnScroll || undefined}
        data-collapsed={collapsed || undefined}
      >
        <div className={styles.Bar}>
          <a className={styles.Brand} href={logo.href ?? '/'}>
            <img src={logo.src} alt={logo.alt} width={logo.width ?? 142} height={logo.height ?? 82} />
            {appName ? <span className={styles.AppName}>{appName}</span> : null}
          </a>
          {compactBar ? (
            <div className={styles.CompactBar}>
              {compactBar}
            </div>
          ) : null}
          {/* Menu and tools: in the row from 1024px, behind the menu button below that. */}
          <div id={`${id}-nav`} className={styles.Panel} data-open={menuOpen || undefined}>
            <nav className={styles.CompactNav} aria-label={navLabel}>
              {list}
            </nav>
            {tools ? <div className={styles.CompactTools}>{tools}</div> : null}
          </div>
          {menuToggle}
        </div>
      </header>
    );
  }

  return (
    <header ref={rootRef} className={cx(styles.Header, className)} onKeyDown={onKeyDown} data-component="Header" data-variant="site">
      <div className={styles.Top}>
        <a className={styles.Logo} href={logo.href ?? '/'}>
          <img src={logo.src} alt={logo.alt} width={logo.width ?? 142} height={logo.height ?? 82} />
        </a>
        <div className={styles.Tools}>
          {hours ? (
            <p className={styles.Hours}>
              <Icon name="ui-calendar" size={18} />
              <span>{hours}</span>
            </p>
          ) : null}
          {hotline ? <HotlineCard number={hotline.number} label={hotline.label} /> : null}
          {cta ? (
            <Button variant="primary" href={cta.href} className={styles.Cta}>
              {cta.label}
            </Button>
          ) : null}
          {menuToggle}
        </div>
      </div>
      <nav id={`${id}-nav`} className={styles.Nav} aria-label={navLabel} data-open={menuOpen || undefined}>
        {list}
      </nav>
    </header>
  );
}
