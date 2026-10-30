import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, waitFor, within } from '@storybook/test';
import { Button } from '../components/atoms/Button';
import { Kbd } from '../components/atoms/Kbd';
import { StatusTag } from '../components/atoms/StatusTag';
import { TextField } from '../components/atoms/TextField';
import { TextLink } from '../components/atoms/TextLink';
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
import { ErrorSummary } from '../components/organisms/ErrorSummary';
import { PatientContextBar } from '../components/organisms/PatientContextBar';
import { StaffLayout } from '../components/templates/StaffLayout';
import { icd10 } from '../fixtures/ksk';
import { staffHeader } from '../fixtures/staff';
import { formatViNumber, parseViNumber } from '../utils/vi';
import styles from './StaffResultEntry.module.css';

/** No-break space: keeps a "·" on the line of the words before it, and "còn 22 giây" in one piece. */
const NBSP = '\u00A0';

const grades = ['I', 'II', 'III', 'IV', 'V'].map((g, i) => ({ value: String(i + 1), label: `Loại ${g}` }));

type PartKey = 'the-luc' | 'ket-luan';
type Values = Record<string, string>;

/**
 * Required items of the two parts built on this page. `label` is the field's name inside a sentence ("Điền mạch");
 * `name` is the short name the error summary links with ("Mạch"), so four links share a line.
 */
