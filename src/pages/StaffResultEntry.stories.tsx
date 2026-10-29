import { useEffect, useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { Button } from '../components/atoms/Button';
import { Kbd } from '../components/atoms/Kbd';
import { StatusTag } from '../components/atoms/StatusTag';
import { TextField } from '../components/atoms/TextField';
import { FieldRow } from '../components/layout/FieldRow';
import { Inline } from '../components/layout/Inline';
import { Combobox } from '../components/molecules/Combobox';
import { FormNotice } from '../components/molecules/FormNotice';
import { NumberField } from '../components/molecules/NumberField';
import { RadioGroup } from '../components/molecules/RadioGroup';
import { SaveStatus, type SaveStatusState } from '../components/molecules/SaveStatus';
import { ErrorSummary } from '../components/organisms/ErrorSummary';
import { PatientContextBar } from '../components/organisms/PatientContextBar';
import { StaffLayout } from '../components/templates/StaffLayout';
import { icd10 } from '../fixtures/ksk';
import { staffHeader } from '../fixtures/staff';
import { formatViNumber, parseViNumber } from '../utils/vi';

const grades = ['I', 'II', 'III', 'IV', 'V'].map((g, i) => ({ value: String(i + 1), label: `Loại ${g}` }));

type Part = 'the-luc' | 'ket-luan';
type Values = Record<string, string>;

const required: Record<Part, Array<{ id: string; label: string }>> = {
  'the-luc': [
    { id: 'chieu-cao', label: 'chiều cao' },
    { id: 'can-nang', label: 'cân nặng' },
    { id: 'mach', label: 'mạch' },
    { id: 'ha-thu', label: 'huyết áp tâm thu' },
    { id: 'ha-truong', label: 'huyết áp tâm trương' },
    { id: 'phan-loai-the-luc', label: 'phân loại thể lực' },
  ],
  'ket-luan': [
    { id: 'phan-loai-suc-khoe', label: 'phân loại sức khỏe' },
    { id: 'loi-khuyen', label: 'lời khuyên' },
  ],
};

/** Items still to fill in the other parts of the form ("mục còn thiếu"), as in the hoso drawing. */
const otherParts = [
  { label: '1. Hành chính', missing: 0 },
  { label: '2. Lần khám', missing: 0 },
  { label: '3. Tiền sử', missing: 17 },
  { label: '5. Lâm sàng', missing: 25 },
  { label: '6. Cận lâm sàng', missing: 0, sub: '12 chỉ số từ HIS, 09:12' },
];

type EntryProps = {
  part?: Part;
  initial?: Values;
  /** The save fails: no network. */
  offline?: boolean;
  /** Another person saved the weight on another computer. */
  conflict?: boolean;
};

function ResultEntry({ part = 'the-luc', initial = { 'chieu-cao': '158', 'can-nang': '52,5' }, offline, conflict }: EntryProps) {
  const [values, setValues] = useState<Values>(initial);
  const [dirty, setDirty] = useState<Set<string>>(new Set());
  const [save, setSave] = useState<SaveStatusState>({ state: 'saved', at: '09:12' });
  const [reviewErrors, setReviewErrors] = useState<Array<{ fieldId: string; text: string }>>([]);
  const [showConflict, setShowConflict] = useState(Boolean(conflict));
  const timer = useRef<number>();

  const set = (id: string) => (text: string) => {
    setValues((v) => ({ ...v, [id]: text }));
    setDirty((d) => new Set(d).add(id));
    setReviewErrors((errs) => errs.filter((e) => e.fieldId !== id));
  };
  useEffect(() => {
    if (dirty.size) setSave((s) => (s.state === 'saving' ? s : { state: 'unsaved', count: dirty.size, lastSavedAt: '09:12' }));
  }, [dirty]);

  const missing = required[part].filter((f) => !values[f.id]?.trim());
  const totalMissing = missing.length + otherParts.reduce((n, p) => n + p.missing, 0) + (part === 'the-luc' ? 2 : 4);
  const partsWithMissing = 3 + (missing.length ? 1 : 0);

  const doSave = () => {
    if (!dirty.size) return;
    setSave({ state: 'saving' });
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      if (offline) setSave({ state: 'error', reason: 'mất mạng', count: dirty.size });
      else {
        setDirty(new Set());
        setSave({ state: 'saved', at: '09:15' });
      }
    }, 400);
  };

  const review = () => {
    setReviewErrors(missing.map((f) => ({ fieldId: f.id, text: `Điền ${f.label}` })));
  };

  useEffect(() => {
    // Ctrl combinations only: single letters fire by accident while typing Vietnamese (Telex).
    const onKey = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        doSave();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        review();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  });
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const errorFor = (id: string) => reviewErrors.find((e) => e.fieldId === id)?.text;
  const height = parseViNumber(values['chieu-cao'] ?? '');
  const weight = parseViNumber(values['can-nang'] ?? '');
  const bmi = height && weight && !Number.isNaN(height) && !Number.isNaN(weight) ? weight / (height / 100) ** 2 : null;

  const partLink = (label: string, count: string, current?: boolean, sub?: string, done?: boolean) => (
    <a
      key={label}
      href="#"
      aria-current={current ? 'step' : undefined}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: 'var(--space-10)',
        alignItems: 'center',
        minBlockSize: 'var(--target-min)',
        padding: 'var(--space-5) var(--space-15)',
        color: 'var(--text-default)',
        textDecoration: 'none',
        background: current ? 'var(--surface-selected)' : undefined,
        boxShadow: current ? 'inset var(--border-width-heavy) 0 0 var(--border-brand)' : undefined,
        fontWeight: current ? 600 : 400,
      }}
    >
      <span style={{ display: 'flex', flexDirection: 'column' }}>
        <span>{label}</span>
        {sub ? <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{sub}</span> : null}
      </span>
      <span style={{ whiteSpace: 'nowrap', fontWeight: 600, color: done ? 'var(--status-success-text)' : 'var(--text-default)' }}>{count}</span>
    </a>
  );

  const thisPart = part === 'the-luc' ? '4. Thể lực' : '7. Kết luận';
  const aside = (
    <div style={{ display: 'flex', flexDirection: 'column', padding: 'var(--space-5) 0', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
      {[
        ...otherParts.slice(0, 3).map((p) => partLink(p.label, p.missing ? `còn ${p.missing}` : 'Đủ', false, undefined, !p.missing)),
        part === 'the-luc'
          ? partLink('4. Thể lực', missing.length ? `còn ${missing.length}` : 'Đủ', true, undefined, !missing.length)
          : partLink('4. Thể lực', 'còn 2'),
        ...otherParts.slice(3).map((p) => partLink(p.label, p.missing ? `còn ${p.missing}` : 'Đủ', false, p.sub, !p.missing)),
        part === 'ket-luan'
          ? partLink('7. Kết luận', missing.length ? `còn ${missing.length}` : 'Đủ', true, undefined, !missing.length)
          : partLink('7. Kết luận', 'còn 2'),
      ]}
    </div>
  );

  return (
    <StaffLayout
      header={{
        ...staffHeader,
        collapseOnScroll: true,
        compactBar: (
          <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.3 }}>
            <strong style={{ fontFamily: 'var(--font-heading)' }}>Đặng Thanh Chi</strong>
            <span style={{ color: 'var(--text-muted)' }}>07/07/1990 · RD26-0006</span>
          </span>
        ),
      }}
      context={
        <PatientContextBar
          sticky
          name="Đặng Thanh Chi"
          sex="Nữ"
          birthDate="07/07/1990"
          ageOn={new Date(2026, 9, 10)}
          idEnd="0006"
          recordCode="RD26-0006"
          organization="Công ty TNHH Rạng Đông"
          breadcrumb={[
            { label: 'Việc của tôi', href: '#' },
            { label: 'Rạng Đông KSK 2026', href: '#' },
            { label: 'Người 6 / 2.033' },
          ]}
          status={<StatusTag tone={reviewErrors.length ? 'error' : 'neutral'}>{reviewErrors.length ? 'Cần sửa' : 'Cần điền'} · còn {totalMissing} mục</StatusTag>}
          actions={
            <>
              <Button icon="simple-left" href="#">
                Người trước
              </Button>
              <Button icon="simple-right" href="#">
                Người sau cần làm
              </Button>
            </>
          }
        />
      }
      aside={aside}
      actionBar={
        <>
          <span style={{ flex: '1 1 auto' }}>
            Còn <strong>{totalMissing} mục</strong> ở {partsWithMissing} phần
          </span>
          <SaveStatus status={save} onRetry={doSave} />
          {/* The main button follows the moment: unsaved → Lưu; saved but missing → Tiếp tục điền; complete → Xem lại. */}
          <Inline gap={10}>
            {dirty.size || missing.length ? <Button onClick={review}>Xem lại trước khi gửi</Button> : null}
            {dirty.size ? (
              <Button variant="primary" onClick={doSave}>
                Lưu
              </Button>
            ) : missing.length ? (
              <Button variant="primary" onClick={() => document.getElementById(missing[0].id)?.focus()}>
                Tiếp tục điền
              </Button>
            ) : (
              <Button variant="primary" onClick={review}>
                Xem lại trước khi gửi
              </Button>
            )}
          </Inline>
        </>
      }
      shortcuts={
        <>
          Phím tắt: <Kbd keys={['Ctrl', 'S']} /> lưu · <Kbd keys={['Ctrl', 'Enter']} /> xem lại trước khi gửi
        </>
      }
    >
      {reviewErrors.length ? <ErrorSummary title={`Còn ${reviewErrors.length} mục ở phần ${thisPart} trước khi xem lại`} errors={reviewErrors} /> : null}

      <section
        aria-labelledby="phan-hien-tai"
        style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-20)', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: 'var(--space-20)' }}
      >
        <Inline align="baseline" gap={15}>
          <h2 id="phan-hien-tai" style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: '1.375rem', lineHeight: 1.3 }}>
            {thisPart}
          </h2>
          <span style={{ color: 'var(--text-muted)' }}>{missing.length ? `Còn ${missing.length} mục: ${missing.map((m) => m.label).join(', ')}` : 'Đã điền đủ phần này'}</span>
        </Inline>

        {part === 'the-luc' ? (
          <>
            {showConflict ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-10)' }}>
                <FormNotice
                  boxed
                  notice={{
                    type: 'warning',
                    text: 'Cân nặng: chị Mai vừa lưu 53 kg lúc 09:14 ở máy khác. Ô này của chị đang là 52,5 kg, chưa lưu. Chọn một giá trị; hoso không tự ghi đè.',
                  }}
                />
                <Inline gap={10}>
                  <Button
                    onClick={() => {
                      set('can-nang')('53');
                      setShowConflict(false);
                    }}
                  >
                    Dùng 53 kg của chị Mai
                  </Button>
                  <Button onClick={() => setShowConflict(false)}>Giữ 52,5 kg của tôi</Button>
                </Inline>
              </div>
            ) : null}
            <FieldRow minColumn="13rem">
              <NumberField id="chieu-cao" label="Chiều cao" unit="cm" example="158" min={50} max={250} value={values['chieu-cao'] ?? ''} onValueChange={(_, t) => set('chieu-cao')(t)} error={errorFor('chieu-cao')} />
              <NumberField id="can-nang" label="Cân nặng" unit="kg" decimals={1} example="52,5" min={2} max={300} value={values['can-nang'] ?? ''} onValueChange={(_, t) => set('can-nang')(t)} error={errorFor('can-nang')} />
              <TextField label="BMI" hint="Tự tính từ chiều cao và cân nặng" value={bmi ? formatViNumber(bmi) : ''} placeholder="Chưa đủ số đo" readOnly />
            </FieldRow>
            <FieldRow minColumn="13rem">
              <NumberField id="mach" label="Mạch" unit="lần/phút" example="78" min={30} max={250} normalRange={[60, 100]} value={values.mach ?? ''} onValueChange={(_, t) => set('mach')(t)} error={errorFor('mach')} />
              <NumberField id="ha-thu" label="Huyết áp tâm thu" unit="mmHg" example="120" min={50} max={300} normalRange={[90, 139]} value={values['ha-thu'] ?? ''} onValueChange={(_, t) => set('ha-thu')(t)} error={errorFor('ha-thu')} />
              <NumberField id="ha-truong" label="Huyết áp tâm trương" unit="mmHg" example="80" min={30} max={200} normalRange={[60, 89]} value={values['ha-truong'] ?? ''} onValueChange={(_, t) => set('ha-truong')(t)} error={errorFor('ha-truong')} />
            </FieldRow>
            <RadioGroup
              id="phan-loai-the-luc"
              label="Phân loại thể lực"
              hint={values['phan-loai-the-luc'] ? undefined : 'Chưa chọn'}
              name="phan-loai-the-luc"
              layout="row"
              density="compact"
              options={grades}
              value={values['phan-loai-the-luc']}
              onValueChange={set('phan-loai-the-luc')}
              error={errorFor('phan-loai-the-luc')}
            />
          </>
        ) : (
          <>
            <RadioGroup
              id="phan-loai-suc-khoe"
              label="Phân loại sức khỏe"
              hint={values['phan-loai-suc-khoe'] ? undefined : 'Chưa chọn'}
              name="phan-loai-suc-khoe"
              layout="row"
              density="compact"
              options={grades}
              value={values['phan-loai-suc-khoe']}
              onValueChange={set('phan-loai-suc-khoe')}
              error={errorFor('phan-loai-suc-khoe')}
            />
            <FieldRow minColumn="20rem">
              <Combobox
                id="benh-tat"
                label="Bệnh, tật (nếu có)"
                options={icd10}
                value={values['benh-tat'] || null}
                onValueChange={(v) => set('benh-tat')(v ?? '')}
              />
              <TextField
                id="loi-khuyen"
                label="Lời khuyên"
                hint={values['loi-khuyen'] ? undefined : 'Chưa điền · ví dụ “Đo lại huyết áp sau 1 tháng”'}
                value={values['loi-khuyen'] ?? ''}
                onChange={(e) => set('loi-khuyen')(e.target.value)}
                error={errorFor('loi-khuyen')}
              />
            </FieldRow>
          </>
        )}

        <Inline justify="between" gap={15} align="center">
          <a href="#" style={{ fontWeight: 600, color: 'var(--text-link)', minBlockSize: 'var(--target-min)', display: 'inline-flex', alignItems: 'center' }}>
            ‹ {part === 'the-luc' ? '3. Tiền sử' : '6. Cận lâm sàng'}
          </a>
          {part === 'the-luc' ? (
            <a href="#" style={{ fontWeight: 600, color: 'var(--text-link)', minBlockSize: 'var(--target-min)', display: 'inline-flex', alignItems: 'center' }}>
              5. Lâm sàng ›
            </a>
          ) : null}
        </Inline>
      </section>
    </StaffLayout>
  );
}

