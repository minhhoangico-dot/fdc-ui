import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('is a real button that defaults to type="button" and forwards ref', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Đặt lịch khám</Button>);
    const btn = screen.getByRole('button', { name: 'Đặt lịch khám' });
    expect(btn).toHaveAttribute('type', 'button');
    expect(ref.current).toBe(btn);
  });

  it('renders a link with href, e.g. tap-to-call', () => {
    render(<Button variant="hotline" href="tel:02435430430">024 35 430 430</Button>);
    expect(screen.getByRole('link', { name: '024 35 430 430' })).toHaveAttribute('href', 'tel:02435430430');
  });

  it('puts the icon after the words with iconPosition="end", before them by default', () => {
    render(
      <>
        <Button icon="simple-left">Người trước</Button>
        <Button icon="simple-right" iconPosition="end">
          Người sau
        </Button>
      </>,
    );
    const prev = screen.getByRole('button', { name: 'Người trước' });
    const next = screen.getByRole('button', { name: 'Người sau' });
    expect(prev.firstElementChild?.tagName.toLowerCase()).toBe('svg');
    expect(next.firstElementChild?.tagName.toLowerCase()).toBe('span');
    expect(next.lastElementChild?.tagName.toLowerCase()).toBe('svg');
  });

  it('as a link keeps aria-label and other attributes, so the name can add who it goes to', () => {
    render(
      <Button href="#nguoi-sau" icon="simple-right" iconPosition="end" aria-label="Người sau: Đặng Thanh Chi" id="next">
        Người sau
      </Button>,
    );
    const link = screen.getByRole('link', { name: 'Người sau: Đặng Thanh Chi' });
    expect(link).toHaveAttribute('href', '#nguoi-sau');
    expect(link).toHaveAttribute('id', 'next');
  });

  it('blocks clicks and announces busy while loading', async () => {
    const onClick = vi.fn();
    render(<Button loading onClick={onClick}>Gửi</Button>);
    const btn = screen.getByRole('button', { name: 'Đang xử lý…' });
    expect(btn).toHaveAttribute('aria-busy', 'true');
    await userEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('with disabledReason: stays in the Tab order, reads the reason and ignores clicks and keys', async () => {
    const onClick = vi.fn();
    const onSubmit = vi.fn((e: Event) => e.preventDefault());
    render(
      <form onSubmit={(e) => onSubmit(e.nativeEvent)}>
        <Button type="submit" variant="primary" disabledReason="Còn 3 mục còn thiếu." onClick={onClick}>
          Gửi lên Sở
        </Button>
      </form>,
    );
    const btn = screen.getByRole('button', { name: 'Gửi lên Sở' });
    expect(btn).not.toBeDisabled();
    expect(btn).toHaveAttribute('aria-disabled', 'true');
    expect(btn).toHaveAccessibleDescription('Còn 3 mục còn thiếu.');
    expect(screen.getByText('Còn 3 mục còn thiếu.')).toBeVisible();
    await userEvent.tab();
    expect(btn).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await userEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('keeps an existing aria-describedby next to the reason', () => {
    render(
      <>
        <p id="hint">Gửi lúc 17:00.</p>
        <Button aria-describedby="hint" disabledReason="Chưa đến giờ gửi.">
          Gửi
        </Button>
      </>,
    );
    expect(screen.getByRole('button', { name: 'Gửi' })).toHaveAccessibleDescription('Gửi lúc 17:00. Chưa đến giờ gửi.');
  });

  it('marks the variant so secondary and unavailable buttons can be told apart', () => {
    render(
      <>
        <Button>Quay lại</Button>
        <Button disabled>Lưu</Button>
      </>,
    );
    expect(screen.getByRole('button', { name: 'Quay lại' })).toHaveAttribute('data-variant', 'neutral');
    expect(screen.getByRole('button', { name: 'Lưu' })).toBeDisabled();
  });
});

