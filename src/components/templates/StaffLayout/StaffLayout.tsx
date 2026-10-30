import { useEffect, useLayoutEffect, useRef, type ReactNode, type RefObject } from 'react';
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

/** The three heights StaffLayout writes, in px, on its root and on <html> (where the scroll padding lives). */
const STAFF_BAR_VARS = ['--header-space', '--context-bar-space', '--action-bar-space'] as const;

// Measure before paint in the browser (no jump of the side column); plain effect where there is no DOM.
const useBrowserLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

const isSticky = (el: Element | null | undefined): boolean => !!el && getComputedStyle(el).position === 'sticky';
const heightOf = (el: Element) => el.getBoundingClientRect().height;

/**
 * The bars that hold the person at the top: what sticks in the context slot (a PatientContextBar), and a
 * PatientContextBar block that sticks inside the content (the review page). Both count as --context-bar-space.
 */
function personBars(root: HTMLElement, context: HTMLElement | null): HTMLElement[] {
  const inContext = context ? (Array.from(context.children) as HTMLElement[]) : [];
  const inMain = Array.from(root.querySelectorAll<HTMLElement>('main [data-component="PatientContextBar"]'));
  return [...inContext, ...inMain];
}

/**
 * Keeps the sticky bars' real heights in CSS variables: the header while it sticks (below 64rem, collapsing to its
 * thin bar), the person's bar while it sticks (from 64rem; in the context slot or in the content) and the action
 * bar. They differ by width and by state (the action bar of a phone in a save conflict is several lines tall), so
 * they are measured, never guessed.
 */
function useStickyBarSpace(root: RefObject<HTMLDivElement>, context: RefObject<HTMLDivElement>, actionBar: RefObject<HTMLElement>) {
  const observer = useRef<ResizeObserver | null>(null);

  useBrowserLayoutEffect(() => {
    const el = root.current;
    // jsdom and old browsers have no ResizeObserver: the CSS fallbacks apply.
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    const html = document.documentElement;
    const measure = () => {
      const header = el.querySelector(':scope > header');
      const contextBars = personBars(el, context.current).filter(isSticky);
      const bar = actionBar.current;
      const values = [
        header && isSticky(header) ? heightOf(header) : 0,
        contextBars.reduce((sum, b) => sum + heightOf(b), 0),
        bar && isSticky(bar) ? heightOf(bar) : 0,
      ];
      STAFF_BAR_VARS.forEach((name, i) => {
        const px = `${Math.ceil(values[i])}px`;
        if (el.style.getPropertyValue(name) !== px) el.style.setProperty(name, px);
        if (html.style.getPropertyValue(name) !== px) html.style.setProperty(name, px);
      });
    };
    const ro = new ResizeObserver(measure);
    observer.current = ro;
    ro.observe(el);
    // Crossing 64rem changes which bar sticks without always changing a size.
    window.addEventListener('resize', measure);
    measure();
    return () => {
      ro.disconnect();
      observer.current = null;
      window.removeEventListener('resize', measure);
      STAFF_BAR_VARS.forEach((name) => html.style.removeProperty(name));
    };
  }, []);

  // Each render: watch the bars that are there now (the context can change); observing twice is harmless.
  useBrowserLayoutEffect(() => {
    const ro = observer.current;
    const el = root.current;
    if (!ro || !el) return;
    const header = el.querySelector(':scope > header');
    if (header) ro.observe(header);
    if (actionBar.current) ro.observe(actionBar.current);
    personBars(el, context.current).forEach((bar) => ro.observe(bar));
  });
}

/** Room (px) kept between the top bars and a focused field's label when the helper below has to move it. */
const LABEL_GAP = 5;

/**
 * Inside a bar that sticks (header, context bar, action bar) or a layer that floats over the page (a modal dialog):
 * already in view, and scrolling the page would not move it.
 */
function inStickyBar(el: HTMLElement, root: HTMLElement) {
  for (let node: HTMLElement | null = el; node && node !== root; node = node.parentElement) {
    const position = getComputedStyle(node).position;
    if (position === 'sticky' || position === 'fixed') return true;
  }
  return false;
}

/**
 * The top of a control's visible label (a field's label sits above its message line and box), else the control's
 * own top. A label that is not drawn (display: none, or visually hidden to 1px) does not count.
 */
