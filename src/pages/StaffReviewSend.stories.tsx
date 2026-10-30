import { useEffect, useRef, useState, type ReactNode, type Ref } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, waitFor, within } from '@storybook/test';
import { Button } from '../components/atoms/Button';
import { Checkbox } from '../components/atoms/Checkbox';
import { StatusTag, type StatusTagTone } from '../components/atoms/StatusTag';
import { VisuallyHidden } from '../components/atoms/VisuallyHidden';
import { Inline } from '../components/layout/Inline';
import { Breadcrumb } from '../components/molecules/Breadcrumb';
import { ConfirmationPanel, type ConfirmationStep, type ConfirmationTone } from '../components/molecules/ConfirmationPanel';
import { FormNotice, type FormNoticeValue } from '../components/molecules/FormNotice';
import { SummaryList, type SummaryRow } from '../components/molecules/SummaryList';
import { DataTable } from '../components/organisms/DataTable';
import { PatientContextBar } from '../components/organisms/PatientContextBar';
import { StaffLayout } from '../components/templates/StaffLayout';
import { labResults } from '../fixtures/ksk';
import { staffHeader } from '../fixtures/staff';
import styles from './StaffReviewSend.module.css';

/**
 * Where the record is (README, record states v2.4). Each phase is one real event:
 * review and stale can be sent; waiting is the undo window; sending has no answer yet; accepted has the department's
 * receipt; rejected came back with a reason; unknown had no answer in time, so the department may hold it already.
 */
type Phase = 'review' | 'waiting' | 'sending' | 'accepted' | 'rejected' | 'unknown' | 'stale';

/** The record's state tag. "Chờ gửi" has no countdown here: the panel says how long is left. */
const tags: Record<Phase, { label: string; tone: StatusTagTone }> = {
  review: { label: 'Sẵn sàng xem lại', tone: 'neutral' },
  stale: { label: 'Sẵn sàng xem lại', tone: 'neutral' },
  waiting: { label: 'Chờ gửi', tone: 'info' },
  sending: { label: 'Đang gửi', tone: 'info' },
  accepted: { label: 'Sở đã tiếp nhận', tone: 'success' },
  rejected: { label: 'Bị từ chối', tone: 'error' },
  unknown: { label: 'Chưa rõ kết quả', tone: 'attention' },
};

const canSend = (p: Phase) => p === 'review' || p === 'stale';
/** A refusal opens the record again for a fix; while waiting or sending nothing may change. */
const canEdit = (p: Phase) => canSend(p) || p === 'rejected';

/** The person after Ngô Văn Nam in the batch (the same sample facts on every staff page). */
const NEXT_PERSON = 'Đặng Thanh Chi';

/**
 * Step lines (ConfirmationPanel, decision of v2.4): done steps say what happened, the step being waited for says
 * "Chờ …", later steps are plain event names. The panel adds the state in words for screen readers.
 */
const steps: Record<'waiting' | 'sending' | 'accepted' | 'rejected' | 'unknown', ConfirmationStep[]> = {
  waiting: [
    { label: 'Đã xem lại', state: 'done' },
    { label: 'Chờ gửi', state: 'current' },
    { label: 'Sở tiếp nhận', state: 'todo' },
    { label: 'Bộ xác nhận', state: 'todo' },
  ],
  sending: [
    { label: 'Đã xem lại', state: 'done' },
    { label: 'Đã gửi lên Sở', state: 'done' },
    { label: 'Chờ Sở trả lời', state: 'current' },
    { label: 'Bộ xác nhận', state: 'todo' },
  ],
  accepted: [
    { label: 'Đã xem lại', state: 'done' },
    { label: 'Đã gửi lên Sở', state: 'done' },
    { label: 'Sở đã tiếp nhận', state: 'done' },
    { label: 'Chờ Bộ xác nhận', state: 'current' },
  ],
  rejected: [
    { label: 'Đã gửi lên Sở', state: 'done' },
    { label: 'Sở từ chối', state: 'failed' },
    { label: 'Chờ chị sửa', state: 'current' },
    { label: 'Xem lại', state: 'todo' },
    { label: 'Gửi lại', state: 'todo' },
  ],
  unknown: [
    { label: 'Đã xem lại', state: 'done' },
    { label: 'Đã gửi lên Sở', state: 'done' },
    { label: 'Chờ Sở trả lời', state: 'current' },
    { label: 'Bộ xác nhận', state: 'todo' },
  ],
};

