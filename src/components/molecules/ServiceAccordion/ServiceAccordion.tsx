import { useId, useState } from 'react';
import { cx } from '../../../utils/cx';
import { Icon } from '../../atoms/Icon';
import { TextLink } from '../../atoms/TextLink';
import styles from './ServiceAccordion.module.css';

export type ServiceAccordionItem = { title: string; content: string; href?: string; moreLabel?: string };

export type ServiceAccordionProps = {
  items: ServiceAccordionItem[];
  /** Index open at start; -1 for all closed. Default 0. */
  defaultOpen?: number;
  headingLevel?: 2 | 3 | 4;
  className?: string;
};

/** Expandable list of services, one open at a time. Headers are buttons with aria-expanded. */
export function ServiceAccordion({ items, defaultOpen = 0, headingLevel = 3, className }: ServiceAccordionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const base = useId();
  const Heading = `h${headingLevel}` as 'h3';
  return (
    <div className={cx(styles.ServiceAccordion, className)} data-component="ServiceAccordion">
      {items.map((item, i) => {
        const isOpen = open === i;
        const buttonId = `${base}-b${i}`;
        const panelId = `${base}-p${i}`;
        return (
          <div key={item.title}>
            <Heading className={styles.Heading}>
              <button
                type="button"
                id={buttonId}
                className={styles.Trigger}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? -1 : i)}
              >
                <span>{item.title}</span>
                <Icon name={isOpen ? 'minus' : 'plus'} size={16} />
              </button>
            </Heading>
            <div id={panelId} role="region" aria-labelledby={buttonId} className={styles.Panel} hidden={!isOpen}>
              <p className={styles.Text}>{item.content}</p>
              {item.href ? <TextLink href={item.href}>{item.moreLabel ?? 'Xem chi tiết'}</TextLink> : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
