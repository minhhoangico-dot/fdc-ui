import { render, screen } from '@testing-library/react';
import { ConfirmationPanel } from './ConfirmationPanel';

describe('ConfirmationPanel', () => {
  it('defaults to a success panel whose h1 title takes focus', () => {
    render(<ConfirmationPanel title="Đã đặt lịch khám" reference="FDC-2410-0930" />);
    const title = screen.getByRole('heading', { level: 1, name: 'Đã đặt lịch khám' });
    expect(title).toHaveFocus();
    expect(title.closest('[data-component="ConfirmationPanel"]')).toHaveAttribute('data-tone', 'success');
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
    expect(screen.getByRole('heading', { level: 2, name: 'Chờ gửi · còn 27 giây' })).not.toHaveFocus();
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

