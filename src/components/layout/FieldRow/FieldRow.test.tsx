import { render, screen } from '@testing-library/react';
import { TextField } from '../../atoms/TextField';
import { FieldRow } from './FieldRow';

it('lays fields out in a row whose TextField parts are tagged for alignment', () => {
  const { container } = render(
    <FieldRow minColumn="12rem">
      <TextField label="Họ và tên" />
      <TextField label="Mã bệnh nhân" hint="In ở góc trên phiếu khám" />
    </FieldRow>,
  );
  const row = container.firstElementChild as HTMLElement;
  expect(row).toHaveAttribute('data-component', 'FieldRow');
  expect(row.style.getPropertyValue('--field-min')).toBe('12rem');
  expect(screen.getByText('In ở góc trên phiếu khám')).toHaveAttribute('data-part', 'hint');
  expect(container.querySelectorAll('[data-part="control"]')).toHaveLength(2);
});
