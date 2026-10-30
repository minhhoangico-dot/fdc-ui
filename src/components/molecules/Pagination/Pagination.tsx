import type { ReactNode } from 'react';
import { cx } from '../../../utils/cx';
import { formatViInteger } from '../../../utils/vi';
import styles from './Pagination.module.css';

export type PaginationProps = {
  /** Current page, from 1. */
  page: number;
  pageSize: number;
  /** Rows in the whole (filtered) list. */
  total: number;
  /** What the rows are, after the count: "người", "hồ sơ". Default "dòng". */
  itemLabel?: string;
  /** Links: the page's address, so pages can be bookmarked and opened in a new tab. Preferred. */
  getHref?: (page: number) => string;
  /** Buttons: called with the new page when there is no address per page. */
  onPageChange?: (page: number) => void;
  /** aria-label of the nav. Default "Trang của danh sách". */
  label?: string;
  /**
   * Announce the range line when it changes (a polite live region). Default true. DataTable sets false: it keeps one
   * live region of its own that says the count, the empty result or the failure, so nothing is read twice.
   */
  live?: boolean;
  previousLabel?: string;
  nextLabel?: string;
  className?: string;
};

/** The page and the rows it shows, clamped to the list: page 99 of a 41-page list is page 41. */
export function pageRange(page: number, pageSize: number, total: number) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(Math.max(1, page), pages);
  return { pages, current, from: (current - 1) * pageSize + 1, to: Math.min(current * pageSize, total) };
}

/** "Hiển thị 1–50 trong 2.033 người": the range line in plain text (DataTable's live region says it too). */
export function rangeText({ page, pageSize, total, itemLabel = 'dòng' }: Pick<PaginationProps, 'page' | 'pageSize' | 'total' | 'itemLabel'>) {
  const { from, to } = pageRange(page, pageSize, total);
  return `Hiển thị ${formatViInteger(from)}–${formatViInteger(to)} trong ${formatViInteger(total)} ${itemLabel}`;
}

/**
 * "Hiển thị 1–50 trong 2.033 người · ‹ Trước · Trang 1 / 41 · Sau ›".
 * Says what is shown and how much there is; only Previous and Next, so the control never grows with the list.
 * Renders nothing when the list is empty (the table says so instead).
 */
export function Pagination({
  page,
  pageSize,
  total,
  itemLabel = 'dòng',
  getHref,
  onPageChange,
  label = 'Trang của danh sách',
  live = true,
  previousLabel = 'Trước',
  nextLabel = 'Sau',
  className,
}: PaginationProps) {
  if (total <= 0) return null;
  const { pages, current, from, to } = pageRange(page, pageSize, total);

  const control = (target: number, text: ReactNode, rel: 'prev' | 'next') => {
    const unavailable = target < 1 || target > pages;
    if (unavailable) {
      return (
        <span className={styles.Unavailable} aria-hidden="true">
          {text}
        </span>
      );
    }
    if (getHref) {
      return (
        <a className={styles.Control} href={getHref(target)} rel={rel}>
          {text}
        </a>
      );
    }
    return (
      <button type="button" className={styles.Control} onClick={() => onPageChange?.(target)}>
        {text}
      </button>
    );
  };

  return (
    <nav aria-label={label} className={cx(styles.Pagination, className)} data-component="Pagination">
      <p className={styles.Range} aria-live={live ? 'polite' : undefined}>
        Hiển thị{' '}
        <strong>
          {formatViInteger(from)}–{formatViInteger(to)}
        </strong>{' '}
        trong {formatViInteger(total)} {itemLabel}
      </p>
      {pages > 1 ? (
        <div className={styles.Controls}>
          {control(current - 1, <>‹ {previousLabel}</>, 'prev')}
          <span className={styles.Page}>
            Trang {formatViInteger(current)} / {formatViInteger(pages)}
          </span>
          {control(current + 1, <>{nextLabel} ›</>, 'next')}
        </div>
      ) : null}
    </nav>
  );
}
