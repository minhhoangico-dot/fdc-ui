import type { ReactNode } from 'react';
import { cx } from '../../../utils/cx';
import { ageFromViDate } from '../../../utils/vi';
import { Breadcrumb, type BreadcrumbItem } from '../../molecules/Breadcrumb';
import styles from './PatientContextBar.module.css';

export type PatientContextBarProps = {
  /** Full name, exactly as on the record. */
  name: string;
  sex?: string;
  /** dd/mm/yyyy. The age is added after it: "07/07/1990 (36 tuổi)". */
  birthDate: string;
  /** The day the age is counted on; default today. Set it to the exam date for past records. */
  ageOn?: Date;
  /** Last four digits of the citizen ID; the full number is never shown here. */
  idEnd?: string;
  /** Record or visit code: "RD26-0006". */
  recordCode: string;
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
 */
export function PatientContextBar({
  name,
  sex,
  birthDate,
  ageOn,
  idEnd,
  recordCode,
  recordCodeLabel = 'mã lượt khám',
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
  return (
    <section aria-label="Người đang làm" className={cx(styles.PatientContextBar, className)} data-component="PatientContextBar" data-sticky={sticky || undefined}>
      <div className={styles.Inner}>
        <div className={styles.Who}>
          {breadcrumb?.length ? <Breadcrumb items={breadcrumb} className={styles.Breadcrumb} /> : null}
          <div className={styles.NameLine}>
            <Heading className={styles.Name}>{name}</Heading>
            <p className={styles.Facts}>
              {sex ? <span>{sex}</span> : null}
              <span>
                {birthDate}
                {age !== null ? ` (${age} tuổi)` : ''}
              </span>
              {idEnd ? <span>CCCD …{idEnd}</span> : null}
              <span>
                {recordCodeLabel} <strong>{recordCode}</strong>
              </span>
              {organization ? <span>{organization}</span> : null}
            </p>
          </div>
        </div>
        {status ? <div className={styles.Status}>{status}</div> : null}
        {actions ? <div className={styles.Actions}>{actions}</div> : null}
      </div>
    </section>
  );
}
