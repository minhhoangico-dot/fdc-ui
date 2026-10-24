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

  it('blocks clicks and announces busy while loading', async () => {
    const onClick = vi.fn();
    render(<Button loading onClick={onClick}>Gửi</Button>);
    const btn = screen.getByRole('button', { name: 'Đang xử lý…' });
    expect(btn).toHaveAttribute('aria-busy', 'true');
    await userEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });
});
