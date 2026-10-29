import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { Button } from '../components/atoms/Button';
import { StatusTag } from '../components/atoms/StatusTag';
import { Inline } from '../components/layout/Inline';
import { Breadcrumb } from '../components/molecules/Breadcrumb';
import { ConfirmationPanel } from '../components/molecules/ConfirmationPanel';
import { FormNotice } from '../components/molecules/FormNotice';
import { SummaryList } from '../components/molecules/SummaryList';
import { DataTable } from '../components/organisms/DataTable';
import { PatientContextBar } from '../components/organisms/PatientContextBar';
import { StaffLayout } from '../components/templates/StaffLayout';
import { labResults } from '../fixtures/ksk';
import { staffHeader } from '../fixtures/staff';

type Phase = 'review' | 'waiting' | 'sending' | 'sent' | 'failed' | 'stale';

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
].map((q, i) => ({ n: i + 1, q, a: i === 7 ? 'Có (I10)' : 'Không' }));

const card = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-15)',
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-sm)',
  padding: 'var(--space-20)',
} as const;
const h2 = { margin: 0, fontFamily: 'var(--font-heading)', fontSize: '1.375rem', lineHeight: 1.3 } as const;

function ReviewSend({ initialPhase = 'review', initialTicked = false, undoSeconds = 30 }: { initialPhase?: Phase; initialTicked?: boolean; undoSeconds?: number }) {
  const [phase, setPhase] = useState<Phase>(initialPhase);
  const [ticked, setTicked] = useState(initialTicked);
  const [left, setLeft] = useState(undoSeconds);

  useEffect(() => {
    if (phase !== 'waiting') return;
    if (left <= 0) {
      setPhase('sending');
      return;
    }
    const t = window.setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => window.clearTimeout(t);
  }, [phase, left]);

  const state: Record<Phase, { tag: string; tone: 'neutral' | 'info' | 'success' | 'error' }> = {
    review: { tag: 'Sẵn sàng xem lại', tone: 'neutral' },
    stale: { tag: 'Sẵn sàng xem lại', tone: 'neutral' },
    waiting: { tag: `Chờ gửi · còn ${left} giây`, tone: 'info' },
    sending: { tag: 'Đang gửi', tone: 'info' },
    sent: { tag: 'Đã gửi lên Sở', tone: 'success' },
    failed: { tag: 'Gửi lỗi', tone: 'error' },
  };

  return (
    <StaffLayout header={staffHeader}>
      <Breadcrumb
        items={[
          { label: 'Việc của tôi', href: '#' },
          { label: 'Rạng Đông KSK 2026', href: '#' },
          { label: 'Ngô Văn Nam', href: '#' },
          { label: 'Xem lại trước khi gửi' },
        ]}
      />
      <h1 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: '2rem', lineHeight: 1.3 }}>Xem lại trước khi gửi lên Sở Y tế</h1>

      <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
        <PatientContextBar
          headingLevel={2}
          name="Ngô Văn Nam"
          sex="Nam"
          birthDate="15/03/1990"
          ageOn={new Date(2026, 9, 10)}
          idEnd="0004"
          recordCode="RD26-0004"
          organization="Công ty TNHH Rạng Đông"
          status={<StatusTag tone={state[phase].tone}>{state[phase].tag}</StatusTag>}
        />
        <p style={{ margin: 0, padding: 'var(--space-10) var(--space-15)', background: 'var(--surface)' }}>
          Khám ngày 10/10/2026 lúc 08:00 · ký bằng token của <strong>BS Hoàng Thị Cúc</strong> · bản này lưu lúc 09:12 bởi chị Lan.
        </p>
      </div>

      {phase === 'waiting' || phase === 'sending' ? (
        <ConfirmationPanel
          tone="pending"
          headingLevel={2}
          title={phase === 'waiting' ? `Chờ gửi · còn ${left} giây` : 'Đang gửi lên Sở'}
          steps={[
            { label: 'Đã xem lại', state: 'done' },
            { label: 'Chờ gửi', state: phase === 'waiting' ? 'current' : 'done' },
            { label: 'Đã gửi lên Sở', state: phase === 'sending' ? 'current' : 'todo' },
            { label: 'Bộ đã nhận', state: 'todo' },
          ]}
        >
          {phase === 'waiting' ? (
            <Inline gap={15} align="center">
              <span>Chưa có gì lên Sở. Bấm Hủy gửi để mở lại hồ sơ và sửa.</span>
              <Button
                onClick={() => {
                  setPhase('review');
                  setLeft(undoSeconds);
                }}
              >
                Hủy gửi
              </Button>
            </Inline>
          ) : (
            <p style={{ margin: 0 }}>Gửi tự động đã nhận hồ sơ lúc 09:31:40. Không hủy được nữa; Sở trả lời thường trong vài phút.</p>
          )}
        </ConfirmationPanel>
      ) : null}

      {phase === 'sent' ? (
        <ConfirmationPanel
          headingLevel={2}
          title="Đã gửi lên Sở"
          reference="SYT-HN-2026-118204"
          referenceLabel="Mã Sở trả về"
          steps={[
            { label: 'Đã xem lại', state: 'done' },
            { label: 'Chờ gửi', state: 'done' },
            { label: 'Đã gửi lên Sở', state: 'done' },
            { label: 'Bộ đã nhận', state: 'current' },
          ]}
        >
          <p style={{ margin: 0 }}>Bộ Y tế chưa xác nhận. Khi Bộ nhận, trạng thái đổi thành “Bộ đã nhận”; không cần làm gì thêm.</p>
        </ConfirmationPanel>
      ) : null}

      {phase === 'failed' ? (
        <div style={card}>
          <FormNotice boxed notice={{ type: 'error', text: 'Gửi lỗi: Sở trả lại hồ sơ lúc 09:32. Lý do của Sở: “Thiếu kết luận phân loại sức khỏe”. Chưa có gì được ghi nhận.' }} />
          <Inline gap={10}>
            <Button variant="primary" href="#">
              Mở phần 7. Kết luận để sửa
            </Button>
            <Button>Nhờ Minh kiểm tra</Button>
          </Inline>
        </div>
      ) : null}

      {phase === 'stale' ? (
        <FormNotice
          boxed
          notice={{
            type: 'warning',
            text: 'Chưa gửi gì. Chị Mai vừa sửa phần 4. Thể lực lúc 09:14, sau khi chị mở trang này. Xem lại phần đã đổi rồi bấm gửi lại.',
          }}
        />
      ) : null}

      <section aria-labelledby="khac-binh-thuong" style={card}>
        <h2 id="khac-binh-thuong" style={h2}>
          Điểm khác bình thường
        </h2>
        <p style={{ margin: 0, color: 'var(--text-muted)' }}>Đối chiếu các điểm này với phiếu giấy.</p>
        <ul style={{ margin: 0, paddingInlineStart: 'var(--space-20)', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          <li>
            Tiền sử: Tăng huyết áp – <strong>Có</strong> (I10)
          </li>
          <li>
            Thể lực: huyết áp <strong>145/90</strong> mmHg{' '}
            <StatusTag tone="error" size="sm">
              Cao
            </StatusTag>
          </li>
          <li>
            Cận lâm sàng: glucose máu <strong>7,2</strong> mmol/L{' '}
            <StatusTag tone="error" size="sm">
              Cao
            </StatusTag>
          </li>
        </ul>
      </section>

      <section aria-labelledby="tung-phan" style={card}>
        <h2 id="tung-phan" style={h2}>
          Từng phần của phiếu
        </h2>
        <SummaryList
          rows={[
            { key: '1. Hành chính', value: 'Nam · 15/03/1990 · CCCD …0004 · Phường Đại Mỗ, Hà Nội · Nhà chuyên môn về sức khỏe (22)', changeHref: '#' },
            { key: '2. Lần khám', value: '10/10/2026 08:00 · Khám sức khỏe định kỳ', changeHref: '#' },
            {
              key: '3. Tiền sử',
              value: '25 câu: Không, trừ Tăng huyết áp (I10)',
              changeHref: '#',
              detailsLabel: 'Xem 25 câu',
              details: (
                <DataTable
                  caption="25 câu tiền sử"
                  minWidth="30rem"
                  columns={[
                    { key: 'n', header: '#', cell: (r) => r.n, align: 'end', width: '3rem' },
                    { key: 'q', header: 'Câu hỏi', cell: (r) => r.q },
                    { key: 'a', header: 'Trả lời', cell: (r) => r.a, nowrap: true, width: '7rem' },
                  ]}
                  rows={history}
                  getRowKey={(r) => String(r.n)}
                />
              ),
            },
            {
              key: '4. Thể lực',
              value: (
                <>
                  170 cm · 65 kg · BMI 22,5 · mạch 78 · huyết áp 145/90{' '}
                  <StatusTag tone="error" size="sm">
                    Cao
                  </StatusTag>{' '}
                  · Loại II
                </>
              ),
              changeHref: '#',
            },
            { key: '5. Lâm sàng', value: '25 mục, không mục nào bất thường (chị Lan nhập từng mục)', changeHref: '#' },
            {
              key: '6. Cận lâm sàng',
              value: '12 chỉ số từ HIS · X-quang nhập tay',
              changeHref: '#',
              detailsLabel: 'Xem 12 chỉ số và X-quang',
              defaultDetailsOpen: true,
              details: (
                <DataTable
                  caption="Kết quả cận lâm sàng"
                  minWidth="30rem"
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
                          {r.flag ? (
                            <>
                              {' '}
                              <StatusTag tone="error" size="sm">
                                {r.flag}
                              </StatusTag>
                            </>
                          ) : null}
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
            { key: '7. Kết luận', value: 'Sức khỏe Loại II · Tăng huyết áp vô căn (nguyên phát) (I10)', changeHref: '#' },
          ]}
        />
      </section>

      <section aria-labelledby="nguon" style={card}>
        <h2 id="nguon" style={h2}>
          Nguồn dữ liệu
        </h2>
        <p style={{ margin: 0 }}>
          Xét nghiệm: HIS, người <strong>Ngô Văn Nam, nam, 15/03/1990</strong>, lượt khám <strong>10/10/2026 08:15</strong>, đúng hợp đồng của đợt. Chị Lan chọn lúc 09:05.
        </p>
        <p style={{ margin: 0 }}>X-quang tim phổi: HIS không có, chị Lan nhập tay. Đối chiếu với phiếu giấy trước khi gửi.</p>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-10)', minBlockSize: 'var(--target-min)', fontWeight: 600, cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={ticked}
            disabled={phase !== 'review' && phase !== 'stale'}
            onChange={(e) => setTicked(e.target.checked)}
            style={{ inlineSize: '1.5rem', blockSize: '1.5rem', margin: 0, accentColor: 'var(--action-primary-bg)' }}
          />
          Tôi đã xem phần nhập tay
        </label>
      </section>

      {phase === 'review' || phase === 'stale' ? (
        <section aria-label="Gửi" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-15)' }}>
          <p style={{ margin: 0 }}>Hồ sơ được ký bằng token của BS Hoàng Thị Cúc và gửi thật lên Sở Y tế. Bấm gửi xong có {undoSeconds} giây để hủy.</p>
          <Inline gap={15} align="center">
            <Button icon="simple-left" href="#">
              Quay lại sửa
            </Button>
            <Button
              variant="primary"
              disabledReason={ticked ? undefined : 'Tích “Tôi đã xem phần nhập tay” để gửi.'}
              onClick={() => {
                setLeft(undoSeconds);
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

/** The send button says who will be sent, and why it cannot be pressed yet. */
export const XemLai: Story = {};

/** Ticked and sent: a 30-second undo window in pale blue (work started, not finished), never green. */
export const ChoGui: Story = {
  args: { initialTicked: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Gửi lên Sở: Ngô Văn Nam' }));
    await expect(canvas.getByRole('heading', { name: /Chờ gửi · còn \d+ giây/ })).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Hủy gửi' })).toBeInTheDocument();
  },
};

/** Sent, no answer yet: the steps show only what has really happened. */
export const DangGui: Story = { args: { initialPhase: 'sending', initialTicked: true } };

/** The department returned a code: green, because this is a success. "Bộ đã nhận" is still to come. */
export const DaGuiLenSo: Story = { args: { initialPhase: 'sent', initialTicked: true } };

/** The department refused: what failed, the department's reason, and the two ways forward. */
export const GuiLoi: Story = { args: { initialPhase: 'failed', initialTicked: true } };

/** Someone changed the record after it was opened: nothing was sent; look again, then send. */
export const BanDaDoi: Story = { args: { initialPhase: 'stale' } };

export const DienThoai: Story = { parameters: { viewport: { defaultViewport: 'mobile1' } } };