const history = [
  'Có ai trong gia đình mắc một trong các bệnh: truyền nhiễm, tim mạch, đái tháo đường, lao, hen phế quản, ung thư, động kinh, rối loạn tâm thần không',
  'Có bệnh hay bị thương trong 5 năm qua',
  'Có bệnh thần kinh hay bị thương ở đầu',
  'Bệnh mắt hoặc giảm thị lực (trừ trường hợp đeo kính thuốc)',
  'Bệnh ở tai, giảm sức nghe hoặc thăng bằng',
  'Bệnh ở tim, hoặc nhồi máu cơ tim, các bệnh tim mạch khác',
  'Phẫu thuật can thiệp tim – mạch (thay van, bắc cầu nối, tạo hình mạch, máy tạo nhịp, đặt stent mạch, ghép tim)',
  'Tăng huyết áp',
  'Khó thở',
  'Bệnh phổi, hen, khí phế thũng, viêm phế quản mạn tính',
  'Bệnh thận, lọc máu',
  'Nghiện rượu, bia',
  'Đái tháo đường hoặc kiểm soát tăng đường huyết',
  'Bệnh tâm thần',
  'Mất ý thức, rối loạn ý thức',
  'Ngất, chóng mặt',
  'Bệnh tiêu hóa',
  'Rối loạn giấc ngủ, ngừng thở khi ngủ, ngủ rũ ban ngày, ngáy to',
  'Tai biến mạch máu não hoặc liệt',
  'Bệnh hoặc tổn thương cột sống',
  'Sử dụng rượu thường xuyên, liên tục',
  'Sử dụng ma túy và chất gây nghiện',
  'Bệnh khác',
  'Hiện tại có đang điều trị bệnh gì không?',
  'Tiền sử thai sản',
].map((q, i) => ({ n: i + 1, q, yes: i === 7 }));

const abnormalLabs = labResults.filter((r) => r.flag);
const manualLabs = labResults.filter((r) => r.source === 'Nhập tay');

/** A code after its name, in brackets and lighter: "Tăng huyết áp (I10)". It never breaks across lines. */
const code = (c: string) => <span className={styles.Code}>({c})</span>;
/** A value outside the normal range: amber "Cao"/"Thấp", never red (it is not an input error). */
const flag = (word: string) => (
  <StatusTag tone="attention" size="sm">
    {word}
  </StatusTag>
);

