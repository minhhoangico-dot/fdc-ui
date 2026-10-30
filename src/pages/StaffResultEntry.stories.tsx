import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { Button } from '../components/atoms/Button';
import { Kbd } from '../components/atoms/Kbd';
import { StatusTag } from '../components/atoms/StatusTag';
import { TextField } from '../components/atoms/TextField';
import { VisuallyHidden } from '../components/atoms/VisuallyHidden';
import { FieldRow } from '../components/layout/FieldRow';
import { Inline } from '../components/layout/Inline';
import { Stack } from '../components/layout/Stack';
import { CodeList } from '../components/molecules/CodeList';
import { FormNotice } from '../components/molecules/FormNotice';
import { FormPartNav, type FormPartNavItem } from '../components/molecules/FormPartNav';
import { NumberField } from '../components/molecules/NumberField';
import { RadioGroup } from '../components/molecules/RadioGroup';
import { SaveStatus, type SaveStatusState } from '../components/molecules/SaveStatus';
import { ErrorSummary, type ErrorSummaryItem } from '../components/organisms/ErrorSummary';
import { PatientContextBar } from '../components/organisms/PatientContextBar';
import { StaffLayout } from '../components/templates/StaffLayout';
import { icd10 } from '../fixtures/ksk';
import { staffHeader } from '../fixtures/staff';
import { formatViNumber, parseViNumber } from '../utils/vi';
import styles from './StaffResultEntry.module.css';

const grades = ['I', 'II', 'III', 'IV', 'V'].map((g, i) => ({ value: String(i + 1), label: `Loại ${g}` }));

type PartKey = 'the-luc' | 'ket-luan';
type Values = Record<string, string>;

/** Required items of the two parts built on this page; the label is the field's name inside a sentence. */
const required: Record<PartKey, Array<{ id: string; label: string }>> = {
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

/**
 * The seven parts of the KSK record, as in the hoso drawing. Parts 4 and 7 are built on this page and switch in place;
 * the others are other pages of hoso (links here), with a fixed number of items still to fill ("mục còn thiếu").
 */
type PartDef = { label: string; sub?: string } & ({ key: PartKey } | { anchor: string; missing: number });
const parts: PartDef[] = [
  { label: '1. Hành chính', anchor: 'hanh-chinh', missing: 0 },
  { label: '2. Lần khám', anchor: 'lan-kham', missing: 0 },
  { label: '3. Tiền sử', anchor: 'tien-su', missing: 17 },
  { label: '4. Thể lực', key: 'the-luc' },
  { label: '5. Lâm sàng', anchor: 'lam-sang', missing: 25 },
  { label: '6. Cận lâm sàng', anchor: 'can-lam-sang', missing: 0, sub: '12 chỉ số từ HIS, 09:12' },
  { label: '7. Kết luận', key: 'ket-luan' },
];
const partLabel = (key: PartKey) => parts.find((p) => 'key' in p && p.key === key)?.label ?? '';

/** Values saved before this page was opened: height and weight from the morning's measuring station. */
const savedAtOpen: Values = { 'chieu-cao': '158', 'can-nang': '52,5' };

/** BMI with one decimal always shown ("21,0"). */
const formatBmi = (n: number) => formatViNumber(n, 1, 1);

const linkStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  minBlockSize: 'var(--target-min)',
  color: 'var(--text-link)',
  fontWeight: 600,
} as const;

/** Moves to a field and keeps it clear of the sticky bars (StaffLayout sets the scroll padding). */
function focusField(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.focus({ preventScroll: true });
  el.scrollIntoView?.({ block: 'center' });
}

type PendingSendProps = { name: string; seconds: number };

/**
 * The previous person's record, in its undo window while this person is already being worked on
 * (sending never blocks the next person). The countdown runs down; "Hủy gửi" opens that record again.
 */
