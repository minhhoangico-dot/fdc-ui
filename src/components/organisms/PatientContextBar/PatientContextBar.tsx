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
  /** Words before the code. Default "Mã lượt khám". */
  recordCodeLabel?: string;
  /** Company or ward, after the code. */
  organization?: string;
  /** Where this page sits, above the name. */
  breadcrumb?: BreadcrumbItem[];
  /** A StatusTag with the record's state: "Cần điền · còn 47 mục". */
  status?: ReactNode;
  /** Buttons such as "Người trước" and "Người sau cần làm". */
  actions?: ReactNode;
  /** The name is the page's heading. Default 1. */
  headingLevel?: 1 | 2;
  /** Stay at the top while the form scrolls, from 1024px up. Below that the compact Header's thin bar (collapseOnScroll + compactBar) does this job. */
  sticky?: boolean;
  className?: string;
};

/**
 * Who is being worked on, always in view on a staff form: name, sex, date of birth with age, the last four ID digits,
 * the record code, the state and the way to the previous or next person.
 * Name, date of birth and record code are the three facts that tell two people apart; they are never hidden.
 * Facts are whole chunks set apart by space, not by dots: a dot left at a line end reads like a stray mark.
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
  headingLevel = 1,
  sticky,
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
      {recordCodeLabel ? `${recordCodeLabel} ` : null}
      <strong>{recordCode}</strong>
    </span>,
    organization ? (
      <span key="org" className={styles.Organization}>
        {organization}
      </span>
    ) : null,
  ].filter(Boolean);
  return (
    <section aria-label="Người đang làm" className={cx(styles.PatientContextBar, className)} data-component="PatientContextBar" data-sticky={sticky || undefined}>
      <div className={styles.Inner}>
        <div className={styles.Who}>
          {breadcrumb?.length ? <Breadcrumb items={breadcrumb} className={styles.Breadcrumb} /> : null}
          <div className={styles.NameLine}>
            <Heading className={styles.Name}>{name}</Heading>
            {/* A real space between facts, so copied text and screen readers do not run them together. */}
            <p className={styles.Facts}>{facts.flatMap((f, i) => (i ? [' ', f] : [f]))}</p>
          </div>
        </div>
        {status ? <div className={styles.Status}>{status}</div> : null}
        {actions ? <div className={styles.Actions}>{actions}</div> : null}
      </div>
    </section>
  );
}