function partRows(phase: Phase): SummaryRow[] {
  const changeHref = canEdit(phase) ? '#' : undefined;
  const stale = phase === 'stale';
  return [
    {
      key: '1. Hành chính',
      value: (
        <span className={styles.Lines}>
          <span>Nam, sinh 15/03/1990, CCCD …0004</span>
          <span>Phường Đại Mỗ, Hà Nội</span>
          <span>Kỹ sư, nhóm nghề Nhà chuyên môn bậc cao {code('2')}</span>
        </span>
      ),
      changeHref,
    },
    { key: '2. Lần khám', value: '10/10/2026 08:15, khám sức khỏe định kỳ', changeHref },
    {
      key: '3. Tiền sử',
      value: <>25 câu: Không, trừ Tăng huyết áp {code('I10')}</>,
      changeHref,
      detailsLabel: 'Xem 25 câu',
      details: (
        // Inside the card: rows and dividers only, no second box (DataTable variant="plain").
        <DataTable
          variant="plain"
          caption="25 câu tiền sử"
          minWidth="30rem"
          stackBelow="phone"
          columns={[
            { key: 'q', header: 'Câu hỏi', cell: (r) => `${r.n}. ${r.q}`, rowHeader: true },
            {
              key: 'a',
              header: 'Trả lời',
              nowrap: true,
              width: '8rem',
              cell: (r) =>
                r.yes ? (
                  <>
                    <strong>Có</strong> {code('I10')}
                  </>
                ) : (
                  'Không'
                ),
            },
          ]}
          rows={history}
          getRowKey={(r) => String(r.n)}
        />
      ),
    },
    {
      key: '4. Thể lực',
      value: (
        // The anchor of "Xem phần 4. Thể lực" when someone changed this part after the page was opened.
        <span className={styles.Lines} id="phan-4-the-luc">
          {stale ? (
            <>
              <span>
                Cân nặng <strong>66 kg</strong>{' '}
                <StatusTag tone="info" size="sm">
                  Chị Mai sửa 09:14
                </StatusTag>
              </span>
              <span>Chiều cao 170 cm, BMI 22,8</span>
            </>
          ) : (
            <span>Chiều cao 170 cm, cân nặng 65 kg, BMI 22,5</span>
          )}
          <span>
            Mạch 78 lần/phút, huyết áp{' '}
            <span className={styles.Whole}>
              <strong>145/90</strong> mmHg {flag('Cao')}
            </span>
          </span>
          <span>Thể lực loại II</span>
        </span>
      ),
      changeHref,
    },
    { key: '5. Lâm sàng', value: '25 mục, không mục nào bất thường (chị Lan nhập từng mục)', changeHref },
    {
      key: '6. Cận lâm sàng',
      // The source sits next to the data: which person and visit HIS gave, when, and what was typed by hand.
      // Facts are whole chunks set apart by space, never by "·", so no line starts or ends with a stray mark.
      value: (
        <span className={styles.Lines}>
          <span>
            12 chỉ số từ HIS, <span className={styles.Whole}>lấy lúc 09:12</span>
          </span>
          <span className={styles.Facts}>
            <span>Ngô Văn Nam</span>
            <span>Sinh 15/03/1990</span>
            <span>Lượt khám 10/10/2026 08:15</span>
          </span>
          <span>
            <span className={styles.Whole}>X-quang tim phổi</span> nhập tay
          </span>
        </span>
      ),
      changeHref,
      detailsLabel: 'Xem 12 chỉ số và X-quang',
      defaultDetailsOpen: true,
      details: (
        <DataTable
          variant="plain"
          caption="Kết quả cận lâm sàng"
          minWidth="30rem"
          stackBelow="phone"
          columns={[
            { key: 'name', header: 'Chỉ số', cell: (r) => r.name, rowHeader: true },
            {
              key: 'value',
              header: 'Kết quả',
              align: 'end',
              cell: (r) => (
                <>
                  {r.value}
                  {r.unit ? ` ${r.unit}` : ''}
                  {r.flag ? <> {flag(r.flag)}</> : null}
                </>
              ),
            },
            {
              key: 'source',
              header: 'Nguồn',
              nowrap: true,
              cell: (r) =>
                r.source === 'HIS' ? (
                  'HIS'
                ) : (
                  <>
                    <StatusTag tone="muted" size="sm">
                      Nhập tay
                    </StatusTag>{' '}
                    {r.by}
                  </>
                ),
            },
          ]}
          rows={labResults}
          getRowKey={(r) => r.name}
        />
      ),
    },
    {
      key: '7. Kết luận',
      // Every field of part 7, with the entry page's own names, so nothing is sent unseen.
      value: (
        <div className={styles.Lines}>
          {phase === 'rejected' ? (
            <span>
              Phân loại sức khỏe: <strong>chưa có</strong>{' '}
              <StatusTag tone="error" size="sm">
                Sở trả lại
              </StatusTag>
            </span>
          ) : (
            <span>Phân loại sức khỏe: Loại II</span>
          )}
          <span>Bệnh, tật:</span>
          <ul className={styles.SubList}>
            <li>Tăng huyết áp vô căn (nguyên phát) {code('I10')}</li>
            <li>Đái tháo đường type 2 {code('E11')}</li>
          </ul>
          <span>Diễn giải trên phiếu (nguyên văn): “Theo dõi huyết áp và đường huyết, khám lại sau 3 tháng.”</span>
          <span>Lời khuyên: “Đo lại huyết áp sau 1 tháng; ăn nhạt, bớt đồ ngọt.”</span>
        </div>
      ),
      changeHref,
    },
  ];
}

/** The way on after a send: staff never wait for the department; the record stays findable in the list. */
function NextPerson({ line, variant = 'primary' }: { line?: ReactNode; variant?: 'primary' | 'neutral' }) {
  return (
    <Inline gap={15}>
      {/* The entry page's words ("Người sau", arrow after) plus the person, so it is one 44px line at 390px.
          On a narrower phone it breaks after the colon, never inside the name. */}
      <Button variant={variant} href="#" icon="simple-right" iconPosition="end">
        Người sau: <span className={styles.Whole}>{NEXT_PERSON}</span>
      </Button>
      {line ? <span>{line}</span> : null}
    </Inline>
  );
}