function PendingSend({ name, seconds }: PendingSendProps) {
  const [left, setLeft] = useState(seconds);
  const [phase, setPhase] = useState<'waiting' | 'cancelled' | 'sending'>('waiting');
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (phase !== 'waiting') return undefined;
    const tick = window.setInterval(() => setLeft((s) => s - 1), 1000);
    return () => window.clearInterval(tick);
  }, [phase]);
  useEffect(() => {
    if (phase !== 'waiting' || left > 0) return;
    // The button goes away with the window: keep focus in this block rather than dropping it to the page.
    if (box.current?.contains(document.activeElement)) box.current.focus();
    setPhase('sending');
  }, [left, phase]);

  const text =
    phase === 'waiting'
      ? `${name}: chờ gửi lên Sở · còn ${left} giây`
      : phase === 'cancelled'
        ? `Đã hủy gửi. Hồ sơ ${name} mở lại để sửa, chưa có gì lên Sở.`
        : `${name} đã chuyển sang Đang gửi.`;

  return (
    <div ref={box} tabIndex={-1} className={styles.Pending}>
      {/* The countdown changes every second, so the notice is not a live region; the status below announces only the moments. */}
      <FormNotice boxed live={false} notice={{ type: 'info', text }} className={styles.PendingNotice} />
      <VisuallyHidden role="status">
        {phase === 'waiting'
          ? `${name} đang chờ gửi lên Sở; có thể hủy trong ${seconds} giây.`
          : text}
      </VisuallyHidden>
      {phase === 'waiting' ? (
        <Button
          onClick={() => {
            box.current?.focus();
            setPhase('cancelled');
          }}
        >
          Hủy gửi {name}
        </Button>
      ) : null}
    </div>
  );
}

type EntryProps = {
  /** The part on screen when the page opens. Default part 4, Thể lực. */
  part?: PartKey;
  /** Values already saved when the page opens. */
  initial?: Values;
  /** Values typed but not saved yet when the page opens ("ô chưa lưu"). */
  typed?: Values;
  /** Diagnoses already chosen in part 7, as ICD-10 values. */
  diagnoses?: string[];
  /** Every save fails: no network. */
  offline?: boolean;
  /** Chị Mai saved the weight (53 kg) on another computer while this page had 52,5 kg typed and not saved. */
  conflict?: boolean;
  /** The previous person's record, still in its undo window before it goes to the department. */
  pendingSend?: PendingSendProps;
};

