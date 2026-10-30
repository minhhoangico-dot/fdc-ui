import { render, screen } from '@testing-library/react';
import { ConfirmationPanel } from './ConfirmationPanel';

describe('ConfirmationPanel', () => {
  it('defaults to a success panel whose h1 title takes focus', () => {
    render(<ConfirmationPanel title="Đã đặt lịch khám" reference="FDC-2410-0930" />);
    const title = screen.getByRole('heading', { level: 1, name: 'Đã đặt lịch khám' });
    expect(title).toHaveFocus();
    const panel = title.closest('[data-component="ConfirmationPanel"]');
    expect(panel).toHaveAttribute('data-tone', 'success');
    expect(panel).toHaveAttribute('data-emphasis', 'strong');
  });

  it('subtle: a staff success that holds its explanation and code inside the panel', () => {
    render(
      <ConfirmationPanel
        emphasis="subtle"
        title="Đã gửi lên Sở"
        reference="SYT-HN-2026-118204"
        referenceLabel="Mã Sở trả về"
        headingLevel={2}
        focusOnMount={false}
        steps={[
          { label: 'Đã gửi lên Sở', state: 'done' },
          { label: 'Bộ đã nhận', state: 'current' },
        ]}
      >
        <p>Bộ Y tế chưa xác nhận.</p>
      </ConfirmationPanel>,
    );
    const heading = screen.getByRole('heading', { level: 2, name: 'Đã gửi lên Sở' });
    const root = heading.closest('[data-component="ConfirmationPanel"]')!;
    expect(root).toHaveAttribute('data-emphasis', 'subtle');
    const box = heading.parentElement!;
    expect(box).toContainElement(screen.getByText('Bộ Y tế chưa xác nhận.'));
    expect(box).toContainElement(screen.getByText('SYT-HN-2026-118204'));
    const items = screen.getAllByRole('listitem');
    // The step still waited for is current, not done: no tick, and marked for screen readers.
    expect(items[1]).toHaveAttribute('aria-current', 'step');
    expect(items[1].querySelector('[data-part="done-mark"]')).toBeNull();
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

  it('done steps carry a tick hidden from screen readers', () => {
    render(<ConfirmationPanel title="Đã gửi lên Sở" focusOnMount={false} steps={['Chờ gửi', 'Đang gửi', 'Đã gửi lên Sở']} currentStep={2} />);
    const items = screen.getAllByRole('listitem');
    const marks = items.map((li) => li.querySelector('[data-part="done-mark"]'));
    expect(marks[0]).toHaveAttribute('aria-hidden', 'true');
    expect(marks[0]).toHaveTextContent('✓');
    expect(marks[1]).not.toBeNull();
    expect(marks[2]).toBeNull();
    expect(items[0]).toHaveTextContent('✓ Chờ gửi');
  });

  it('pending: a step line with the current step marked, at the heading level asked for', () => {
    render(
      <ConfirmationPanel
        tone="pending"
        title="Chờ gửi · còn 27 giây"
        headingLevel={2}
        focusOnMount={false}
        steps={['Chờ gửi', 'Đang gửi', 'Đã gửi lên Sở', 'Bộ đã nhận']}
        currentStep={1}
      >
        <p>Hồ sơ chưa được gửi. Chị có thể hủy.</p>
      </ConfirmationPanel>,
    );
    const heading = screen.getByRole('heading', { level: 2, name: 'Chờ gửi · còn 27 giây' });
    expect(heading).not.toHaveFocus();
    // Emphasis is a success setting only: a pending panel is always pale.
    expect(heading.closest('[data-component="ConfirmationPanel"]')).not.toHaveAttribute('data-emphasis');
    const list = screen.getByRole('list', { name: 'Tiến trình' });
    const items = screen.getAllByRole('listitem');
    expect(list).toContainElement(items[0]);
    expect(items.map((li) => li.getAttribute('data-state'))).toEqual(['done', 'current', 'todo', 'todo']);
    expect(items[1]).toHaveAttribute('aria-current', 'step');
    // The explanation sits inside the pending panel, with the title.
    expect(screen.getByText('Hồ sơ chưa được gửi. Chị có thể hủy.').closest('div')!.parentElement).toContainElement(
      screen.getByRole('heading', { level: 2 }),
    );
  });

  it('uses explicit step states and never infers a later step from an earlier one', () => {
    render(
      <ConfirmationPanel
        tone="pending"
        title="Chưa gửi được lên Sở"
        focusOnMount={false}
        steps={[
          { label: 'Chờ gửi', state: 'done' },
          { label: 'Đang gửi', state: 'failed' },
          { label: 'Đã gửi lên Sở', state: 'todo' },
        ]}
      />,
    );
    const items = screen.getAllByRole('listitem');
    expect(items.map((li) => li.getAttribute('data-state'))).toEqual(['done', 'failed', 'todo']);
    expect(items[1]).toHaveTextContent('Lỗi: Đang gửi');
    expect(items.some((li) => li.getAttribute('aria-current'))).toBe(false);
  });
});