type NoticeOutcomeProps = {
  tone: Extract<ConfirmationTone, 'error' | 'attention'>;
  title: string;
  steps: ConfirmationStep[];
  focusOnMount: boolean;
  /** What happened and what comes next, in sentences. */
  children: ReactNode;
  /** The main button: open the part to fix, or check the status. */
  primary: ReactNode;
};

/**
 * A refusal or an unknown outcome: a pale panel whose title is the state (an h2, so heading navigation finds it),
 * the department's words, the main button, asking Minh (which can be taken back), and the way on to the next person.
 */
function NoticeOutcome({ tone, title, steps: outcomeSteps, focusOnMount, children, primary }: NoticeOutcomeProps) {
  const [asked, setAsked] = useState(false);
  return (
    <ConfirmationPanel tone={tone} headingLevel={2} title={title} steps={outcomeSteps} focusOnMount={focusOnMount}>
      {children}
      <Inline gap={10}>
        {primary}
        {/* The same button changes its words, so focus stays on it. */}
        <Button onClick={() => setAsked((v) => !v)}>{asked ? 'Hủy yêu cầu' : 'Nhờ Minh kiểm tra'}</Button>
      </Inline>
      <FormNotice notice={asked ? { type: 'info', text: 'Đã nhờ Minh kiểm tra lúc 09:42. Minh trả lời trong hoso; chị làm người khác trong lúc chờ.' } : null} />
      <NextPerson variant="neutral" />
    </ConfirmationPanel>
  );
}

/** A notice block that is not a send result (changed record, cancelled send): its own h2, then the boxed notice. */
function NoticeBlock({ id, title, notice, headingRef, children }: { id: string; title: string; notice: FormNoticeValue; headingRef?: Ref<HTMLHeadingElement>; children?: ReactNode }) {
  return (
    <section aria-labelledby={id} className={styles.Outcome}>
      <h2 id={id} ref={headingRef} tabIndex={headingRef ? -1 : undefined} className={styles.H2}>
        {title}
      </h2>
      {/* Not live: the page's status line announces the moment once. */}
      <FormNotice boxed live={false} notice={notice} />
      {children}
    </section>
  );
}