function ResultEntry({ part: openPart = 'the-luc', initial = savedAtOpen, typed = {}, diagnoses = [], offline, conflict, pendingSend }: EntryProps) {
  const [part, setPart] = useState<PartKey>(openPart);
  const [values, setValues] = useState<Values>({ ...initial, ...typed });
  const [codes, setCodes] = useState<string[]>(diagnoses);
  const [dirty, setDirty] = useState<Set<string>>(() => new Set([...Object.keys(typed), ...(conflict ? ['can-nang'] : [])]));
  const [saving, setSaving] = useState(false);
  const [failed, setFailed] = useState(false);
  const [savedAt, setSavedAt] = useState('09:12');
  const [conflictOpen, setConflictOpen] = useState(Boolean(conflict));
  const [review, setReview] = useState<{ scope: 'here' | 'others'; errors: ErrorSummaryItem[] } | null>(null);
  const [reviewCount, setReviewCount] = useState(0);
  const [justReviewed, setJustReviewed] = useState(false);
  const timer = useRef<number>();
  const keepWeight = useRef<HTMLButtonElement>(null);

  const markDirty = (id: string) => {
    setDirty((d) => new Set(d).add(id));
    // The summary shrinks as fields are filled, without taking focus back from the field being typed in.
    setJustReviewed(false);
    setReview((r) => {
      if (!r) return r;
      const errors = r.errors.filter((e) => e.fieldId !== id);
      return errors.length ? { ...r, errors } : null;
    });
  };
  const set = (id: string) => (text: string) => {
    setValues((v) => ({ ...v, [id]: text }));
    markDirty(id);
  };

  const missingIn = (key: PartKey) => required[key].filter((f) => !values[f.id]?.trim());
  const missingOf = (p: PartDef) => ('key' in p ? missingIn(p.key).length : p.missing);
  const here = missingIn(part);
  const others = parts.filter((p) => !('key' in p && p.key === part) && missingOf(p) > 0);
  const totalMissing = parts.reduce((n, p) => n + missingOf(p), 0);
  const partsWithMissing = parts.filter((p) => missingOf(p) > 0).length;
  const anchorOf = (p: PartDef) => ('key' in p ? p.key : p.anchor);

  const doSave = () => {
    if (conflictOpen) {
      // Nothing is saved while the weight is undecided: go to the choice instead.
      keepWeight.current?.focus();
      return;
    }
    if (saving || !dirty.size) return;
    // Only what was sent counts as saved: a field typed while the request runs stays "chưa lưu".
    const sent = [...dirty];
    setSaving(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setSaving(false);
      if (offline) {
        setFailed(true);
        return;
      }
      setFailed(false);
      setDirty((d) => new Set([...d].filter((id) => !sent.includes(id))));
      setSavedAt('09:15');
    }, 400);
  };

  const openReview = () => {
    if (conflictOpen) {
      // The only thing to do while the weight is undecided is to decide it (record state "Cần xử lý").
      keepWeight.current?.focus();
      return;
    }
    setReviewCount((c) => c + 1);
    setJustReviewed(true);
    if (here.length) {
      setReview({ scope: 'here', errors: here.map((f) => ({ fieldId: f.id, text: `Điền ${f.label}` })) });
    } else if (others.length) {
      setReview({ scope: 'others', errors: others.map((p) => ({ fieldId: anchorOf(p), text: `${p.label}: còn ${missingOf(p)} mục` })) });
    }
    // Nothing missing: hoso opens the review page (Xem lại trước khi gửi), another sample page.
  };

  const switchPart = (key: PartKey) => {
    setPart(key);
    setReview(null);
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
        openReview();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  });
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const errorFor = (id: string) => (review?.scope === 'here' ? review.errors.find((e) => e.fieldId === id)?.text : undefined);

  // One save line: a conflict or an unsaved change is never reported as saved.
  const status: SaveStatusState = conflictOpen
    ? { state: 'conflict', count: 1, lastSavedAt: savedAt }
    : saving
      ? { state: 'saving' }
      : failed && dirty.size
        ? { state: 'error', reason: 'mất mạng', count: dirty.size }
        : dirty.size
          ? { state: 'unsaved', count: dirty.size, lastSavedAt: savedAt }
          : { state: 'saved', at: savedAt };

  // The main button follows the moment: unsaved → Lưu (Lưu lại after a failed save); saved but items missing →
  // Đến mục còn thiếu; nothing missing → Xem lại trước khi gửi.
  const firstOther = others[0];
  let primary: ReactNode;
  let reviewIsPrimary = false;
  if (conflictOpen) {
    primary = (
      <Button variant="primary" disabledReason="Chọn một giá trị cân nặng trước khi lưu.">
        Lưu
      </Button>
    );
  } else if (dirty.size || saving) {
    primary = (
      <Button variant="primary" onClick={doSave}>
        {failed ? 'Lưu lại' : 'Lưu'}
      </Button>
    );
  } else if (here.length) {
    primary = (
      <Button variant="primary" onClick={() => focusField(here[0].id)}>
        Đến mục còn thiếu
      </Button>
    );
  } else if (firstOther) {
    // This part is done: the first part that still has items. A part built here switches in place; the others are
    // their own pages in hoso.
    primary =
      'key' in firstOther ? (
        <Button variant="primary" onClick={() => switchPart(firstOther.key)}>
          Đến mục còn thiếu
        </Button>
      ) : (
        <Button variant="primary" href={`#${firstOther.anchor}`}>
          Đến mục còn thiếu
        </Button>
      );
  } else {
    reviewIsPrimary = true;
    primary = (
      <Button variant="primary" onClick={openReview}>
        Xem lại trước khi gửi
      </Button>
    );
  }

  const navItems: FormPartNavItem[] = parts.map((p) => {
    const missing = missingOf(p);
    const count = missing ? `còn ${missing}` : undefined;
    if ('key' in p) {
      const current = p.key === part;
      return { label: p.label, count, done: !missing, current, onSelect: current ? undefined : () => switchPart(p.key) };
    }
    return { label: p.label, count, done: !missing, sub: p.sub, href: `#${p.anchor}` };
  });

  const height = parseViNumber(values['chieu-cao'] ?? '');
  const weight = parseViNumber(values['can-nang'] ?? '');
  const bmi = height && weight && !Number.isNaN(height) && !Number.isNaN(weight) ? weight / (height / 100) ** 2 : null;

  const number = (id: string) => ({
    id,
    value: values[id] ?? '',
    onValueChange: (_: number | null, text: string) => set(id)(text),
    error: errorFor(id),
  });

  return (
    <StaffLayout
      header={{
        ...staffHeader,
        collapseOnScroll: true,
        // The thin bar on phones: who this is, without separators that read like stray marks.
        compactBar: (
          <span style={{ display: 'flex', flexDirection: 'column', minInlineSize: 0, lineHeight: 1.3 }}>
            <strong style={{ fontFamily: 'var(--font-heading)' }}>Đặng Thanh Chi</strong>
            <span style={{ display: 'flex', flexWrap: 'wrap', columnGap: 'var(--space-10)', color: 'var(--text-muted)' }}>
              <span>Sinh 07/07/1990</span>
              <span>RD26-0006</span>
            </span>
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
          status={
            conflictOpen ? (
              <StatusTag tone="attention">Cần xử lý · 1 giá trị</StatusTag>
            ) : totalMissing ? (
              <StatusTag>Cần điền · còn {totalMissing} mục</StatusTag>
            ) : (
              <StatusTag>Sẵn sàng xem lại</StatusTag>
            )
          }
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
      aside={<FormPartNav items={navItems} />}
      actionBar={
        <>
          <span style={{ flex: '1 1 auto' }}>
            {totalMissing ? (
              <>
                Còn <strong>{totalMissing} mục</strong>
                <span className={styles.PartsCount}> ở {partsWithMissing} phần</span>
              </>
            ) : (
              'Đã điền đủ các phần'
            )}
          </span>
          <SaveStatus status={status} />
          <div className={styles.Actions}>
            {/* Second button only when it is not the main one, and not while a conflict allows nothing but choosing. */}
            {reviewIsPrimary || conflictOpen ? null : <Button onClick={openReview}>Xem lại trước khi gửi</Button>}
            {primary}
          </div>
        </>
      }
      shortcuts={
        <>
          Phím tắt: <Kbd keys={['Ctrl', 'S']} /> lưu · <Kbd keys={['Ctrl', 'Enter']} /> xem lại trước khi gửi
        </>
      }
    >
      {pendingSend ? <PendingSend {...pendingSend} /> : null}

      {review ? (
        <ErrorSummary
          key={reviewCount}
          layout="inline"
          focusOnMount={justReviewed}
          title={
            review.scope === 'here'
              ? `Còn ${review.errors.length} mục ở phần ${partLabel(part)} trước khi xem lại`
              : `Còn ${others.reduce((n, p) => n + missingOf(p), 0)} mục ở ${others.length} phần khác trước khi xem lại`
          }
          errors={review.errors}
        />
      ) : null}

      <section aria-labelledby="phan-hien-tai" className={styles.Part}>
        <Inline align="baseline" gap={15}>
          <h2 id="phan-hien-tai" style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: '1.375rem', lineHeight: 1.3 }}>
            {partLabel(part)}
          </h2>
          <span style={{ color: 'var(--text-muted)' }}>{here.length ? `Còn ${here.length} mục: ${here.map((m) => m.label).join(', ')}` : 'Đã điền đủ phần này'}</span>
        </Inline>

        {part === 'the-luc' ? (
          <div className={styles.Fields}>
            {conflictOpen ? (
              <Stack gap={10}>
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
                      setConflictOpen(false);
                      set('can-nang')('53');
                      focusField('can-nang');
                    }}
                  >
                    Dùng 53 kg của chị Mai
                  </Button>
                  <Button
                    ref={keepWeight}
                    onClick={() => {
                      setConflictOpen(false);
                      markDirty('can-nang');
                      focusField('can-nang');
                    }}
                  >
                    Giữ 52,5 kg của tôi
                  </Button>
                </Inline>
              </Stack>
            ) : null}

            <FieldRow minColumn="9rem">
              <NumberField {...number('chieu-cao')} label="Chiều cao" unit="cm" example="158" min={50} max={250} />
              <NumberField
                {...number('can-nang')}
                label="Cân nặng"
                unit="kg"
                decimals={1}
                example="52,5"
                min={2}
                max={300}
                hint={conflictOpen ? 'Chị Mai đã lưu 53 kg' : undefined}
              />
              <TextField id="bmi" label="BMI" hint="Tự tính" unit="kg/m²" value={bmi ? formatBmi(bmi) : ''} readOnly />
            </FieldRow>

            <div className={styles.Vitals}>
              <NumberField {...number('mach')} className={styles.Field} label="Mạch" unit="lần/phút" example="78" min={30} max={250} normalRange={[60, 100]} />
              <div role="group" aria-labelledby="huyet-ap" className={styles.Pressure}>
                <span id="huyet-ap" className={styles.GroupLabel}>
                  Huyết áp (mmHg)
                </span>
                <NumberField {...number('ha-thu')} className={styles.Field} label="Tâm thu" example="120" min={50} max={300} normalRange={[90, 139]} />
                <NumberField {...number('ha-truong')} className={styles.Field} label="Tâm trương" example="80" min={30} max={200} normalRange={[60, 89]} />
              </div>
            </div>

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
          </div>
        ) : (
          <div className={styles.Fields}>
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
            <CodeList
              id="benh-tat"
              label="Bệnh, tật"
              hint="Nếu có · thêm được nhiều bệnh"
              options={icd10}
              value={codes}
              onValueChange={(next) => {
                setCodes(next);
                markDirty('benh-tat');
              }}
            />
            <TextField
              id="dien-giai"
              label="Diễn giải trên phiếu (nguyên văn)"
              hint="Không bắt buộc · ghi đúng lời bác sĩ trên phiếu giấy"
              multiline
              rows={3}
              value={values['dien-giai'] ?? ''}
              onChange={(e) => set('dien-giai')(e.target.value)}
            />
            <TextField
              id="loi-khuyen"
              label="Lời khuyên"
              hint={values['loi-khuyen'] ? undefined : 'Chưa điền · ví dụ “Đo lại huyết áp sau 1 tháng”'}
              multiline
              rows={3}
              value={values['loi-khuyen'] ?? ''}
              onChange={(e) => set('loi-khuyen')(e.target.value)}
              error={errorFor('loi-khuyen')}
            />
          </div>
        )}

        <Inline justify="between" gap={15} align="center">
          <a href={part === 'the-luc' ? '#tien-su' : '#can-lam-sang'} style={linkStyle}>
            ‹ {part === 'the-luc' ? '3. Tiền sử' : '6. Cận lâm sàng'}
          </a>
          {part === 'the-luc' ? (
            <a href="#lam-sang" style={linkStyle}>
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

/**
 * Part 4 with height and weight saved: empty fields are grey "Chưa điền · ví dụ 78", never red. BMI is worked out
 * (read-only). Saved but items missing, so the main button is "Đến mục còn thiếu" and takes the cursor to Mạch.
 */
export const TheLuc: Story = {};

/** Typed values: a pulse of 112 and a pressure of 145 get an amber "Cao"; saving goes "2 ô chưa lưu" → "Đang lưu…" → "Đã lưu 09:15". */
export const TheLucDangGo: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole('textbox', { name: 'Mạch' }), '112');
    await userEvent.type(canvas.getByRole('textbox', { name: 'Tâm thu' }), '145');
    const flags = canvas.getAllByText('Cao');
    await expect(flags).toHaveLength(2);
    for (const flag of flags) await expect(flag.closest('[data-component="StatusTag"]')).toHaveAttribute('data-tone', 'attention');
    await expect(canvas.getByText('2 ô chưa lưu')).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'Lưu' }));
    await expect(await canvas.findByText('Đã lưu 09:15')).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Đến mục còn thiếu' })).toBeInTheDocument();
  },
};