const required: Record<PartKey, Array<{ id: string; label: string; name: string }>> = {
  'the-luc': [
    { id: 'chieu-cao', label: 'chiều cao', name: 'Chiều cao' },
    { id: 'can-nang', label: 'cân nặng', name: 'Cân nặng' },
    { id: 'mach', label: 'mạch', name: 'Mạch' },
    { id: 'ha-thu', label: 'huyết áp tâm thu', name: 'Tâm thu' },
    { id: 'ha-truong', label: 'huyết áp tâm trương', name: 'Tâm trương' },
    { id: 'phan-loai-the-luc', label: 'phân loại thể lực', name: 'Phân loại thể lực' },
  ],
  'ket-luan': [
    { id: 'phan-loai-suc-khoe', label: 'phân loại sức khỏe', name: 'Phân loại sức khỏe' },
    { id: 'loi-khuyen', label: 'lời khuyên', name: 'Lời khuyên' },
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

/** The weight chị Mai saved on another computer while this page had 52,5 kg typed (the conflict stories). */
const THEIRS = '53';

/** The limits of the height and weight boxes (their NumberField min, max and decimals). BMI is worked out inside them only. */
type Limits = { min: number; max: number; decimals: number };
const limits: Record<'chieu-cao' | 'can-nang', Limits> = {
  'chieu-cao': { min: 50, max: 250, decimals: 0 },
  'can-nang': { min: 2, max: 300, decimals: 1 },
};

/** The number in a box when its NumberField accepts it (a number, inside the limits, no extra decimals); else null. */
function accepted(text: string | undefined, { min, max, decimals }: Limits): number | null {
  const n = parseViNumber(text ?? '');
  if (n === null || Number.isNaN(n) || n < min || n > max) return null;
  return (String(n).split('.')[1] ?? '').length > decimals ? null : n;
}

/** BMI with one decimal always shown ("21,0"). */
const formatBmi = (n: number) => formatViNumber(n, 1, 1);
/** The BMI hint: one line in every column (a two-line hint would push the row's boxes down, or move them when it comes). */
const BMI_DONE = 'Tự tính';
const BMI_WAITING = 'Tự tính khi đủ số đo';

const ADVICE_EXAMPLE = `ví${NBSP}dụ “Đo lại huyết áp sau 1 tháng”`;
const ADVICE_EMPTY = `Chưa điền${NBSP}· ${ADVICE_EXAMPLE}`;

/** The part's heading: it takes focus when a part is chosen in the side list. */
const PART_HEADING = 'phan-hien-tai';
/** The conflict's question: Ctrl + S and Ctrl + Enter bring focus here during a conflict, not to one of its answers. */
const CONFLICT = 'xung-dot-can-nang';

const PHONE_UP = '(min-width: 40rem)';
const DESKTOP_UP = '(min-width: 64rem)';
const mediaMatches = (query: string) => typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia(query).matches;

/** Whether a media query matches, following changes (false where there is no window). */
function useMedia(query: string) {
  const [on, setOn] = useState(() => mediaMatches(query));
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return undefined;
    const mq = window.matchMedia(query);
    const update = () => setOn(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [query]);
  return on;
}

/** Moves to a field or block and keeps it clear of the sticky bars (StaffLayout keeps the scroll padding measured). */
function focusField(id: string, block: ScrollLogicalPosition = 'center') {
  const el = document.getElementById(id);
  if (!el) return;
  el.focus({ preventScroll: true });
  el.scrollIntoView?.({ block });
}

type PendingSendProps = { name: string; seconds: number };

/**
 * The previous person's record, in its undo window while this person is already being worked on (sending never blocks
 * the next person). The countdown runs down on screen only. A hidden status says the start and the end, each once, and
 * is emptied after it has spoken, so a screen reader never finds stale seconds in the page or the same words twice.
 * "Hủy gửi" opens that record again and offers the way to it; at 0 the record moves on to "Đang gửi", with the way to
 * its sending status. When the button goes, focus moves to the link that takes its place.
 */
function PendingSend({ name, seconds }: PendingSendProps) {
  const [left, setLeft] = useState(seconds);
  const [phase, setPhase] = useState<'waiting' | 'cancelled' | 'sending'>('waiting');
  const [said, setSaid] = useState('');
  const box = useRef<HTMLDivElement>(null);
  const link = useRef<HTMLAnchorElement>(null);
  const focusLink = useRef(false);

  useEffect(() => {
    if (phase !== 'waiting') return undefined;
    const tick = window.setInterval(() => setLeft((s) => s - 1), 1000);
    return () => window.clearInterval(tick);
  }, [phase]);
  useEffect(() => {
    if (phase !== 'waiting' || left > 0) return;
    focusLink.current = Boolean(box.current?.contains(document.activeElement));
    setPhase('sending');
  }, [left, phase]);
  useEffect(() => {
    if (!focusLink.current) return;
    focusLink.current = false;
    link.current?.focus();
  }, [phase]);

  const text =
    phase === 'waiting'
      ? `${name}: chờ gửi lên Sở${NBSP}· còn${NBSP}${left}${NBSP}giây`
      : phase === 'cancelled'
        ? `Đã hủy gửi. Hồ sơ ${name} mở lại để sửa, chưa có gì lên Sở.`
        : `${name} đã chuyển sang Đang gửi.`;
  // The moment in words without seconds, so nothing in it goes stale.
  const moment = phase === 'waiting' ? `${name} đang chờ gửi lên Sở; còn hủy được.` : text;

  useEffect(() => {
    // A live region speaks what changes: the start a moment after the page opens, each end at once; then it is emptied.
    const say = window.setTimeout(() => setSaid(moment), phase === 'waiting' ? 500 : 0);
    const clear = window.setTimeout(() => setSaid(''), 5000);
    return () => {
      window.clearTimeout(say);
      window.clearTimeout(clear);
    };
  }, [moment, phase]);

  return (
    <div ref={box} className={styles.Pending}>
      {/* The countdown changes every second, so the notice is not a live region; the status below speaks the moments. */}
      <FormNotice boxed live={false} notice={{ type: 'info', text }} className={styles.PendingNotice} />
      <VisuallyHidden role="status">{said}</VisuallyHidden>
      {phase === 'waiting' ? (
        <Button
          onClick={() => {
            focusLink.current = true;
            setPhase('cancelled');
          }}
        >
          Hủy gửi {name}
        </Button>
      ) : (
        <TextLink ref={link} href="#" arrow={false}>
          {phase === 'cancelled' ? `Mở hồ sơ ${name}` : 'Xem trạng thái gửi'}
        </TextLink>
      )}
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

/** What a press of "Xem lại" or "Lưu" found missing: links for the summary, and each field's own message. */
type Review = { scope: 'here' | 'others'; items: Array<{ fieldId: string; text: string; message?: string }> };

function ResultEntry({ part: openPart = 'the-luc', initial = savedAtOpen, typed = {}, diagnoses = [], offline, conflict, pendingSend }: EntryProps) {
  const [part, setPart] = useState<PartKey>(openPart);
  const [values, setValues] = useState<Values>({ ...initial, ...typed });
  const [codes, setCodes] = useState<string[]>(diagnoses);
  const [dirty, setDirty] = useState<Set<string>>(() => new Set([...Object.keys(typed), ...(conflict ? ['can-nang'] : [])]));
  const [saving, setSaving] = useState(false);
  const [failed, setFailed] = useState(false);
  const [savedAt, setSavedAt] = useState('09:12');
  const [conflictOpen, setConflictOpen] = useState(Boolean(conflict));
  // Set by a press of "Xem lại" or "Lưu" only, and unchanged while the person types or leaves fields (GOV.UK):
  // nothing above or below a field moves while they work in it.
  const [review, setReview] = useState<Review | null>(null);
  const [reviewCount, setReviewCount] = useState(0);
  const [justReviewed, setJustReviewed] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const timer = useRef<number>();
  const pendingFocus = useRef<{ id: string; block: ScrollLogicalPosition } | null>(null);
  const phoneUp = useMedia(PHONE_UP);

  /** Focus `id` once the next render is on screen (a part switched in, or the conflict block gone). */
  const focusAfterRender = (id: string, block: ScrollLogicalPosition = 'center') => {
    pendingFocus.current = { id, block };
  };
  useEffect(() => {
    const next = pendingFocus.current;
    if (!next) return;
    pendingFocus.current = null;
    // One frame later: after FormPartNav's own focus move, which runs right after onSelect.
    window.requestAnimationFrame(() => focusField(next.id, next.block));
  });

  const markDirty = (id: string) => setDirty((d) => new Set(d).add(id));
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
  /** Where "Đến mục còn thiếu" lands in a part built here: its first empty item, or its heading. */
  const firstMissingIn = (key: PartKey) => missingIn(key)[0]?.id ?? PART_HEADING;

  const reviewOf = (scope: Review['scope']): Review | null => {
    if (scope === 'here') {
      return here.length ? { scope, items: here.map((f) => ({ fieldId: f.id, text: f.name, message: `Điền ${f.label}` })) } : null;
    }
    return others.length ? { scope, items: others.map((p) => ({ fieldId: anchorOf(p), text: `${p.label}: còn ${missingOf(p)}` })) } : null;
  };

  const switchPart = (key: PartKey, focusId?: string) => {
    setPart(key);
    setReview(null);
    if (focusId) focusAfterRender(focusId, focusId === PART_HEADING ? 'nearest' : 'center');
  };

  const doSave = () => {
    if (conflictOpen) {
      // Nothing is saved while the weight is undecided: go to the question, not to one of its answers.
      focusField(CONFLICT);
      return;
    }
    // "Lưu" checks again too: an open summary drops what is filled now (it never changes while typing).
    setJustReviewed(false);
    setReview((r) => (r ? reviewOf(r.scope) : r));
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
      focusField(CONFLICT);
      return;
    }
    setReviewCount((c) => c + 1);
    setJustReviewed(true);
    // Nothing missing anywhere: hoso opens the review page (Xem lại trước khi gửi), another sample page.
    setReview(reviewOf(here.length ? 'here' : 'others'));
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

  const errorFor = (id: string) => (review?.scope === 'here' ? review.items.find((e) => e.fieldId === id)?.message : undefined);

  // One save line: a conflict or an unsaved change is never reported as saved. On a phone the conflict line keeps to
  // one line, so the last save time is left out there.
  const status: SaveStatusState = conflictOpen
    ? { state: 'conflict', count: 1, lastSavedAt: phoneUp ? savedAt : undefined }
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
    // This part is done: the first part that still has items. A part built here switches in place, with focus on its
    // first empty item; the others are their own pages in hoso.
    primary =
      'key' in firstOther ? (
        <Button variant="primary" onClick={() => switchPart(firstOther.key, firstMissingIn(firstOther.key))}>
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
      // From 64rem the list stays on screen: focus moves to the new part's heading, so the change is heard. On a phone
      // FormPartNav returns focus to its toggle, which names the new part.
      const onSelect = () => switchPart(p.key, mediaMatches(DESKTOP_UP) ? PART_HEADING : undefined);
      return { label: p.label, count, done: !missing, current, onSelect: current ? undefined : onSelect };
    }
    return { label: p.label, count, done: !missing, sub: p.sub, href: `#${p.anchor}` };
  });

  /** A summary link to a part built on this page switches to it: the browser cannot follow it, the part is not in the page yet. */
  const onSummaryClick = (e: MouseEvent<HTMLDivElement>) => {
    const href = (e.target as HTMLElement).closest('a')?.getAttribute('href');
    const target = parts.find((p) => 'key' in p && `#${p.key}` === href);
    if (!target || !('key' in target)) return;
    e.preventDefault();
    switchPart(target.key, firstMissingIn(target.key));
  };

  const height = accepted(values['chieu-cao'], limits['chieu-cao']);
  const weight = accepted(values['can-nang'], limits['can-nang']);
  const bmi = height !== null && weight !== null ? weight / (height / 100) ** 2 : null;
  const mine = values['can-nang'] ?? '';

  const number = (id: string) => ({
    id,
    value: values[id] ?? '',
    onValueChange: (_: number | null, text: string) => set(id)(text),
    error: errorFor(id),
  });

  const adviceFilled = Boolean(values['loi-khuyen']?.trim());

  return (
    <StaffLayout
      header={{
        ...staffHeader,
        collapseOnScroll: true,
        // The thin bar on phones: the name, then each fact as a whole chunk (Header keeps each on one line).
        compactBar: (
          <>
            <strong>Đặng Thanh Chi</strong>
            <span>Sinh 07/07/1990</span>
            <span>RD26-0006</span>
          </>
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
              <Button icon="simple-left" href="#" aria-label="Người trước: Ngô Văn Nam">
                Người trước
              </Button>
              <Button icon="simple-right" iconPosition="end" href="#" aria-label="Người sau: Nguyễn Thị Mai Anh">
                Người sau
              </Button>
            </>
          }
        />
      }
      aside={<FormPartNav items={navItems} />}
      actionBar={
        <>
          {/* From 40rem only: on a phone the part toggle and the context bar's state say what is left, and the bar
              keeps to the save line and one row of buttons. */}
          <span className={styles.Count}>
            {totalMissing ? (
              <>
                Còn <strong>{totalMissing} mục</strong> ở {partsWithMissing} phần
              </>
            ) : (
              'Đã điền đủ các phần'
            )}
          </span>
          <SaveStatus status={status} className={styles.Save} />
          <div className={styles.Actions}>
            {/* Second button only when it is not the main one, and not while a conflict allows nothing but choosing.
                On a phone it reads "Xem lại"; its name stays "Xem lại trước khi gửi". */}
            {reviewIsPrimary || conflictOpen ? null : (
              <Button onClick={openReview}>
                Xem lại <span className={styles.WideWords}>trước khi gửi</span>
              </Button>
            )}
            {primary}
          </div>
        </>
      }
      shortcuts={
        <span className={styles.Shortcuts}>
          <span>Phím tắt:</span>{' '}
          <span className={styles.Shortcut}>
            <Kbd keys={['Ctrl', 'S']} /> lưu
          </span>{' '}
          <span className={styles.Shortcut}>
            <Kbd keys={['Ctrl', 'Enter']} /> xem lại trước khi gửi
          </span>
        </span>
      }
    >
      {pendingSend ? <PendingSend {...pendingSend} /> : null}

      {review ? (
        // Reads the clicks of the links inside (Enter on a link is a click too); it is not a control of its own.
        <div onClick={onSummaryClick}>
          <ErrorSummary
            key={reviewCount}
            layout="inline"
            focusOnMount={justReviewed}
            title={
              review.scope === 'here'
                ? `Còn ${review.items.length} mục chưa điền`
                : `Còn ${others.reduce((n, p) => n + missingOf(p), 0)} mục ở ${others.length} phần khác`
            }
            errors={review.items.map(({ fieldId, text }) => ({ fieldId, text }))}
          />
        </div>
      ) : null}

      <section aria-labelledby={PART_HEADING} className={styles.Part}>
        <Inline align="baseline" gap={15}>
          <h2 id={PART_HEADING} tabIndex={-1} className={styles.PartTitle}>
            {partLabel(part)}
          </h2>
          {/* A count, not the list of names: a line that shortened as fields were filled would move the form under it. */}
          <span className={styles.PartLeft}>{here.length ? `Còn ${here.length} mục` : 'Đã điền đủ phần này'}</span>
        </Inline>

        {part === 'the-luc' ? (
          <div className={styles.Fields}>
            {conflictOpen ? (
              <Stack gap={10}>
                {/* The question takes focus on Ctrl + S or Ctrl + Enter; both answers are described by it. */}
                <div id={CONFLICT} tabIndex={-1} role="group" aria-labelledby={CONFLICT} className={styles.Conflict}>
                  <FormNotice
                    boxed
                    notice={{
                      type: 'warning',
                      text: `Cân nặng: chị Mai vừa lưu ${THEIRS} kg lúc 09:14 ở máy khác. Ô này của chị đang là ${mine} kg, chưa lưu. Chọn một giá trị; hoso không tự ghi đè.`,
                    }}
                  />
                </div>
                <Inline gap={10}>
                  <Button
                    aria-describedby={CONFLICT}
                    onClick={() => {
                      setConflictOpen(false);
                      set('can-nang')(THEIRS);
                      focusAfterRender('can-nang');
                    }}
                  >
                    Dùng {THEIRS} kg của chị Mai
                  </Button>
                  <Button
                    aria-describedby={CONFLICT}
                    onClick={() => {
                      setConflictOpen(false);
                      markDirty('can-nang');
                      focusAfterRender('can-nang');
                    }}
                  >
                    Giữ {mine} kg của tôi
                  </Button>
                </Inline>
              </Stack>
            ) : null}

            <FieldRow minColumn="9rem">
              <NumberField {...number('chieu-cao')} label="Chiều cao" unit="cm" example="158" {...limits['chieu-cao']} />
              {/* Read-only until a value is chosen: typing here would not settle the conflict. */}
              <NumberField
                {...number('can-nang')}
                label="Cân nặng"
                unit="kg"
                example="52,5"
                {...limits['can-nang']}
                readOnly={conflictOpen}
                hint={conflictOpen ? `Chị Mai: ${THEIRS} kg` : undefined}
              />
              {/* Worked out, not typed: out of the Tab order, still read in the page. Empty until both numbers are
                  accepted, so "1,58" typed as metres never shows a BMI of 210302,8. */}
              <TextField
                id="bmi"
                label="BMI"
                hint={bmi === null ? BMI_WAITING : BMI_DONE}
                reserve={[BMI_DONE, BMI_WAITING]}
                unit="kg/m²"
                value={bmi === null ? '' : formatBmi(bmi)}
                readOnly
                tabIndex={-1}
              />
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

            {/* No "Chưa chọn" hint: an empty group already shows it, and a hint that went on choosing would move the options. */}
            <RadioGroup
              id="phan-loai-the-luc"
              label="Phân loại thể lực"
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
              hint="Nếu có. Thêm được nhiều bệnh."
              options={icd10}
              value={codes}
              onValueChange={(next) => {
                setCodes(next);
                markDirty('benh-tat');
              }}
            />
            {/* Free text grows with what is typed (3 lines at least), so a note copied from paper can be checked whole. */}
            <TextField
              id="dien-giai"
              label="Diễn giải trên phiếu (nguyên văn)"
              hint="Không bắt buộc. Ghi đúng lời bác sĩ trên phiếu giấy."
              multiline
              rows={5}
              className={styles.Grow}
              value={values['dien-giai'] ?? ''}
              onChange={(e) => set('dien-giai')(e.target.value)}
            />
            {/* One message line that keeps its room: "Chưa điền · ví dụ …" while empty, the example while typing,
                nothing once filled and left, the error alone after a press of "Xem lại". Nothing under it moves. */}
            <TextField
              id="loi-khuyen"
              label="Lời khuyên"
              hint={!adviceFilled ? ADVICE_EMPTY : focused === 'loi-khuyen' ? ADVICE_EXAMPLE : undefined}
              reserve={[ADVICE_EMPTY, { error: 'Điền lời khuyên' }]}
              multiline
              rows={5}
              className={styles.Grow}
              value={values['loi-khuyen'] ?? ''}
              onChange={(e) => set('loi-khuyen')(e.target.value)}
              onFocus={() => setFocused('loi-khuyen')}
              onBlur={() => setFocused(null)}
              error={errorFor('loi-khuyen')}
            />
          </div>
        )}

        <Inline justify="between" gap={15} align="center">
          <TextLink href={part === 'the-luc' ? '#tien-su' : '#can-lam-sang'} arrow="back">
            {part === 'the-luc' ? '3. Tiền sử' : '6. Cận lâm sàng'}
          </TextLink>
          {part === 'the-luc' ? (
            <TextLink href="#lam-sang" arrow="next">
              5. Lâm sàng
            </TextLink>
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
 * (read-only, not a Tab stop). Saved but items missing, so the main button is "Đến mục còn thiếu" and takes the cursor to Mạch.
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

/**
 * Vitals saved outside the normal range (mạch 112, huyết áp 145/95): each gets the amber "Cao" tag in its message line,
 * never red and never beside the box, so the three boxes keep their width and line up.
 */
export const ChiSoCao: Story = {
  args: { initial: { ...savedAtOpen, mach: '112', 'ha-thu': '145', 'ha-truong': '95' } },
};

/**
 * "Xem lại trước khi gửi" with items still empty: one compact summary above the form ("Còn 4 mục chưa điền", links by
 * the fields' short names), one red line per field, one for the grade group, and no grey hint next to an error.
 */
export const XemLaiKhiConThieu: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Xem lại trước khi gửi' }));
    const summary = canvas.getByRole('alert');
    await expect(summary).toHaveTextContent('Còn 4 mục chưa điền');
    await expect(summary).toHaveAttribute('data-layout', 'inline');
    await expect(summary).toHaveFocus();
    const links = within(summary).getAllByRole('link').map((a) => a.textContent);
    await expect(links).toEqual(['Mạch', 'Tâm thu', 'Tâm trương', 'Phân loại thể lực']);
    const grade = canvas.getByRole('group', { name: 'Phân loại thể lực' });
    await expect(grade).toHaveTextContent('Điền phân loại thể lực');
    await expect(grade).not.toHaveTextContent('Chưa chọn');
  },
};

/**
 * After "Xem lại" the errors stay as they were while the person types and leaves fields: nothing moves, the summary
 * keeps its links. The next press of "Lưu" (Ctrl + S) or "Xem lại" updates both, without taking focus from the field.
 */
export const XemLaiRoiDien: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Xem lại trước khi gửi' }));
    const pulse = canvas.getByRole('textbox', { name: 'Mạch' });
    // Measured from the top of the main area, so a page scroll or the header shrinking does not count as a move.
    const main = canvasElement.querySelector('main') as HTMLElement;
    const offset = () => pulse.getBoundingClientRect().top - main.getBoundingClientRect().top;
    const before = offset();
    await userEvent.type(pulse, '78');
    await userEvent.tab();
    await expect(offset()).toBe(before);
    await expect(within(canvas.getByRole('alert')).getAllByRole('link')).toHaveLength(4);
    await expect(pulse).toHaveAccessibleDescription(/Điền mạch/);
    await userEvent.click(pulse);
    await userEvent.keyboard('{Control>}s{/Control}');
    await waitFor(() => expect(within(canvas.getByRole('alert')).getAllByRole('link')).toHaveLength(3));
    await expect(pulse).toHaveFocus();
    await expect(pulse).not.toHaveAttribute('aria-invalid');
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
 * Until then the weight box is read-only, the save line reads "Cần xử lý 1 giá trị trước khi lưu", never "Đã lưu",
 * and "Lưu" says why it cannot be used.
 */
export const HaiNguoiCungSua: Story = { args: { conflict: true } };

/**
 * Ctrl + S during the conflict saves nothing and moves focus to the question, not to one of its answers, so a single
 * Enter never overwrites a colleague's value. Both answers are described by the question.
 */
export const HaiNguoiCungSuaBamLuu: Story = {
  args: { conflict: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const height = canvas.getByRole('textbox', { name: 'Chiều cao' });
    await userEvent.click(height);
    await userEvent.keyboard('{Control>}s{/Control}');
    const question = canvas.getByRole('group', { name: /chị Mai vừa lưu 53 kg/ });
    await expect(question).toHaveFocus();
    await expect(canvas.getByRole('textbox', { name: 'Cân nặng' })).toHaveAttribute('readonly');
    for (const name of ['Dùng 53 kg của chị Mai', 'Giữ 52,5 kg của tôi']) {
      await expect(canvas.getByRole('button', { name })).toHaveAccessibleDescription(/hoso không tự ghi đè/);
    }
    await expect(canvas.getByText(/Cần xử lý 1 giá trị/)).toBeInTheDocument();
  },
};

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
 * The countdown runs down; "Hủy gửi Ngô Văn Nam" opens his record again and offers "Mở hồ sơ Ngô Văn Nam"; at 0 it
 * moves on to "Đang gửi", with "Xem trạng thái gửi".
 */
export const SauKhiGui: Story = { args: { pendingSend: { name: 'Ngô Văn Nam', seconds: 22 } } };