function ReviewSend({ initialPhase = 'review', initialTicked = false, undoSeconds = 30 }: { initialPhase?: Phase; initialTicked?: boolean; undoSeconds?: number }) {
  const [phase, setPhase] = useState<Phase>(initialPhase);
  const [ticked, setTicked] = useState(initialTicked);
  const [left, setLeft] = useState(undoSeconds);
  const [checking, setChecking] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  // Focus moves to a new result's heading only after the person acted, or when focus was inside the result that
  // went away. A page opened on a result does not jump.
  const [moveFocus, setMoveFocus] = useState(false);
  // The one status line that is always on the page: it announces the moments (start, end, cancel), never the seconds.
  const [said, setSaid] = useState('');
  const outcomeRef = useRef<HTMLDivElement>(null);
  const cancelledRef = useRef<HTMLHeadingElement>(null);

  // The undo window counts down; at 0 the record goes to the department and can no longer be cancelled.
  useEffect(() => {
    if (phase !== 'waiting') return undefined;
    if (left <= 0) {
      // "Hủy gửi" goes away with the window: if focus was in the panel, the next panel's heading takes it.
      setMoveFocus(Boolean(outcomeRef.current?.contains(document.activeElement)));
      setPhase('sending');
      setSaid('Đã chuyển sang Đang gửi');
      return undefined;
    }
    const t = window.setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => window.clearTimeout(t);
  }, [phase, left]);

  // Once read out, the status line is emptied, so a screen reader reading the page later meets no stale sentence.
  useEffect(() => {
    if (!said) return undefined;
    const t = window.setTimeout(() => setSaid(''), 8000);
    return () => window.clearTimeout(t);
  }, [said]);

  // "Kiểm tra lại trạng thái": in this sample the department answers that it holds the record.
  useEffect(() => {
    if (!checking) return undefined;
    const t = window.setTimeout(() => {
      setChecking(false);
      setPhase('accepted');
    }, 800);
    return () => window.clearTimeout(t);
  }, [checking]);

  // After "Hủy gửi" the panel and its button are gone: focus the heading that says nothing was sent.
  useEffect(() => {
    if (cancelled) cancelledRef.current?.focus();
  }, [cancelled]);

  const sendable = canSend(phase);
  const tag = tags[phase];
  const trail = [
    { label: 'Việc của tôi', href: '#' },
    { label: 'Rạng Đông KSK 2026', href: '#' },
    { label: 'Ngô Văn Nam', href: '#' },
    { label: sendable ? 'Xem lại trước khi gửi' : 'Trạng thái gửi' },
  ];

  // Each result is its own panel (key per phase), so its heading takes focus when it replaces the one before.
  let outcome: ReactNode = null;
  if (phase === 'waiting') {
    outcome = (
      <ConfirmationPanel key="waiting" tone="pending" headingLevel={2} title="Chờ gửi lên Sở" steps={steps.waiting} focusOnMount={moveFocus}>
        {/* The seconds are here, not in the heading: a focused heading keeps one name while the count runs. */}
        <Inline gap={15}>
          <span>
            <strong className={styles.Seconds}>Còn {left} giây để hủy.</strong> Chưa có gì lên Sở.
          </span>
          <Button
            onClick={() => {
              setPhase('review');
              setLeft(undoSeconds);
              setCancelled(true);
              setSaid('Đã hủy gửi. Chưa có gì lên Sở; hồ sơ mở lại để chị sửa.');
            }}
          >
            Hủy gửi
          </Button>
        </Inline>
        <NextPerson line="Hồ sơ vẫn ở nhóm Đang gửi; hủy được từ đầu trang người sau." />
      </ConfirmationPanel>
    );
  } else if (phase === 'sending') {
    outcome = (
      <ConfirmationPanel key="sending" tone="pending" headingLevel={2} title="Đang gửi lên Sở" steps={steps.sending} focusOnMount={moveFocus}>
        <p>Hồ sơ đã gửi lên Sở lúc 09:31, không hủy được nữa. Sở thường trả lời trong vài phút.</p>
        {/* Where each answer lands in the list (the list's groups, v2.4). */}
        <p>Khi Sở trả lời, hồ sơ ở danh sách:</p>
        <ul className={styles.Answers}>
          <li>Sở tiếp nhận: nhóm Sở đã tiếp nhận.</li>
          <li>Bị từ chối: nhóm Cần điền hoặc sửa, kèm lý do của Sở.</li>
          <li>Chưa rõ kết quả: vẫn ở nhóm Đang gửi; mở hồ sơ để kiểm tra lại trạng thái.</li>
        </ul>
        <NextPerson />
      </ConfirmationPanel>
    );
  } else if (phase === 'accepted') {
    outcome = (
      <ConfirmationPanel
        key="accepted"
        emphasis="subtle"
        headingLevel={2}
        title="Sở đã tiếp nhận"
        reference="SYT-HN-2026-118204"
        referenceLabel="Mã tiếp nhận của Sở"
        steps={steps.accepted}
        focusOnMount={moveFocus}
      >
        <p>Bộ Y tế chưa xác nhận. Khi Bộ xác nhận, trạng thái đổi thành “Bộ đã xác nhận”; chị không cần làm gì thêm.</p>
        <NextPerson />
      </ConfirmationPanel>
    );
  } else if (phase === 'rejected') {
    outcome = (
      <NoticeOutcome
        key="rejected"
        tone="error"
        title="Bị từ chối"
        steps={steps.rejected}
        focusOnMount={moveFocus}
        primary={
          <Button variant="primary" href="#">
            Mở phần 7. Kết luận để sửa
          </Button>
        }
      >
        <p>Sở trả lại hồ sơ lúc 09:32. Lý do của Sở: “Thiếu kết luận phân loại sức khỏe”. Chưa có gì được ghi nhận.</p>
        {/* The way back after the fix, said once: fix, save, review, send again. */}
        <p>Sau khi sửa và lưu, hồ sơ chuyển sang nhóm Sẵn sàng xem lại: chị xem lại rồi gửi lại.</p>
      </NoticeOutcome>
    );
  } else if (phase === 'unknown') {
    // No "Gửi lại" here: the department may already hold the record, and a second send makes a duplicate.
    outcome = (
      <NoticeOutcome
        key="unknown"
        tone="attention"
        title="Chưa rõ kết quả"
        steps={steps.unknown}
        focusOnMount={moveFocus}
        primary={
          <Button
            variant="primary"
            loading={checking}
            loadingLabel="Đang hỏi Sở…"
            onClick={() => {
              setMoveFocus(true);
              setChecking(true);
            }}
          >
            Kiểm tra lại trạng thái
          </Button>
        }
      >
        <p>Đã gửi lúc 09:31 nhưng Sở chưa trả lời sau 10 phút. Sở có thể đã nhận hồ sơ, nên chưa gửi lại để tránh gửi trùng.</p>
        <p>Hồ sơ vẫn ở nhóm Đang gửi cho đến khi Sở trả lời.</p>
      </NoticeOutcome>
    );
  } else if (phase === 'stale') {
    outcome = (
      <NoticeBlock
        key="stale"
        id="ho-so-vua-doi"
        title="Hồ sơ vừa đổi"
        notice={{
          type: 'warning',
          text: 'Chưa gửi gì. Chị Mai vừa sửa phần 4. Thể lực lúc 09:14, sau khi chị mở trang này: cân nặng từ 65\u00a0kg thành 66\u00a0kg.',
        }}
      >
        <Inline gap={10}>
          <Button href="#phan-4-the-luc">Xem phần 4. Thể lực</Button>
        </Inline>
      </NoticeBlock>
    );
  } else if (cancelled) {
    outcome = (
      <NoticeBlock
        key="cancelled"
        id="da-huy-gui"
        title="Đã hủy gửi"
        headingRef={cancelledRef}
        notice={{ type: 'info', text: 'Chưa có gì lên Sở; hồ sơ mở lại để chị sửa.' }}
      />
    );
  }

  return (
    <StaffLayout
      header={{
        ...staffHeader,
        // Phones: the header sticks and shrinks to a thin bar that keeps who is being reviewed in view.
        collapseOnScroll: true,
        compactBar: (
          <>
            <strong>Ngô Văn Nam</strong>
            <span>Sinh 15/03/1990</span>
            <span>RD26-0004</span>
          </>
        ),
      }}
    >
      <div className={styles.Head}>
        {/* One trail: the full path from 40rem, only "‹ Ngô Văn Nam" (the way back) on phones. */}
        <Breadcrumb collapseOnPhone items={trail} />
        <h1 className={styles.Title}>{sendable ? 'Xem lại trước khi gửi lên Sở Y tế' : 'Trạng thái gửi lên Sở Y tế'}</h1>
      </div>
      {/* The person: one block with one edge. A direct child of the content, so from 1024px it sticks for the whole
          page and the name, date of birth and code stay in view down to the tick box and the send button (below
          1024px the header's thin bar does this). */}
      <PatientContextBar
        variant="block"
        sticky
        headingLevel={2}
        className={styles.Person}
        name="Ngô Văn Nam"
        sex="Nam"
        birthDate="15/03/1990"
        ageOn={new Date(2026, 9, 10)}
        idEnd="0004"
        recordCode="RD26-0004"
        organization="Công ty TNHH Rạng Đông"
        status={<StatusTag tone={tag.tone}>{tag.label}</StatusTag>}
        recordFacts={
          <>
            <span>Khám 10/10/2026 08:15</span>
            <span>
              Người ký: <strong>BS Hoàng Thị Cúc</strong>
            </span>
            <span>{phase === 'stale' ? 'Bản này lưu lúc 09:14 bởi chị Mai' : 'Bản này lưu lúc 09:12 bởi chị Lan'}</span>
          </>
        }
      />

      <VisuallyHidden role="status">{said}</VisuallyHidden>
      <div ref={outcomeRef} className={styles.OutcomeSlot}>
        {outcome}
      </div>

      <section aria-labelledby="khac-binh-thuong" className={styles.Block}>
        <h2 id="khac-binh-thuong" className={styles.H2}>
          Điểm khác bình thường
        </h2>
        {sendable ? <p className={styles.Muted}>Đối chiếu các điểm này với phiếu giấy.</p> : null}
        <ul className={styles.List}>
          <li>
            Tiền sử: Tăng huyết áp {code('I10')}, trả lời <strong>Có</strong>
          </li>
          <li>
            Thể lực: huyết áp{' '}
            <span className={styles.Whole}>
              <strong>145/90</strong> mmHg {flag('Cao')}
            </span>
          </li>
          {abnormalLabs.map((r) => (
            <li key={r.name}>
              Cận lâm sàng: {r.name.charAt(0).toLocaleLowerCase('vi')}
              {r.name.slice(1)}{' '}
              <span className={styles.Whole}>
                <strong>{r.value}</strong> {r.unit} {r.flag ? flag(r.flag) : null}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="tung-phan" className={styles.Block}>
        <h2 id="tung-phan" className={styles.H2}>
          Từng phần của phiếu
        </h2>
        <SummaryList rows={partRows(phase)} />
      </section>

      <section aria-labelledby="nguon" className={styles.Block}>
        <h2 id="nguon" className={styles.H2}>
          Nguồn dữ liệu
        </h2>
        <p>Xét nghiệm lấy từ HIS, đúng người và lượt khám (xem phần 6). X-quang tim phổi HIS không có, nên được nhập tay.</p>
        {sendable ? (
          <Checkbox
            label="Tôi đã đối chiếu phần nhập tay với phiếu giấy"
            hint={`${manualLabs.length} kết quả nhập tay: X-quang tim phổi (chị Lan nhập)`}
            checked={ticked}
            onChange={(e) => setTicked(e.target.checked)}
          />
        ) : (
          <p className={styles.Muted}>Đã đối chiếu phần nhập tay với phiếu giấy (chị Lan, 09:31).</p>
        )}
      </section>

      {sendable ? (
        <section aria-label="Gửi lên Sở" className={styles.Send}>
          {/* Who sends, said where the send happens: this batch is sent by hand, by the person reviewing it. */}
          <p className={styles.Muted}>Đợt này gửi tay: chị xem lại rồi tự gửi từng hồ sơ.</p>
          <p>Hồ sơ được ký bằng token của BS Hoàng Thị Cúc và gửi thật lên Sở Y tế. Bấm gửi xong có {undoSeconds} giây để hủy.</p>
          <Inline gap={15}>
            <Button icon="simple-left" href="#">
              Quay lại sửa
            </Button>
            <Button
              variant="primary"
              disabledReason={ticked ? undefined : 'Tích ô đối chiếu phần nhập tay để gửi.'}
              onClick={() => {
                setLeft(undoSeconds);
                setCancelled(false);
                setMoveFocus(true);
                setPhase('waiting');
                setSaid(`Chờ gửi lên Sở, còn ${undoSeconds} giây để hủy`);
              }}
            >
              Gửi lên Sở: Ngô Văn Nam
            </Button>
          </Inline>
        </section>
      ) : null}
    </StaffLayout>
  );
}

const meta = {
  title: 'Pages/Nhân viên/Xem lại trước khi gửi',
  component: ReviewSend,
  parameters: { layout: 'fullscreen', density: 'compact' },
} satisfies Meta<typeof ReviewSend>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Before sending: what differs from normal, every part with its source, and why the send button cannot be pressed yet. */
export const XemLai: Story = {};

/**
 * Scrolled down to the tick box and the send button: the person's name, date of birth and code stay in view. From
 * 1024px the person block sticks at the top (one edge, as before scrolling); below 1024px the header's thin bar holds
 * them. A focused control is never under the block: StaffLayout measures it.
 */
export const CuonDenNutGui: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const tick = canvas.getByRole('checkbox', { name: 'Tôi đã đối chiếu phần nhập tay với phiếu giấy' });
    tick.focus();
    canvas.getByRole('button', { name: 'Gửi lên Sở: Ngô Văn Nam' }).scrollIntoView({ block: 'end' });
    window.dispatchEvent(new Event('scroll'));
    const who = canvas.getByRole('region', { name: 'Người đang làm' });
    if (window.innerWidth >= 1024) {
      await waitFor(() => expect(Math.round(who.getBoundingClientRect().top)).toBe(0));
      for (const text of ['Ngô Văn Nam', 'Sinh 15/03/1990 (36 tuổi)', 'RD26-0004']) {
        const el = within(who).getByText(text);
        const r = el.getBoundingClientRect();
        await expect(document.elementFromPoint(r.left + 4, r.top + r.height / 2)).toBe(el);
      }
      // The scroll padding keeps a focused control below the block.
      const pad = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop);
      await expect(pad).toBeGreaterThan(who.getBoundingClientRect().bottom);
    } else {
      const header = canvasElement.querySelector('header')!;
      await waitFor(() => expect(header).toHaveAttribute('data-collapsed', 'true'));
      await expect(within(header).getByText('RD26-0004')).toBeVisible();
    }
  },
};

