import { useId, useState, type FormEvent } from 'react';
import { cx } from '../../../utils/cx';
import { normalizeVnPhone } from '../../../utils/phone';
import { Button } from '../../atoms/Button';
import { TextField } from '../../atoms/TextField';
import { FormNotice, type FormNoticeValue } from '../../molecules/FormNotice';
import { PhoneInput } from '../../molecules/PhoneInput';
import { ErrorSummary, type ErrorSummaryItem } from '../ErrorSummary';
import styles from './ContactForm.module.css';

export type ContactValues = { name: string; phone: string; message: string };

export type ContactFormProps = {
  /** Called only when name and phone are valid; phone is digits. */
  onSubmit?: (values: ContactValues) => void;
  /** Default "Gửi liên hệ". */
  title?: string;
  intro?: string;
  messageHint?: string;
  /** Default "Gửi liên hệ". */
  submitLabel?: string;
  submitting?: boolean;
  notice?: FormNoticeValue | null;
  headingLevel?: 2 | 3;
  className?: string;
};

/** Contact request (name, phone, optional message) with an error summary. Pair with a framed HotlineCard. */
export function ContactForm({
  onSubmit,
  title = 'Gửi liên hệ',
  intro,
  messageHint = 'Không bắt buộc. Ví dụ: muốn tư vấn gói dưỡng lão cho bố mẹ',
  submitLabel = 'Gửi liên hệ',
  submitting,
  notice,
  headingLevel = 2,
  className,
}: ContactFormProps) {
  const base = `contact-${useId().replace(/:/g, '')}`;
  const ids = { name: `${base}-name`, phone: `${base}-phone` };
  const [errors, setErrors] = useState<Partial<Record<'name' | 'phone', string>>>({});
  const Heading = `h${headingLevel}` as 'h2';

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = e.currentTarget.elements as unknown as Record<string, HTMLInputElement>;
    const name = f.name.value.normalize('NFC').trim();
    const phone = normalizeVnPhone(f.phone.value);
    const message = f.message.value.trim();
    const next: typeof errors = {};
    if (!name) next.name = 'Nhập họ và tên';
    if (!phone) next.phone = 'Nhập số điện thoại gồm 10 chữ số, ví dụ 0912\u00a0345\u00a0678';
    setErrors(next);
    if (!next.name && phone) onSubmit?.({ name, phone, message });
  };

  const summary: ErrorSummaryItem[] = (Object.keys(errors) as Array<'name' | 'phone'>).map((k) => ({ fieldId: ids[k], text: errors[k]! }));

  return (
    <form className={cx(styles.Form, className)} onSubmit={submit} noValidate aria-labelledby={`${base}-title`} data-component="ContactForm">
      <Heading id={`${base}-title`} className={styles.Title}>
        {title}
      </Heading>
      {intro ? <p className={styles.Intro}>{intro}</p> : null}
      <ErrorSummary errors={summary} />
      <TextField id={ids.name} name="name" label="Họ và tên" icon="ui-user" autoComplete="name" required error={errors.name} />
      <PhoneInput id={ids.phone} name="phone" icon="phone" required error={errors.phone} />
      <TextField name="message" label="Nội dung" icon="pencil-alt-2" multiline rows={4} hint={messageHint} />
      <div>
        <Button type="submit" variant="primary" loading={submitting} loadingLabel="Đang gửi…">
          {submitLabel}
        </Button>
      </div>
      <FormNotice notice={notice} />
    </form>
  );
}
