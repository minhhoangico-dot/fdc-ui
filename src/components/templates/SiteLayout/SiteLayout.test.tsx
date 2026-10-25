import { render, screen } from '@testing-library/react';
import { clinicFooter, clinicHeader } from '../../../fixtures/site';
import { SiteLayout } from './SiteLayout';

it('has one main landmark, a skip link to it, banner and contentinfo, and real contact text', () => {
  render(<SiteLayout header={clinicHeader} footer={clinicFooter}><p>Nội dung</p></SiteLayout>);
  expect(screen.getAllByRole('main')).toHaveLength(1);
  expect(screen.getByRole('link', { name: 'Bỏ qua, đến nội dung chính' })).toHaveAttribute('href', '#main');
  expect(screen.getByRole('banner')).toBeInTheDocument();
  expect(screen.getByRole('contentinfo')).toHaveTextContent('75 đường Hồ Mễ Trì, Phường Đại Mỗ, Hà Nội');
});
