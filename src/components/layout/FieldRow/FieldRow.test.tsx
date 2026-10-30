import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { render, screen } from '@testing-library/react';
import { Select } from '../../atoms/Select';
import { TextField } from '../../atoms/TextField';
import { Combobox } from '../../molecules/Combobox';
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

// Every field component FieldRow lines up: its root's data-component is in the subgrid rule,
// and its parts are direct children tagged label, hint, error, control (in that order).
const aligned = ['TextField', 'Combobox', 'Select'];

it('lines up every field component it lists, each exposing the four parts', () => {
  const { container } = render(
    <FieldRow>
      <TextField label="Nơi làm việc" hint="Ghi đủ tên công ty" error="Nhập nơi làm việc" />
      <Combobox label="Nghề nghiệp" options={[{ value: '4', label: 'Nhân viên trợ lý văn phòng', code: '4' }]} error="Chọn nghề nghiệp" />
      <Select label="Phân loại sức khỏe" hint="Theo kết luận của bác sĩ" error="Chọn phân loại" options={[{ value: 'II', label: 'Loại II' }]} />
    </FieldRow>,
  );
  const fields = [...(container.firstElementChild as HTMLElement).children];
  expect(fields.map((f) => f.getAttribute('data-component'))).toEqual(aligned);
  for (const field of fields) {
    const parts = [...field.children].map((c) => c.getAttribute('data-part')).filter(Boolean);
    expect(parts).toEqual(['label', 'hint', 'error', 'control']);
  }
});

it('has a subgrid rule for each field component, for every part', () => {
  // Read as text: the test runner turns CSS modules into class names and drops the rules.
  const css = readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'FieldRow.module.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const list = css.match(/:is\(([^)]*)\)/)?.[1] ?? '';
  for (const name of aligned) expect(list).toContain(`[data-component='${name}']`);
  for (const part of ['label', 'hint', 'error', 'control']) {
    expect(css).toMatch(new RegExp(`:is\\([^)]*\\) > \\[data-part='${part}'\\]`));
  }
  expect(css).toMatch(/grid-template-rows: subgrid/);
});
