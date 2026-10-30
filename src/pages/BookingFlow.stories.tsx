import { useEffect, useState, type FormEvent } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, waitFor, within } from '@storybook/test';
import { TextField } from '../components/atoms/TextField';
import { ConfirmationPanel } from '../components/molecules/ConfirmationPanel';
import { DateInput, partsToDate, type DateParts } from '../components/molecules/DateInput';
import { PhoneInput } from '../components/molecules/PhoneInput';
import { RadioGroup } from '../components/molecules/RadioGroup';
import { SummaryList } from '../components/molecules/SummaryList';
import { TimeSlotPicker } from '../components/molecules/TimeSlotPicker';
import { ErrorSummary } from '../components/organisms/ErrorSummary';
import { IdleTimeoutDialog } from '../components/organisms/IdleTimeoutDialog';
import { BookingStep } from '../components/templates/BookingStep';
import { SiteLayout } from '../components/templates/SiteLayout';
import { saturdaySlots } from '../fixtures/booking';
import { clinicFooter, clinicHeader } from '../fixtures/site';
import { formatVnPhone, normalizeVnPhone } from '../utils/phone';

const SERVICES = [
  { value: 'da-khoa', label: 'Khám đa khoa', description: 'Khám và tư vấn với bác sĩ gia đình' },
  { value: 'tai-nha', label: 'Khám tại nhà', description: 'Bác sĩ đến nhà trong nội thành Hà Nội' },
  { value: 'tiem-chung', label: 'Tiêm chủng vắc xin', description: 'Trẻ em và người lớn' },
  { value: 'doanh-nghiep', label: 'Khám sức khỏe doanh nghiệp' },
  { value: 'xet-nghiem', label: 'Xét nghiệm tại nhà', description: 'Lấy mẫu tại nhà, trả kết quả trực tuyến' },
  { value: 'bhyt', label: 'Khám BHYT', description: 'Mang theo thẻ bảo hiểm y tế' },
];
const WHO = [
  { value: 'self', label: 'Cho tôi' },
  { value: 'relative', label: 'Cho người thân', description: 'Ví dụ: bố mẹ, ông bà. Bạn nhập thông tin của người đi khám và của bạn để chúng tôi liên hệ.' },
];
const DAY = 'Thứ Bảy, 24 tháng 10, 2026';
const TOTAL = 5;

type Step = 'service' | 'who' | 'time' | 'details' | 'review' | 'done' | 'expired';
type Data = {
  service?: string;
  who?: string;
  time?: string;
  name: string;
  dob: DateParts;
  phone: string;
  contactName: string;
  contactPhone: string;
};
type Errors = Record<string, string>;

const EMPTY: Data = { name: '', dob: { day: '', month: '', year: '' }, phone: '', contactName: '', contactPhone: '' };

