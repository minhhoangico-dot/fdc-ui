import { render, screen } from '@testing-library/react';
import { FormPartNav } from '../../molecules/FormPartNav';
import { StaffLayout } from './StaffLayout';

it('is a compact page with one main, a labelled aside and action bar', () => {
  const { container } = render(
    <StaffLayout header={{ logo: { src: 'x.png', alt: 'FDC' }, items: [], appName: 'hoso' }} aside={<p>Phần</p>} actionBar={<button type="button">Lưu</button>}>
      <h1>Phiếu</h1>
    </StaffLayout>,
  );
  expect(container.firstChild).toHaveAttribute('data-density', 'compact');
  expect(screen.getByRole('main')).toHaveAttribute('id', 'main');
  expect(screen.getByRole('navigation', { name: 'Các phần của phiếu' })).toBeInTheDocument();
  expect(screen.getByRole('region', { name: 'Lưu và chuyển bước' })).toContainElement(screen.getByRole('button', { name: 'Lưu' }));
});

it('keeps one nav landmark when the aside holds a FormPartNav', () => {
  render(
    <StaffLayout header={{ logo: { src: 'x.png', alt: 'FDC' }, items: [], appName: 'hoso' }} aside={<FormPartNav items={[{ label: '4. Thể lực', count: 'còn 2', current: true }]} />}>
      <h1>Phiếu</h1>
    </StaffLayout>,
  );
  const nav = screen.getByRole('navigation', { name: 'Các phần của phiếu' });
  expect(nav).toContainElement(screen.getByRole('button', { name: '4. Thể lực · còn 2' }));
  expect(nav.querySelector('nav')).toBeNull();
});
