import type { ReactNode } from 'react';
import { cx } from '../../../utils/cx';
import { telHref } from '../../../utils/phone';
import { Icon } from '../../atoms/Icon';
import { VisuallyHidden } from '../../atoms/VisuallyHidden';
import styles from './CareCard.module.css';

export type CareLevel = 'non-urgent' | 'urgent' | 'emergency';

export type CareCardProps = {
  level: CareLevel;
  /** The action, e.g. "Gọi bác sĩ gia đình nếu:". */
  title: string;
  /** Symptoms or advice, usually a list. */
  children: ReactNode;
  /** Screen-reader prefix per level. Default "Không khẩn cấp:", "Cần khám trong ngày:", "Cấp cứu:". */
  levelLabels?: Record<CareLevel, string>;
  /** Emergency number. Default "115". */
  emergencyNumber?: string;
  /** Emergency call line. Default "Gọi 115 ngay". */
  emergencyCallLabel?: string;
  headingLevel?: 2 | 3;
  className?: string;
};

const LABELS: Record<CareLevel, string> = {
  'non-urgent': 'Không khẩn cấp:',
  urgent: 'Cần khám trong ngày:',
  emergency: 'Cấp cứu:',
};

/**
 * "When to get help" advice in three levels (from the NHS care-card pattern). The level is in the heading
 * text for screen readers, in the band color and in words, never color alone. Inform and reassure; do not scare.
 */
export function CareCard({
  level,
  title,
  children,
  levelLabels = LABELS,
  emergencyNumber = '115',
  emergencyCallLabel = 'Gọi 115 ngay',
  headingLevel = 2,
  className,
}: CareCardProps) {
  const Heading = `h${headingLevel}` as 'h2';
  return (
    <section className={cx(styles.CareCard, className)} data-component="CareCard" data-level={level}>
      <Heading className={styles.Heading}>
        <VisuallyHidden>{levelLabels[level]} </VisuallyHidden>
        {title}
      </Heading>
      <div className={styles.Body}>
        {children}
        {level === 'emergency' ? (
          <a className={styles.Call} href={telHref(emergencyNumber)}>
            <Icon name="phone" size={22} />
            <span>{emergencyCallLabel}</span>
          </a>
        ) : null}
      </div>
    </section>
  );
}
