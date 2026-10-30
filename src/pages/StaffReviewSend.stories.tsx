import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { Button } from '../components/atoms/Button';
import { Checkbox } from '../components/atoms/Checkbox';
import { StatusTag, type StatusTagTone } from '../components/atoms/StatusTag';
import { Inline } from '../components/layout/Inline';
import { Breadcrumb } from '../components/molecules/Breadcrumb';
import { ConfirmationPanel, type ConfirmationStep } from '../components/molecules/ConfirmationPanel';
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

/** The record's state tag. "Chờ gửi" has no countdown here: the panel title already counts. */
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

/** A code after its name, in brackets and lighter: "Tăng huyết áp (I10)". */
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
    { key: '2. Lần khám', value: '10/10/2026 08:00, khám sức khỏe định kỳ', changeHref },
    {
      key: '3. Tiền sử',
      value: <>25 câu: Không, trừ Tăng huyết áp {code('I10')}</>,
      changeHref,
      detailsLabel: 'Xem 25 câu',
      details: (
        <DataTable
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
                Cân nặng <strong>53 kg</strong>{' '}
                <StatusTag tone="info" size="sm">
                  Chị Mai sửa 09:14
                </StatusTag>
              </span>
              <span>Chiều cao 170 cm, BMI 18,3</span>
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
      // "X-quang nhập tay" is kept whole, so the line never breaks after "X-".
      value: (
        <>
          12 chỉ số từ HIS (Ngô Văn Nam, 15/03/1990 · lượt khám 10/10/2026 08:15 · lấy lúc 09:12) · <span className={styles.Whole}>X-quang nhập tay</span>
        </>
      ),
      changeHref,
      detailsLabel: 'Xem 12 chỉ số và X-quang',
      defaultDetailsOpen: true,
      details: (
        <DataTable
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
      value: (
        <span className={styles.Lines}>
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
          <span>Bệnh: Tăng huyết áp vô căn (nguyên phát) {code('I10')}</span>
          <span>Lời bác sĩ: “Theo dõi huyết áp và đường huyết, khám lại sau 3 tháng.”</span>
        </span>
      ),
      changeHref,
    },
  ];
}

/** The way on after a send: staff never wait for the department; the record stays findable in the list. */
function NextPerson({ line }: { line?: string }) {
  return (
    <Inline gap={15}>
      <Button variant="primary" href="#">
        Sang người sau cần làm
      </Button>
      {line ? <span>{line}</span> : null}
    </Inline>
  );
}

/** A refusal or an unknown outcome: the notice, its main button, and asking Minh (which can be taken back). */
function NoticeOutcome({ notice, primary }: { notice: FormNoticeValue; primary: ReactNode }) {
  const [asked, setAsked] = useState(false);
  return (
    <section aria-label="Kết quả gửi" className={styles.Outcome}>
      <FormNotice boxed notice={notice} />
      <Inline gap={10}>
        {primary}
        {/* The same button changes its words, so focus stays on it. */}
        <Button onClick={() => setAsked((v) => !v)}>{asked ? 'Hủy yêu cầu' : 'Nhờ Minh kiểm tra'}</Button>
      </Inline>
      <FormNotice notice={asked ? { type: 'info', text: 'Đã nhờ Minh kiểm tra lúc 09:42. Minh trả lời trong hoso; chị làm người khác trong lúc chờ.' } : null} />
    </section>
  );
}

