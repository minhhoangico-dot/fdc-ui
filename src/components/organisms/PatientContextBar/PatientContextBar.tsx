import type { ReactNode } from 'react';
import { cx } from '../../../utils/cx';
import { ageFromViDate } from '../../../utils/vi';
import { Breadcrumb, type BreadcrumbItem } from '../../molecules/Breadcrumb';
import styles from './PatientContextBar.module.css';

export type PatientContextBarProps = {
  /** Full name, exactly as on the record. */
  name: string;
  sex?: string;
  /** dd/mm/yyyy. Shown as "Sinh 07/07/1990 (36 tuổi)": the age is added when the date can be read. */
  birthDate: string;
  /** The day the age is counted on; default today. Set it to the exam date for past records. */
  ageOn?: Date;
  /** Last four digits of the citizen ID; the full number is never shown here. */
  idEnd?: string;
  /** Record or visit code: "RD26-0006", shown in bold after its label. */
  recordCode: string;
  /** Words before the code. Default "Mã lượt khám". On phones only the bold code shows (as in the Header's thin bar); the words stay for screen readers. */
  recordCodeLabel?: string;
  /** Company or ward, after the code. */
  organization?: string;
  /** Where this page sits, above the name. */
  breadcrumb?: BreadcrumbItem[];
  /** A StatusTag with the record's state: "Cần điền · còn 47 mục". It sits right after the name. */
  status?: ReactNode;
  /**
   * The way to the previous and next person: two Buttons with short visible words, the next arrow after them, and
   * an accessible name that starts with those words and adds the person:
   * `<Button icon="simple-left" aria-label="Người trước: Ngô Văn Nam">Người trước</Button>`,
   * `<Button icon="simple-right" iconPosition="end" aria-label="Người sau: Lê Thị Hà">Người sau</Button>`.
   * They sit on the name's row from 40rem up, and share one row of two 44px buttons on phones.
   */
  actions?: ReactNode;
  /**
   * Facts about this version of the record, on a muted line of their own under the person's facts: on the review
   * page the exam time, the signer and the last save. Pass each as its own element; each stays whole, set apart by
   * space: `<><span>Khám 10/10/2026 08:15</span><span>Người ký: <strong>BS Hoàng Thị Cúc</strong></span></>`.
   */
  recordFacts?: ReactNode;
  /** The name is the page's heading. Default 1. */
  headingLevel?: 1 | 2;
  /**
   * bar (default) = a full-width bar with a bottom edge, in StaffLayout's `context` slot under the header (a record
   * form). block = a white block with one light edge all round, among the page's own blocks (the review page, after
   * its title); put no box around it, so there is one edge, not two.
   */
  variant?: 'bar' | 'block';
  /**
   * Stay at the top while the page scrolls, from 1024px up, in either variant. Below that the compact Header's thin
   * bar (collapseOnScroll + compactBar) does this job. A sticky block must be a direct child of the page's content
   * (StaffLayout's main), so it sticks for the whole page; StaffLayout measures it like the bar.
   */
  sticky?: boolean;
  className?: string;
};

/**
 * Who is being worked on, always in view on a staff form: name, sex, date of birth with age, the last four ID digits,
 * the record code, the state and the way to the previous or next person.
 * Name, date of birth and record code are the three facts that tell two people apart; they are never hidden.
 * Facts are whole chunks set apart by space, not by dots: a dot left at a line end reads like a stray mark.
 * Rows: the breadcrumb; the name with its state (and, from 40rem, the previous/next buttons at the end); the facts;
 * the record facts. From 64rem, where it sticks, that is one row of buttons, not a second row under the facts.
 * On phones it is as short as it can be without losing a fact: the state sits beside the name when both fit, and
 * the facts run on as few lines as their whole chunks allow (the code without its words, 10px apart).
 */
export function PatientContextBar({
  name,
  sex,
  birthDate,
  ageOn,
  idEnd,
  recordCode,
  recordCodeLabel = 'Mã lượt khám',
  organization,
  breadcrumb,
  status,
  actions,
  recordFacts,
  headingLevel = 1,
  sticky,
  variant = 'bar',
  className,
}: PatientContextBarProps) {
  const Heading = `h${headingLevel}` as const;
  const age = ageFromViDate(birthDate, ageOn);
  const facts = [
    sex ? <span key="sex">{sex}</span> : null,
    <span key="birth">
      Sinh {birthDate}
      {age !== null ? ` (${age} tuổi)` : ''}
    </span>,
    idEnd ? <span key="id">CCCD …{idEnd}</span> : null,
    <span key="code">
      {recordCodeLabel ? <span className={styles.CodeLabel}>{recordCodeLabel} </span> : null}
      <strong>{recordCode}</strong>
    </span>,
    organization ? (
      <span key="org" className={styles.Organization}>
        {organization}
      </span>
    ) : null,
  ].filter(Boolean);
  return (
    <section aria-label="Người đang làm" className={cx(styles.PatientContextBar, className)} data-component="PatientContextBar" data-sticky={sticky || undefined} data-variant={variant}>
      <div className={styles.Inner}>
        {breadcrumb?.length ? <Breadcrumb items={breadcrumb} collapseOnPhone className={styles.Breadcrumb} /> : null}
        <div className={styles.NameLine}>
          <Heading className={styles.Name}>{name}</Heading>
          {status ? <div className={styles.Status}>{status}</div> : null}
        </div>
        {/* A real space between facts, so copied text and screen readers do not run them together. */}
        <p className={styles.Facts}>{facts.flatMap((f, i) => (i ? [' ', f] : [f]))}</p>
        {recordFacts ? <p className={styles.RecordFacts}>{recordFacts}</p> : null}
        {actions ? <div className={styles.Actions}>{actions}</div> : null}
      </div>
    </section>
  );
}