/**
 * Ticked and sent: a 30-second undo window in pale blue (started, not finished), and the way on to the next person.
 * Focus moves to the panel's heading, whose name stays "Chờ gửi lên Sở" while the seconds run in the text under it;
 * the page's status line says the start once.
 */
export const ChoGui: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Gửi lên Sở: Ngô Văn Nam' })).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Tôi đã đối chiếu phần nhập tay với phiếu giấy' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Gửi lên Sở: Ngô Văn Nam' }));
    const heading = canvas.getByRole('heading', { name: 'Chờ gửi lên Sở' });
    await expect(heading).toHaveFocus();
    await expect(canvas.getByText('Chờ gửi lên Sở, còn 30 giây để hủy')).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Hủy gửi' })).toBeInTheDocument();
    await expect(canvas.getByRole('link', { name: `Người sau: ${NEXT_PERSON}` })).toBeInTheDocument();
    // The record's tag says the state once; the countdown lives only in the panel's text.
    const who = canvas.getByRole('region', { name: 'Người đang làm' });
    await expect(within(who).getByText('Chờ gửi')).toBeInTheDocument();
    await expect(within(who).queryByText(/giây/)).not.toBeInTheDocument();
  },
};

/** "Hủy gửi" in the undo window: focus goes to the "Đã hủy gửi" heading and the status line says nothing was sent. */
export const HuyGui: Story = {
  args: { initialTicked: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Gửi lên Sở: Ngô Văn Nam' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Hủy gửi' }));
    await expect(canvas.getByRole('heading', { name: 'Đã hủy gửi' })).toHaveFocus();
    await expect(canvas.getByText('Đã hủy gửi. Chưa có gì lên Sở; hồ sơ mở lại để chị sửa.')).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Gửi lên Sở: Ngô Văn Nam' })).toBeInTheDocument();
  },
};

