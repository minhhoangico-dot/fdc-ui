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
  expect(screen.getByRole('region', { name: 'Người đang làm' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { level: 1, name: 'Đặng Thanh Chi' })).toBeInTheDocument();
  // Whole chunks set apart by space, no "·" between them; the code is the bold value.
  const facts = screen.getByText('CCCD …0006').parentElement;
  expect(facts?.textContent).toBe('Nữ Sinh 07/07/1990 (36 tuổi) CCCD …0006 Mã lượt khám RD26-0006 Công ty TNHH Rạng Đông');
  expect(screen.getByText('RD26-0006').tagName).toBe('STRONG');
  expect(screen.getByRole('navigation', { name: 'Vị trí' })).toBeInTheDocument();
  expect(screen.getByText('Cần điền · còn 3 mục')).toBeInTheDocument();
});

it('leaves missing facts out and keeps a custom code label', () => {
  render(<PatientContextBar name="Nguyễn Thị Mai Anh" birthDate="29/02/1996" ageOn={new Date(2026, 9, 10)} recordCode="RD26-0007" recordCodeLabel="Mã hồ sơ" />);
  expect(screen.getByText('RD26-0007').parentElement?.parentElement?.textContent).toBe('Sinh 29/02/1996 (30 tuổi) Mã hồ sơ RD26-0007');
});

it('can be a level-2 heading and skips the age when the date cannot be read', () => {
  render(<PatientContextBar name="Lê Thị Hà" birthDate="1992" recordCode="RD26-0002" headingLevel={2} />);
  expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  expect(screen.queryByText(/tuổi/)).not.toBeInTheDocument();
  expect(screen.getByText(/^Sinh 1992$/)).toBeInTheDocument();
});

it('has a block variant for use inside a bordered block, never sticky', () => {
  render(<PatientContextBar variant="block" sticky name="Ngô Văn Nam" birthDate="15/03/1990" recordCode="RD26-0004" headingLevel={2} />);
  const region = screen.getByRole('region', { name: 'Người đang làm' });
  expect(region).toHaveAttribute('data-variant', 'block');
  expect(region).not.toHaveAttribute('data-sticky');
});
