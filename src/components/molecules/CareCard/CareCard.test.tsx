import { render, screen } from '@testing-library/react';
import { CareCard } from './CareCard';

it('puts the level in the heading text and offers 115 for emergencies', () => {
  render(
    <CareCard level="emergency" title="Gọi cấp cứu 115 ngay nếu:">
      <ul><li>đau ngực</li></ul>
    </CareCard>,
  );
  expect(screen.getByRole('heading', { name: 'Cấp cứu: Gọi cấp cứu 115 ngay nếu:' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Gọi 115 ngay' })).toHaveAttribute('href', 'tel:115');
});

it('has no call link below emergency level', () => {
  render(<CareCard level="urgent" title="Đến khám trong ngày">x</CareCard>);
  expect(screen.queryByRole('link')).toBeNull();
  expect(screen.getByRole('heading')).toHaveTextContent('Cần khám trong ngày:');
});