function BookingFlow({ timeoutMs = 20 * 60_000, warnBeforeMs = 2 * 60_000 }: { timeoutMs?: number; warnBeforeMs?: number }) {
  const [step, setStep] = useState<Step>('service');
  const [data, setData] = useState<Data>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [fromReview, setFromReview] = useState(false);
  const set = <K extends keyof Data>(k: K, v: Data[K]) => setData((d) => ({ ...d, [k]: v }));

  // Single-page flow: move focus to the new step so screen readers announce it.
  // The confirmation panel focuses its own heading, so skip it there.
  useEffect(() => {
    if (step === 'done') return;
    const main = document.getElementById('main');
    main?.focus();
    main?.scrollIntoView?.({ block: 'start' });
  }, [step]);

  const go = (next: Step) => {
    setErrors({});
    setStep(next);
  };
  const advance = (next: Step) => go(fromReview ? 'review' : next);
  const change = (target: Step) => () => {
    setFromReview(true);
    go(target);
  };
  const summary = (map: Record<string, string>) =>
    Object.keys(errors).length ? <ErrorSummary errors={Object.entries(errors).map(([k, text]) => ({ fieldId: map[k] ?? k, text }))} /> : null;
  const relative = data.who === 'relative';
  const serviceLabel = SERVICES.find((s) => s.value === data.service)?.label ?? '';

  let content;
  switch (step) {
    case 'service':
      content = (
        <BookingStep
          title="Bạn muốn đặt lịch dịch vụ nào?"
          progress={`Bước 1 trên ${TOTAL}`}
          errorSummary={summary({ service: 'service-first' })}
          onContinue={() => (data.service ? advance('who') : setErrors({ service: 'Chọn một dịch vụ' }))}
        >
          <RadioGroup id="service-first" hideLegend label="Dịch vụ" name="service" options={SERVICES} value={data.service} onValueChange={(v) => set('service', v)} error={errors.service} />
        </BookingStep>
      );
      break;
    case 'who':
      content = (
        <BookingStep
          title="Bạn đặt lịch cho ai?"
          progress={`Bước 2 trên ${TOTAL}`}
          onBack={() => go('service')}
          errorSummary={summary({ who: 'who-first' })}
          onContinue={() => (data.who ? advance('time') : setErrors({ who: 'Chọn người đi khám' }))}
        >
          <RadioGroup id="who-first" hideLegend label="Người đi khám" name="who" options={WHO} value={data.who} onValueChange={(v) => set('who', v)} error={errors.who} />
        </BookingStep>
      );
      break;
    case 'time':
      content = (
        <BookingStep
          title="Bạn muốn khám lúc mấy giờ?"
          progress={`Bước 3 trên ${TOTAL}`}
          hint={`${DAY} · ${serviceLabel} · 75 Hồ Mễ Trì`}
          onBack={() => go('who')}
          errorSummary={summary({ time: 'time-first' })}
          onContinue={() => (data.time ? advance('details') : setErrors({ time: 'Chọn một giờ khám còn trống' }))}
        >
          <TimeSlotPicker id="time-first" label="Giờ còn trống" slots={saturdaySlots} value={data.time} onValueChange={(v) => set('time', v)} error={errors.time} />
        </BookingStep>
      );
      break;
    case 'details':
      content = (
        <BookingStep
          title={relative ? 'Thông tin người đi khám' : 'Thông tin của bạn'}
          progress={`Bước 4 trên ${TOTAL}`}
          hint={relative ? 'Nhập thông tin của người đi khám, rồi thông tin của bạn để chúng tôi liên hệ.' : undefined}
          onBack={() => go('time')}
          errorSummary={summary({ dob: 'dob-day' })}
          onContinue={(e: FormEvent<HTMLFormElement>) => {
            void e;
            const next: Errors = {};
            if (!data.name.trim()) next.name = relative ? 'Nhập họ và tên người đi khám' : 'Nhập họ và tên của bạn';
            const birth = partsToDate(data.dob);
            if (!birth) next.dob = 'Nhập ngày sinh có thật, ví dụ 27\u00a03\u00a01950';
            else if (birth > new Date()) next.dob = 'Ngày sinh phải là một ngày trong quá khứ';
            if (!relative && !normalizeVnPhone(data.phone)) next.phone = 'Nhập số điện thoại gồm 10 chữ số, ví dụ 0912\u00a0345\u00a0678';
            if (relative && !data.contactName.trim()) next.contactName = 'Nhập họ và tên của bạn';
            if (relative && !normalizeVnPhone(data.contactPhone)) next.contactPhone = 'Nhập số điện thoại của bạn, gồm 10 chữ số';
            setErrors(next);
            if (!Object.keys(next).length) advance('review');
          }}
        >
          <TextField id="name" label={relative ? 'Họ và tên người đi khám' : 'Họ và tên'} autoComplete={relative ? 'off' : 'name'} value={data.name} onChange={(e) => set('name', e.target.value)} required error={errors.name} />
          <DateInput id="dob" name="dob" label="Ngày sinh" value={data.dob} onValueChange={(v) => set('dob', v)} required error={errors.dob} />
          {relative ? (
            <>
              <TextField id="contactName" label="Họ và tên của bạn (người liên hệ)" autoComplete="name" value={data.contactName} onChange={(e) => set('contactName', e.target.value)} required error={errors.contactName} />
              <PhoneInput id="contactPhone" label="Số điện thoại của bạn" hint={'Chúng tôi gọi số này để xác nhận lịch. Ví dụ: 0912\u00a0345\u00a0678'} value={data.contactPhone} onPhoneChange={(_, raw) => set('contactPhone', raw)} required error={errors.contactPhone} />
            </>
          ) : (
            <PhoneInput id="phone" hint={'Chúng tôi gọi số này để xác nhận lịch. Ví dụ: 0912\u00a0345\u00a0678'} value={data.phone} onPhoneChange={(_, raw) => set('phone', raw)} required error={errors.phone} />
          )}
        </BookingStep>
      );
      break;
    case 'review': {
      const phone = normalizeVnPhone(relative ? data.contactPhone : data.phone);
      const dob = partsToDate(data.dob);
      content = (
        <BookingStep title="Kiểm tra lại thông tin" progress={`Bước 5 trên ${TOTAL}`} onBack={() => go('details')} continueLabel="Xác nhận đặt lịch" onContinue={() => go('done')}>
          <SummaryList
            rows={[
              { key: 'Dịch vụ', value: serviceLabel, onChange: change('service') },
              { key: 'Người đi khám', value: relative ? 'Người thân' : 'Bản thân', onChange: change('who') },
              { key: 'Thời gian', value: `${DAY} lúc ${data.time}`, onChange: change('time') },
              { key: relative ? 'Họ và tên người đi khám' : 'Họ và tên', value: data.name, onChange: change('details') },
              { key: 'Ngày sinh', value: dob ? new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(dob) : '', onChange: change('details') },
              ...(relative ? [{ key: 'Người liên hệ', value: data.contactName, onChange: change('details') }] : []),
              { key: 'Số điện thoại liên hệ', value: phone ? formatVnPhone(phone) : '', onChange: change('details') },
            ]}
          />
          <p>Khi bấm “Xác nhận đặt lịch”, bạn đồng ý để FDC dùng các thông tin trên để liên hệ và chuẩn bị cho buổi khám.</p>
        </BookingStep>
      );
      break;
    }
    case 'done': {
      const phone = normalizeVnPhone(relative ? data.contactPhone : data.phone);
      content = (
        <div style={{ maxWidth: 'var(--measure)', margin: '0 auto', padding: 'var(--space-30) var(--space-15)' }}>
          <ConfirmationPanel title="Đã đặt lịch khám" reference={`FDC-2410-${(data.time ?? '').replace(':', '')}`}>
            <h2>Tiếp theo</h2>
            <p>
              Chúng tôi sẽ gọi số {phone ? formatVnPhone(phone) : ''} trong vòng 30 phút (giờ làm việc) để xác nhận lịch {serviceLabel.toLocaleLowerCase('vi')} lúc {data.time}, {DAY.toLocaleLowerCase('vi')}.
            </p>
            <p>Vui lòng đến trước 15 phút và mang theo giấy tờ tùy thân{data.service === 'bhyt' ? ' và thẻ bảo hiểm y tế' : ''}.</p>
            <p>Muốn đổi hoặc hủy lịch, hãy gọi 024 35 430 430 và đọc mã đặt lịch.</p>
          </ConfirmationPanel>
        </div>
      );
      break;
    }
    case 'expired':
      content = (
        <div style={{ maxWidth: 'var(--measure)', margin: '0 auto', padding: 'var(--space-30) var(--space-15)' }}>
          <h1>Phiên đặt lịch đã tạm dừng</h1>
          <p>Để bảo vệ thông tin, chúng tôi tạm dừng sau một thời gian không hoạt động. Thông tin bạn đã nhập vẫn được giữ trên máy này.</p>
          <p>
            <a href="#" onClick={(e) => { e.preventDefault(); go('service'); }}>Tiếp tục đặt lịch</a> hoặc gọi 024 35 430 430.
          </p>
        </div>
      );
      break;
  }

  return (
    <SiteLayout header={clinicHeader} footer={clinicFooter}>
      {content}
      <IdleTimeoutDialog timeoutMs={timeoutMs} warnBeforeMs={warnBeforeMs} disabled={step === 'done' || step === 'expired'} onTimeout={() => go('expired')} />
    </SiteLayout>
  );
}