/** "Xem lại trước khi gửi" with items still empty: one compact summary above the form, one red line per field, one for the grade group. */
export const XemLaiKhiConThieu: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Xem lại trước khi gửi' }));
    const summary = canvas.getByRole('alert');
    await expect(summary).toHaveTextContent('Còn 4 mục ở phần 4. Thể lực');
    await expect(summary).toHaveAttribute('data-layout', 'inline');
    await expect(summary).toHaveFocus();
  },
};

/** The save failed: the typed data is kept, the save line says so in red, and the one main button reads "Lưu lại". */
export const LuuLoiMatMang: Story = {
  args: { offline: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole('textbox', { name: 'Mạch' }), '78');
    await userEvent.click(canvas.getByRole('button', { name: 'Lưu' }));
    await expect(await canvas.findByText(/Lưu không được: mất mạng/)).toBeInTheDocument();
    await expect(canvas.getAllByRole('button', { name: 'Lưu lại' })).toHaveLength(1);
  },
};

/** No network, and pulse 78 already typed: pressing "Lưu" (or Ctrl + S) fails, for a person to try by hand. */
export const MatMangChuaLuu: Story = { args: { offline: true, typed: { mach: '78' } } };

/**
 * Two people changed the same field: both values are shown and the person chooses; hoso never overwrites silently.
 * Until then the save line reads "Cần xử lý 1 giá trị trước khi lưu", never "Đã lưu", and "Lưu" says why it cannot be used.
 */
export const HaiNguoiCungSua: Story = { args: { conflict: true } };

/** Part 7: several diagnoses by name or ICD-10 code ("tang huyet ap" or "I10"), and the doctor's own words beside them. */
export const KetLuan: Story = {
  args: {
    part: 'ket-luan',
    initial: { ...savedAtOpen, mach: '78', 'ha-thu': '120', 'ha-truong': '80', 'phan-loai-the-luc': '2' },
    diagnoses: ['I10'],
  },
};

/** A phone: the parts are one toggle ("4. Thể lực · còn 4"), so the form starts on the first screen. */
export const DienThoai: Story = { parameters: { viewport: { defaultViewport: 'mobile1' } } };

/**
 * Sending never blocks the next person: Ngô Văn Nam's record is in its undo window while Đặng Thanh Chi is open.
 * The countdown runs down; "Hủy gửi Ngô Văn Nam" opens his record again, and at 0 it moves on to "Đang gửi".
 */
export const SauKhiGui: Story = { args: { pendingSend: { name: 'Ngô Văn Nam', seconds: 22 } } };