const meta = {
  title: 'Pages/Nhân viên/Nhập kết quả',
  component: ResultEntry,
  parameters: { layout: 'fullscreen', density: 'compact' },
} satisfies Meta<typeof ResultEntry>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Part 4 with height and weight typed: empty fields are grey "Chưa điền · ví dụ 78", never red. */
export const TheLuc: Story = {};

/** Typed values: a pulse of 112 gets the word "Cao" next to it; saving goes "8 ô chưa lưu" → "Đang lưu…" → "Đã lưu 09:15". */
export const TheLucDangGo: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole('textbox', { name: 'Mạch' }), '112');
    await userEvent.type(canvas.getByRole('textbox', { name: 'Huyết áp tâm thu' }), '145');
    await expect(canvas.getAllByText('Cao')).toHaveLength(2);
    await expect(canvas.getByText('2 ô chưa lưu')).toBeInTheDocument();
  },
};

/** "Xem lại trước khi gửi" with items still empty: one summary at the top, one red line per field, one for the grade group. */
export const XemLaiKhiConThieu: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Xem lại trước khi gửi' }));
    await expect(canvas.getByRole('alert')).toHaveTextContent('Còn 4 mục ở phần 4. Thể lực');
  },
};

/** The save failed: the typed data is kept and "Lưu lại" tries again. */
export const LuuLoiMatMang: Story = {
  args: { offline: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole('textbox', { name: 'Mạch' }), '78');
    await userEvent.click(canvas.getByRole('button', { name: 'Lưu' }));
    await expect(await canvas.findByText(/Lưu không được: mất mạng/)).toBeInTheDocument();
  },
};

/** Two people changed the same field: show both values and let the person choose; never overwrite silently. */
export const HaiNguoiCungSua: Story = { args: { conflict: true } };

/** Part 7: the diagnosis is chosen by name or ICD-10 code ("tang huyet ap" or "I10"). */
export const KetLuan: Story = { args: { part: 'ket-luan', initial: { 'benh-tat': 'I10' } } };

export const DienThoai: Story = { parameters: { viewport: { defaultViewport: 'mobile1' } } };