function ReviewSend({ initialPhase = 'review', initialTicked = false, undoSeconds = 30 }: { initialPhase?: Phase; initialTicked?: boolean; undoSeconds?: number }) {
  const [phase, setPhase] = useState<Phase>(initialPhase);
  const [ticked, setTicked] = useState(initialTicked);
  const [left, setLeft] = useState(undoSeconds);
  const [checking, setChecking] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const cancelledRef = useRef<HTMLDivElement>(null);

  // The undo window counts down; at 0 the record goes to the department and can no longer be cancelled.
  useEffect(() => {
    if (phase !== 'waiting') return;
    if (left <= 0) {
      setPhase('sending');
      return;
    }
    const t = window.setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => window.clearTimeout(t);
  }, [phase, left]);

  // "Kiểm tra lại trạng thái": in this sample the department answers that it holds the record.
  useEffect(() => {
    if (!checking) return;
    const t = window.setTimeout(() => {
      setChecking(false);
      setPhase('accepted');
    }, 800);
    return () => window.clearTimeout(t);
  }, [checking]);

  // After "Hủy gửi" the panel and its button are gone: focus the line that says nothing was sent.
  useEffect(() => {
    if (cancelled) cancelledRef.current?.focus();
  }, [cancelled]);

  const sendable = canSend(phase);
  const tag = tags[phase];
  const trail = [
    { label: 'Rạng Đông KSK 2026', href: '#' },
    { label: 'Ngô Văn Nam', href: '#' },
    { label: sendable ? 'Xem lại trước khi gửi' : 'Trạng thái gửi' },
  ];

  let outcome: ReactNode = null;
  if (phase === 'waiting') {
    outcome = (
      <ConfirmationPanel
        tone="pending"
        headingLevel={2}
        title={`Chờ gửi · còn ${left} giây`}
        steps={[
          { label: 'Đã xem lại', state: 'done' },
          { label: 'Chờ gửi', state: 'current' },
          { label: 'Sở tiếp nhận', state: 'todo' },
          { label: 'Bộ xác nhận', state: 'todo' },
        ]}
      >
        <Inline gap={15}>
          <span>Chưa có gì lên Sở.</span>
          <Button
            onClick={() => {
              setPhase('review');
              setLeft(undoSeconds);
              setCancelled(true);
            }}
          >
            Hủy gửi
          </Button>
        </Inline>
        <NextPerson line="Hồ sơ vẫn ở nhóm Đang gửi; hủy được từ đầu trang người sau." />
      </ConfirmationPanel>
    );
  } else if (phase === 'sending') {
    const steps: ConfirmationStep[] = [
      { label: 'Đã xem lại', state: 'done' },
      { label: 'Chờ gửi', state: 'done' },
      { label: 'Chờ Sở trả lời', state: 'current' },
      { label: 'Bộ xác nhận', state: 'todo' },
    ];
    outcome = (
      <ConfirmationPanel tone="pending" headingLevel={2} title="Đang gửi lên Sở" steps={steps}>
        <p>Gửi tự động đã chuyển hồ sơ lên Sở lúc 09:31. Không hủy được nữa; Sở thường trả lời trong vài phút.</p>
        <NextPerson line="Câu trả lời của Sở hiện ở danh sách, nhóm Đang gửi." />
      </ConfirmationPanel>
    );
  } else if (phase === 'accepted') {
    outcome = (
      <ConfirmationPanel
        emphasis="subtle"
        headingLevel={2}
        title="Sở đã tiếp nhận"
        reference="SYT-HN-2026-118204"
        referenceLabel="Mã tiếp nhận của Sở"
        steps={[
          { label: 'Đã xem lại', state: 'done' },
          { label: 'Chờ gửi', state: 'done' },
          { label: 'Sở đã tiếp nhận', state: 'done' },
          { label: 'Chờ Bộ xác nhận', state: 'current' },
        ]}
      >
        <p>Bộ Y tế chưa xác nhận. Khi Bộ xác nhận, trạng thái đổi thành “Bộ đã xác nhận”; không cần làm gì thêm.</p>
        <NextPerson />
      </ConfirmationPanel>
    );
  } else if (phase === 'rejected') {
    outcome = (
      <NoticeOutcome
        notice={{
          type: 'error',
          text: 'Bị từ chối: Sở trả lại hồ sơ lúc 09:32. Lý do của Sở: “Thiếu kết luận phân loại sức khỏe”. Chưa có gì được ghi nhận.',
        }}
        primary={
          <Button variant="primary" href="#">
            Mở phần 7. Kết luận để sửa
          </Button>
        }
      />
    );
  } else if (phase === 'unknown') {
    // No "Gửi lại" here: the department may already hold the record, and a second send makes a duplicate.
    outcome = (
      <NoticeOutcome
        notice={{
          type: 'warning',
          text: 'Chưa rõ kết quả: đã gửi lúc 09:31 nhưng Sở chưa trả lời sau 10 phút. Sở có thể đã nhận hồ sơ, nên chưa gửi lại để tránh gửi trùng.',
        }}
        primary={
          <Button variant="primary" loading={checking} loadingLabel="Đang hỏi Sở…" onClick={() => setChecking(true)}>
            Kiểm tra lại trạng thái
          </Button>
        }
      />
    );
  } else if (phase === 'stale') {
    outcome = (
      <section aria-label="Hồ sơ vừa đổi" className={styles.Outcome}>
        <FormNotice
          boxed
          notice={{
            type: 'warning',
            text: 'Chưa gửi gì. Chị Mai vừa sửa phần 4. Thể lực lúc 09:14, sau khi chị mở trang này: Cân nặng 52,5 → 53 kg.',
          }}
        />
        <Inline gap={10}>
          <Button href="#phan-4-the-luc">Xem phần 4. Thể lực</Button>
        </Inline>
      </section>
    );
  } else if (cancelled) {
    outcome = (
      <div ref={cancelledRef} tabIndex={-1} className={styles.Focus}>
        <FormNotice boxed notice={{ type: 'info', text: 'Đã hủy gửi. Chưa có gì lên Sở; hồ sơ mở lại để chị sửa.' }} />
      </div>
    );
  }

  return (
    <StaffLayout header={staffHeader}>
      <div className={styles.Head}>
        {/* Phones leave out "Việc của tôi" (it is in the menu), so the trail takes one line less above the work. */}
        <Breadcrumb className={styles.WideOnly} items={[{ label: 'Việc của tôi', href: '#' }, ...trail]} />
        <Breadcrumb className={styles.PhoneOnly} items={trail} />
        <h1 className={styles.Title}>{sendable ? 'Xem lại trước khi gửi lên Sở Y tế' : 'Trạng thái gửi lên Sở Y tế'}</h1>
        <div className={styles.Person}>
          <PatientContextBar
            variant="block"
            headingLevel={2}
            name="Ngô Văn Nam"
            sex="Nam"
            birthDate="15/03/1990"
            ageOn={new Date(2026, 9, 10)}
            idEnd="0004"
            recordCode="RD26-0004"
            organization="Công ty TNHH Rạng Đông"
            status={<StatusTag tone={tag.tone}>{tag.label}</StatusTag>}
          />
          <p className={styles.Meta}>
            <span>Khám 10/10/2026 08:00</span>
            <span>
              Người ký: <strong>BS Hoàng Thị Cúc</strong>
            </span>
            <span>{phase === 'stale' ? 'Bản này lưu lúc 09:14 bởi chị Mai' : 'Bản này lưu lúc 09:12 bởi chị Lan'}</span>
          </p>
        </div>
      </div>

      {outcome}

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
                setPhase('waiting');
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

/** Ticked and sent: a 30-second undo window in pale blue (started, not finished), and the way on to the next person. */
export const ChoGui: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Gửi lên Sở: Ngô Văn Nam' })).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Tôi đã đối chiếu phần nhập tay với phiếu giấy' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Gửi lên Sở: Ngô Văn Nam' }));
    await expect(canvas.getByRole('heading', { name: /^Chờ gửi · còn \d+ giây$/ })).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Hủy gửi' })).toBeInTheDocument();
    await expect(canvas.getByRole('link', { name: 'Sang người sau cần làm' })).toBeInTheDocument();
    // The record's tag says the state once; the countdown lives only in the panel title.
    const who = canvas.getByRole('region', { name: 'Người đang làm' });
    await expect(within(who).getByText('Chờ gửi')).toBeInTheDocument();
    await expect(within(who).queryByText(/giây/)).not.toBeInTheDocument();
  },
};

/** Sent, no answer yet: nothing can be cancelled; the steps show only what has really happened. */
export const DangGui: Story = { args: { initialPhase: 'sending', initialTicked: true } };

/** The department returned its receipt code: green, because this is a success. The ministry's confirmation is still to come. */
export const SoDaTiepNhan: Story = { args: { initialPhase: 'accepted', initialTicked: true } };

/** The department refused with a reason: what failed, the department's words, the part to fix, and help from Minh. */
export const BiTuChoi: Story = { args: { initialPhase: 'rejected', initialTicked: true } };

/** No answer in time: the department may hold the record, so check the status or ask Minh; there is no "Gửi lại". */
export const ChuaRoKetQua: Story = { args: { initialPhase: 'unknown', initialTicked: true } };

/** Someone changed the record after it was opened: nothing was sent; the notice names the change, then send again. */
export const BanDaDoi: Story = { args: { initialPhase: 'stale', initialTicked: true } };

/** The review on a phone: the person and the work first, every block one column, nothing scrolls sideways. */
export const DienThoai: Story = { parameters: { viewport: { defaultViewport: 'mobile1' } } };