function labelTop(el: HTMLElement): number {
  const labels = 'labels' in el ? Array.from((el as HTMLInputElement).labels ?? []) : [];
  const shown = labels.map((l) => l.getBoundingClientRect()).filter((r) => r.width > 1 && r.height > 1);
  return Math.min(el.getBoundingClientRect().top, ...shown.map((r) => r.top));
}

/**
 * Browsers scroll a focused text box only until its caret line shows, so the rest of a textarea can stay under the
 * action bar. After focus moves by keyboard, bring the whole control into the clear area between the bars when it
 * fits (scrollIntoView keeps the scroll padding), and then its label too, if a tall message line left the label
 * under a top bar. Pointer focus is left alone: scrolling between press and release would move the control away
 * from the pointer and lose the click.
 */
function useKeyboardFocusInView(root: RefObject<HTMLDivElement>) {
  useEffect(() => {
    const el = root.current;
    if (!el) return undefined;
    let byKeyboard = false;
    const onKey = () => {
      byKeyboard = true;
    };
    const onPointer = () => {
      byKeyboard = false;
    };
    const onFocusIn = (e: FocusEvent) => {
      const target = e.target;
      if (!byKeyboard || !(target instanceof HTMLElement) || typeof target.scrollIntoView !== 'function') return;
      window.requestAnimationFrame(() => {
        if (document.activeElement !== target || inStickyBar(target, el)) return;
        const pad = getComputedStyle(document.documentElement);
        const top = parseFloat(pad.scrollPaddingTop) || 0;
        const bottom = window.innerHeight - (parseFloat(pad.scrollPaddingBottom) || 0);
        const r = target.getBoundingClientRect();
        if (r.height > bottom - top) return;
        if (r.top < top || r.bottom > bottom) target.scrollIntoView({ block: 'nearest' });
        // The label: 5px clear of the bars that stick at the top, as long as the control stays clear of the bottom.
        const html = document.documentElement.style;
        const bars = (parseFloat(html.getPropertyValue('--header-space')) || 0) + (parseFloat(html.getPropertyValue('--context-bar-space')) || 0);
        const under = bars + LABEL_GAP - labelTop(target);
        if (under > 0 && target.getBoundingClientRect().bottom + under <= bottom) window.scrollBy(0, -under);
      });
    };
    document.addEventListener('keydown', onKey, true);
    document.addEventListener('pointerdown', onPointer, true);
    el.addEventListener('focusin', onFocusIn);
    return () => {
      document.removeEventListener('keydown', onKey, true);
      document.removeEventListener('pointerdown', onPointer, true);
      el.removeEventListener('focusin', onFocusIn);
    };
  }, [root]);
}

/**
 * Page shell for staff tools (hoso, FDC Manager): compact density, a grey work surface, the one-row header,
 * an optional context bar and side column, and a sticky action bar. Blocks inside are separated by edges and space,
 * not shadows; only the action bar, which floats over content, has one. Below 40rem the spacing is tighter
 * (10px above the content, 15px between blocks), so the work area starts sooner on a phone.
 * It measures the bars that stick and writes their heights as --header-space, --context-bar-space and
 * --action-bar-space, so the scroll padding (a focused field is never under a bar) and the side column's sticky top
 * follow the real bars at every width and in every state. Pages never hard-code sticky offsets.
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
  const rootRef = useRef<HTMLDivElement>(null);
  const contextRef = useRef<HTMLDivElement>(null);
  const actionBarRef = useRef<HTMLElement>(null);
  useStickyBarSpace(rootRef, contextRef, actionBarRef);
  useKeyboardFocusInView(rootRef);
  return (
    <div ref={rootRef} className={cx(styles.StaffLayout, className)} data-theme={theme} data-density="compact" data-component="StaffLayout">
      <SkipLink label={skipLabel} />
      <Header {...header} variant="compact" />
      {/* No box of its own (display: contents), so a sticky bar inside still sticks for the whole page. */}
      {context ? (
        <div ref={contextRef} className={styles.Context}>
          {context}
        </div>
      ) : null}
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
        <section ref={actionBarRef} aria-label={actionBarLabel} className={styles.ActionBar}>
          <div className={styles.ActionInner}>{actionBar}</div>
          {shortcuts ? <p className={styles.Shortcuts}>{shortcuts}</p> : null}
        </section>
      ) : null}
    </div>
  );
}
