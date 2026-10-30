import { render, screen } from '@testing-library/react';
import { ConfirmationPanel, type ConfirmationTone } from './ConfirmationPanel';

/** What a screen reader reads: the text without the parts hidden from it (the signs). */
function spoken(el: Element) {
  const copy = el.cloneNode(true) as Element;
  copy.querySelectorAll('[aria-hidden="true"]').forEach((n) => n.remove());
  return (copy.textContent ?? '').replace(/\s+/g, ' ').trim();
}

describe('ConfirmationPanel', () => {
  it('defaults to a strong success panel whose h1 title takes focus, with no sign before the title', () => {
    render(<ConfirmationPanel title="Đã đặt lịch khám" reference="FDC-2410-0930" />);
    const title = screen.getByRole('heading', { level: 1, name: 'Đã đặt lịch khám' });
    expect(title).toHaveFocus();
    const panel = title.closest('[data-component="ConfirmationPanel"]')!;
    expect(panel).toHaveAttribute('data-tone', 'success');
    expect(panel).toHaveAttribute('data-emphasis', 'strong');
    expect(panel).not.toHaveAttribute('data-pale');
    expect(panel.querySelector('[data-part="mark"]')).toBeNull();
  });

  it('subtle: Sở đã tiếp nhận, a staff success that holds its explanation and code inside the panel', () => {
    render(
      <ConfirmationPanel
        emphasis="subtle"
        title="Sở đã tiếp nhận"
        reference="SYT-HN-2026-118204"
        referenceLabel="Mã tiếp nhận của Sở"
        headingLevel={2}
        focusOnMount={false}
        steps={[
          { label: 'Đã gửi lên Sở', state: 'done' },
          { label: 'Sở đã tiếp nhận', state: 'done' },
          { label: 'Chờ Bộ xác nhận', state: 'current' },
        ]}
      >
        <p>Bộ Y tế chưa xác nhận.</p>
      </ConfirmationPanel>,
    );
    const heading = screen.getByRole('heading', { level: 2, name: 'Sở đã tiếp nhận' });
    const root = heading.closest('[data-component="ConfirmationPanel"]')!;
    expect(root).toHaveAttribute('data-emphasis', 'subtle');
    expect(root).toHaveAttribute('data-pale', 'true');
    const box = root.firstElementChild!;
    expect(box).toContainElement(heading);
    expect(box).toContainElement(screen.getByText('Bộ Y tế chưa xác nhận.'));
    expect(box).toContainElement(screen.getByText('SYT-HN-2026-118204'));
    // A pale panel shows its type as a sign, hidden from screen readers; the heading reads only its words.
    const mark = box.querySelector('[data-part="mark"]');
    expect(mark).toHaveTextContent('✓');
    expect(mark).toHaveAttribute('aria-hidden', 'true');
    const items = screen.getAllByRole('listitem');
    // The step still waited for is current, not done: a clock, no tick, and marked for screen readers.
    expect(items[2]).toHaveAttribute('aria-current', 'step');
    expect(items[2].querySelector('[data-part="done-mark"]')).toBeNull();
    expect(items[2].querySelector('[data-part="wait-mark"]')).toHaveAttribute('aria-hidden', 'true');
  });

  it('strong: the explanation sits under the panel, on the page', () => {
    render(
      <ConfirmationPanel title="Đã đặt lịch khám" reference="FDC-2410-0930" focusOnMount={false}>
        <p>Chúng tôi sẽ gọi lại trong 30 phút.</p>
      </ConfirmationPanel>,
    );
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading.parentElement).not.toContainElement(screen.getByText('Chúng tôi sẽ gọi lại trong 30 phút.'));
  });

  it('every step says its state in words for screen readers; the signs are hidden from them', () => {
    render(
      <ConfirmationPanel
        tone="error"
        title="Bị từ chối"
        focusOnMount={false}
        steps={[
          { label: 'Đã gửi lên Sở', state: 'done' },
          { label: 'Sở từ chối', state: 'failed' },
          { label: 'Chờ chị sửa', state: 'current' },
          { label: 'Xem lại', state: 'todo' },
        ]}
      />,
    );
    const items = screen.getAllByRole('listitem');
    expect(items.map(spoken)).toEqual(['Xong: Đã gửi lên Sở', 'Lỗi: Sở từ chối', 'Hiện tại: Chờ chị sửa', 'Bước sau: Xem lại']);
    const marks = items.map((li) => li.querySelector('[data-part$="-mark"]'));
    expect(marks.map((m) => m?.getAttribute('data-part') ?? null)).toEqual(['done-mark', 'failed-mark', 'wait-mark', null]);
    for (const m of marks.slice(0, 3)) expect(m).toHaveAttribute('aria-hidden', 'true');
    expect(marks[0]).toHaveTextContent('✓');
    expect(marks[1]).toHaveTextContent('!');
  });

  it('the state words can be changed', () => {
    render(
      <ConfirmationPanel
        title="Done"
        focusOnMount={false}
        donePrefix="Done:"
        currentPrefix="Now:"
        todoPrefix="Later:"
        failedPrefix="Failed:"
        steps={[
          { label: 'A', state: 'done' },
          { label: 'B', state: 'failed' },
          { label: 'C', state: 'current' },
          { label: 'D', state: 'todo' },
        ]}
      />,
    );
    expect(screen.getAllByRole('listitem').map(spoken)).toEqual(['Done: A', 'Failed: B', 'Now: C', 'Later: D']);
  });

  it('plain-string steps: earlier steps done, the current step marked, the rest to come', () => {
    render(
      <ConfirmationPanel
        tone="pending"
        title="Chờ gửi · còn 27 giây"
        headingLevel={2}
        focusOnMount={false}
        steps={['Đã xem lại', 'Chờ gửi', 'Sở tiếp nhận', 'Bộ xác nhận']}
        currentStep={1}
      >
        <p>Chưa có gì lên Sở. Chị có thể hủy.</p>
      </ConfirmationPanel>,
    );
    const heading = screen.getByRole('heading', { level: 2, name: 'Chờ gửi · còn 27 giây' });
    expect(heading).not.toHaveFocus();
    const root = heading.closest('[data-component="ConfirmationPanel"]')!;
    // Emphasis is a success setting only: a pending panel is always pale.
    expect(root).not.toHaveAttribute('data-emphasis');
    expect(root).toHaveAttribute('data-pale', 'true');
    const list = screen.getByRole('list', { name: 'Tiến trình' });
    const items = screen.getAllByRole('listitem');
    expect(list).toContainElement(items[0]);
    expect(items.map((li) => li.getAttribute('data-state'))).toEqual(['done', 'current', 'todo', 'todo']);
    expect(items[1]).toHaveAttribute('aria-current', 'step');
    // The explanation sits inside the pending panel, with the title.
    expect(root.firstElementChild).toContainElement(screen.getByText('Chưa có gì lên Sở. Chị có thể hủy.'));
  });

  it('uses explicit step states and never infers a later step from an earlier one', () => {
    render(
      <ConfirmationPanel
        tone="error"
        title="Bị từ chối"
        focusOnMount={false}
        steps={[
          { label: 'Đã gửi lên Sở', state: 'done' },
          { label: 'Sở từ chối', state: 'failed' },
          { label: 'Bộ xác nhận', state: 'todo' },
        ]}
      />,
    );
    const items = screen.getAllByRole('listitem');
    expect(items.map((li) => li.getAttribute('data-state'))).toEqual(['done', 'failed', 'todo']);
    expect(items.some((li) => li.getAttribute('aria-current'))).toBe(false);
  });

  it('every tone but the strong success is a pale panel with its sign: ✓ success, i pending, ! error and attention', () => {
    const cases: Array<[ConfirmationTone, string]> = [
      ['pending', 'i'],
      ['error', '!'],
      ['attention', '!'],
    ];
    for (const [tone, sign] of cases) {
      const { unmount } = render(
        <ConfirmationPanel tone={tone} title="Chưa rõ kết quả" headingLevel={2} focusOnMount={false}>
          <p>Hồ sơ vẫn ở nhóm Đang gửi.</p>
        </ConfirmationPanel>,
      );
      const heading = screen.getByRole('heading', { level: 2, name: 'Chưa rõ kết quả' });
      const root = heading.closest('[data-component="ConfirmationPanel"]')!;
      expect(root, tone).toHaveAttribute('data-tone', tone);
      expect(root, tone).toHaveAttribute('data-pale', 'true');
      expect(root.querySelector('[data-part="mark"]'), tone).toHaveTextContent(sign);
      expect(root.firstElementChild, tone).toContainElement(screen.getByText('Hồ sơ vẫn ở nhóm Đang gửi.'));
      unmount();
    }
  });
});