/**
 * The window runs out while focus is on "Hủy gửi" (3 seconds here): the button goes, focus moves to the
 * "Đang gửi lên Sở" heading, and the status line says "Đã chuyển sang Đang gửi" once.
 */
export const HetGioHuy: Story = {
  args: { initialTicked: true, undoSeconds: 3 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Gửi lên Sở: Ngô Văn Nam' }));
    canvas.getByRole('button', { name: 'Hủy gửi' }).focus();
    await waitFor(() => expect(canvas.getByRole('heading', { name: 'Đang gửi lên Sở' })).toHaveFocus(), { timeout: 6000 });
    await expect(canvas.getByText('Đã chuyển sang Đang gửi')).toBeInTheDocument();
  },
};

/** Sent, no answer yet: nothing can be cancelled; the steps show only what has really happened, and where each answer will land. */
export const DangGui: Story = { args: { initialPhase: 'sending', initialTicked: true } };

/** The department returned its receipt code: green, because this is a success. The ministry's confirmation is still to come. */
export const SoDaTiepNhan: Story = { args: { initialPhase: 'accepted', initialTicked: true } };

/** The department refused with a reason: what failed, the department's words, the part to fix, the way back (sửa, xem lại, gửi lại), and help from Minh. */
export const BiTuChoi: Story = { args: { initialPhase: 'rejected', initialTicked: true } };

/** No answer in time: the department may hold the record, so check the status or ask Minh; there is no "Gửi lại". */
export const ChuaRoKetQua: Story = { args: { initialPhase: 'unknown', initialTicked: true } };

/** Someone changed the record after it was opened: nothing was sent; the notice names the change, then send again. */
export const BanDaDoi: Story = { args: { initialPhase: 'stale', initialTicked: true } };

/** The review on a phone: the person stays in the thin header bar, every block is one column, nothing scrolls sideways. */
export const DienThoai: Story = { parameters: { viewport: { defaultViewport: 'mobile1' } } };
