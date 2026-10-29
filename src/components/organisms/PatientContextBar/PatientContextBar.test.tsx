import { render, screen } from '@testing-library/react';
import { StatusTag } from '../../atoms/StatusTag';
import { PatientContextBar } from './PatientContextBar';

it('names the person as the page heading with the facts that tell people apart', () => {
  render(
    <PatientContextBar
      name="Đặng Thanh Chi"
      sex="Nữ"
      birthDate="07/07/1990"
      ageOn={new Date(2026, 9, 29)}
      idEnd="0006"
      recordCode="RD26-0006"
      organization="Công ty TNHH Rạng Đông"
      breadcrumb={[{ label: 'Việc của tôi', href: '/' }, { label: 'Người 6/2.033' }]}
      status={<StatusTag>Cần điền · còn 3 mục</StatusTag>}
    />,
  );
  const region = screen.getByRole('region', { name: 'Người đang làm' });
  expect(screen.getByRole('heading', { level: 1, name: 'Đặng Thanh Chi' })).toBeInTheDocument();
  expect(region).toHaveTextContent('Nữ·07/07/1990 (36 tuổi)·CCCD …0006·mã lượt khám RD26-0006·Công ty TNHH Rạng Đông'.replace(/·/g, ''));
  expect(screen.getByRole('navigation', { name: 'Vị trí' })).toBeInTheDocument();
  expect(screen.getByText('Cần điền · còn 3 mục')).toBeInTheDocument();
});

it('can be a level-2 heading and skips the age when the date cannot be read', () => {
  render(<PatientContextBar name="Lê Thị Hà" birthDate="1992" recordCode="RD26-0002" headingLevel={2} />);
  expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  expect(screen.queryByText(/tuổi/)).not.toBeInTheDocument();
});
