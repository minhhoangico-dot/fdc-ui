import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { TextField } from '../components/atoms/TextField';
import { DateInput, partsToDate, type DateParts } from '../components/molecules/DateInput';
import { PhoneInput } from '../components/molecules/PhoneInput';
import { TimeSlotPicker, type TimeSlot } from '../components/molecules/TimeSlotPicker';
import { ErrorSummary } from '../components/organisms/ErrorSummary';
import { BookingStep } from '../components/templates/BookingStep';
import { normalizeVnPhone } from '../utils/phone';
import { fullyBooked, longPatientName, saturdaySlots } from '../fixtures/booking';

function ChooseTime({ slots }: { slots: TimeSlot[] }) {
  const [time, setTime] = useState<string>();
  const [error, setError] = useState<string>();
  const [done, setDone] = useState(false);
  return (
    <BookingStep
      title="Bạn muốn khám lúc mấy giờ?"
      progress="Bước 2 trên 4"
      hint="Thứ Bảy, 24 tháng 10, 2026 · Khám đa khoa · 75 Hồ Mễ Trì"
      backHref="#"
      errorSummary={error ? <ErrorSummary errors={[{ fieldId: 'slot-first', text: error }]} /> : null}
      onContinue={() => {
        if (!time) setError('Chọn một giờ khám còn trống');
        else {
          setError(undefined);
          setDone(true);
        }
      }}
    >
      <TimeSlotPicker id="slot-first" label="Giờ còn trống" slots={slots} value={time} onValueChange={setTime} error={error} />
      {done ? <p role="status">Đã chọn {time}. Bước tiếp theo: thông tin người bệnh.</p> : null}
    </BookingStep>
  );
}

function PatientDetails({ defaultName = '' }: { defaultName?: string }) {
  const [dob, setDob] = useState<DateParts>({ day: '', month: '', year: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  return (
    <BookingStep
      title="Thông tin người bệnh"
      progress="Bước 3 trên 4"
      hint="Nếu bạn đặt lịch cho bố mẹ, hãy nhập thông tin của bố mẹ."
      backHref="#"
      errorSummary={
        Object.keys(errors).length ? (
          <ErrorSummary errors={Object.entries(errors).map(([fieldId, text]) => ({ fieldId: fieldId === 'dob' ? 'dob-day' : fieldId, text }))} />
        ) : null
      }
      onContinue={(e) => {
        const f = e.currentTarget.elements as unknown as Record<string, HTMLInputElement>;
        const next: Record<string, string> = {};
        if (!f.name.value.trim()) next.name = 'Nhập họ và tên người bệnh';
        const birth = partsToDate(dob);
        if (!birth) next.dob = 'Nhập ngày sinh có thật, ví dụ 27\u00a03\u00a01950';
        else if (birth > new Date()) next.dob = 'Ngày sinh phải là một ngày trong quá khứ';
        if (!normalizeVnPhone(f.phone.value)) next.phone = 'Nhập số điện thoại gồm 10 chữ số, ví dụ 0912\u00a0345\u00a0678';
        setErrors(next);
      }}
    >
      <TextField id="name" name="name" label="Họ và tên người bệnh" autoComplete="name" defaultValue={defaultName} required error={errors.name} />
      <DateInput id="dob" name="dob" label="Ngày sinh" value={dob} onValueChange={setDob} required error={errors.dob} />
      <PhoneInput id="phone" name="phone" label="Số điện thoại liên hệ" hint={'Chúng tôi gọi số này để xác nhận lịch. Ví dụ: 0912\u00a0345\u00a0678'} required error={errors.phone} />
    </BookingStep>
  );
}

const meta = {
  title: 'Pages/Đặt lịch khám',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const ChooseTimeStep: Story = { name: 'Bước 2 · Chọn giờ', render: () => <ChooseTime slots={saturdaySlots} /> };
export const ChooseTimeFullyBooked: Story = { name: 'Bước 2 · Hết chỗ', render: () => <ChooseTime slots={fullyBooked} /> };
export const ChooseTimeMissing: Story = {
  name: 'Bước 2 · Chưa chọn giờ',
  render: () => <ChooseTime slots={saturdaySlots} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Tiếp tục' }));
    await expect(await canvas.findByRole('alert')).toHaveTextContent('Chọn một giờ khám còn trống');
  },
};
export const PatientDetailsStep: Story = { name: 'Bước 3 · Thông tin', render: () => <PatientDetails /> };
export const PatientDetailsLongName: Story = { name: 'Bước 3 · Tên dài', render: () => <PatientDetails defaultName={longPatientName} /> };