const meta = {
  title: 'Pages/Đặt lịch khám/Toàn bộ quy trình',
  component: BookingFlow,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof BookingFlow>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Flow: Story = { name: 'Quy trình đầy đủ' };

export const TimeoutDemo: Story = {
  name: 'Cảnh báo hết phiên (nhanh)',
  args: { timeoutMs: 65_000, warnBeforeMs: 60_000 },
};

const fillToReview = async (canvasElement: HTMLElement) => {
  const canvas = within(canvasElement);
  const next = () => userEvent.click(canvas.getByRole('button', { name: 'Tiếp tục' }));
  await userEvent.click(await canvas.findByRole('radio', { name: 'Khám đa khoa' }));
  await next();
  await userEvent.click(await canvas.findByRole('radio', { name: 'Cho người thân' }));
  await next();
  await userEvent.click(await canvas.findByRole('radio', { name: '09:30' }));
  await next();
  await userEvent.type(await canvas.findByLabelText(/^Họ và tên người đi khám/), 'Nguyễn Thị Ánh Tuyết');
  await userEvent.type(canvas.getByLabelText('Ngày'), '27');
  await userEvent.type(canvas.getByLabelText('Tháng'), '3');
  await userEvent.type(canvas.getByLabelText('Năm'), '1950');
  await userEvent.type(canvas.getByLabelText(/^Họ và tên của bạn/), 'Trần Văn Minh');
  await userEvent.type(canvas.getByLabelText(/^Số điện thoại của bạn/), '0912345678');
  await next();
  await canvas.findByRole('heading', { name: 'Kiểm tra lại thông tin' });
};

export const HappyPath: Story = {
  name: 'Kiểm thử: đặt lịch cho bố mẹ',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await fillToReview(canvasElement);
    await expect(canvas.getByText('Nguyễn Thị Ánh Tuyết')).toBeInTheDocument();
    await expect(canvas.getByText('0912 345 678')).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'Xác nhận đặt lịch' }));
    await waitFor(() => expect(canvas.getByRole('heading', { name: 'Đã đặt lịch khám' })).toHaveFocus());
    await expect(canvas.getByText('FDC-2410-0930')).toBeInTheDocument();
  },
};

export const ChangeFromReview: Story = {
  name: 'Kiểm thử: sửa từ trang kiểm tra',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await fillToReview(canvasElement);
    await userEvent.click(canvas.getByRole('link', { name: 'Thay đổi thời gian' }));
    await userEvent.click(await canvas.findByRole('radio', { name: '14:00' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Tiếp tục' }));
    await expect(await canvas.findByText(`${DAY} lúc 14:00`)).toBeInTheDocument();
    await expect(canvas.getByText('Nguyễn Thị Ánh Tuyết')).toBeInTheDocument();
  },
};

export const MissingChoice: Story = {
  name: 'Kiểm thử: chưa chọn dịch vụ',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(await canvas.findByRole('button', { name: 'Tiếp tục' }));
    const alert = await canvas.findByRole('alert');
    await expect(alert).toHaveTextContent('Chọn một dịch vụ');
    await userEvent.click(within(alert).getByRole('link'));
    await expect(canvas.getByRole('radio', { name: /Khám đa khoa/ })).toHaveFocus();
  },
};
