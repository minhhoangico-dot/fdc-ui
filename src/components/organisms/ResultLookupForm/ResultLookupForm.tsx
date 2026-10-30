import { useId, useState, type FormEvent } from 'react';
import { cx } from '../../../utils/cx';
import { normalizeVnPhone } from '../../../utils/phone';
import { Button } from '../../atoms/Button';
import { TextField } from '../../atoms/TextField';
import { DateInput, partsToDate, partsToIso, type DateParts } from '../../molecules/DateInput';
import { FormNotice, type FormNoticeValue } from '../../molecules/FormNotice';
import { PhoneInput } from '../../molecules/PhoneInput';
import { ErrorSummary, type ErrorSummaryItem } from '../ErrorSummary';
import styles from './ResultLookupForm.module.css';

export type ResultLookupValues = { visitDate: string; birthYear: string; phone: string; patientCode: string };

export type ResultLookupFormProps = {
  /** Called only when all four fields are valid; visitDate is yyyy-mm-dd, phone is digits. */
  onSubmit?: (values: ResultLookupValues) => void;
  /** Default "Tra cứu kết quả xét nghiệm". */
  title?: string;
  /** Default "Xem kết quả". */
  submitLabel?: string;
  submitting?: boolean;
  notice?: FormNoticeValue | null;
  headingLevel?: 2 | 3;
  className?: string;
};

const EMPTY_DATE: DateParts = { day: '', month: '', year: '' };

/** The clinic's lab-result lookup: visit date, birth year, phone and patient code, with an error summary. */
export function ResultLookupForm({
  onSubmit,
  title = 'Tra cứu kết quả xét nghiệm',
  submitLabel = 'Xem kết quả',
  submitting,
  notice,
  headingLevel = 2,
  className,
}: ResultLookupFormProps) {
  const base = `lookup-${useId().replace(/:/g, '')}`;
  const ids = { visitDate: `${base}-visit`, birthYear: `${base}-year`, phone: `${base}-phone`, patientCode: `${base}-code` };
  const [visitDate, setVisitDate] = useState<DateParts>(EMPTY_DATE);
  const [errors, setErrors] = useState<Partial<Record<keyof ResultLookupValues, string>>>({});
  const Heading = `h${headingLevel}` as 'h2';

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = e.currentTarget.elements as unknown as Record<string, HTMLInputElement>;
    const birthYear = f.birthYear.value.trim();
    const phone = normalizeVnPhone(f.phone.value);
    const patientCode = f.patientCode.value.trim();
    const visit = partsToDate(visitDate);
    const next: typeof errors = {};
    if (!visit) next.visitDate = 'Nhập ngày khám ghi trên phiếu, ví dụ 24\u00a010\u00a02026';
    else if (visit > new Date()) next.visitDate = 'Ngày khám phải là hôm nay hoặc một ngày đã qua';
    if (!/^\d{4}$/.test(birthYear)) next.birthYear = 'Nhập năm sinh gồm 4 chữ số, ví dụ 1958';
    if (!phone) next.phone = 'Nhập số điện thoại gồm 10 chữ số, ví dụ 0912\u00a0345\u00a0678';
    if (!patientCode) next.patientCode = 'Nhập mã bệnh nhân in trên phiếu khám';
    setErrors(next);
    if (Object.keys(next).length === 0 && phone) {
      onSubmit?.({ visitDate: partsToIso(visitDate)!, birthYear, phone, patientCode });
    }
  };

  const summary: ErrorSummaryItem[] = (Object.keys(errors) as Array<keyof ResultLookupValues>).map((k) => ({
    fieldId: k === 'visitDate' ? `${ids.visitDate}-day` : ids[k],
    text: errors[k]!,
  }));

  return (
    <form className={cx(styles.Form, className)} onSubmit={submit} noValidate aria-labelledby={`${base}-title`} data-component="ResultLookupForm">
      <Heading id={`${base}-title`} className={styles.Title}>
        {title}
      </Heading>
      <ErrorSummary errors={summary} />
      <div className={styles.Grid}>
        <DateInput id={ids.visitDate} name="visitDate" label="Ngày khám" hint={'Ngày ghi trên phiếu khám, ví dụ: 24\u00a010\u00a02026'} birthday={false} value={visitDate} onValueChange={setVisitDate} error={errors.visitDate} required />
        <TextField id={ids.birthYear} name="birthYear" label="Năm sinh" inputMode="numeric" maxLength={4} autoComplete="bday-year" required error={errors.birthYear} />
        <PhoneInput id={ids.phone} name="phone" required error={errors.phone} />
        <TextField id={ids.patientCode} name="patientCode" label="Mã bệnh nhân" hint="In ở góc trên phiếu khám" required error={errors.patientCode} />
      </div>
      <Button type="submit" variant="primary" loading={submitting} loadingLabel="Đang tra cứu…">
        {submitLabel}
      </Button>
      <FormNotice notice={notice} />
    </form>
  );
}
