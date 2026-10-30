import { ageFromViDate, foldVi, formatViInteger, formatViNumber, parseViNumber } from './vi';

it('folds tone marks, vowel marks and đ', () => {
  expect(foldVi('Tăng huyết áp')).toBe('tang huyet ap');
  expect(foldVi('  Đặng   Thanh Chi ')).toBe('dang thanh chi');
  expect(foldVi('Rối loạn giấc ngủ')).toBe(foldVi('roi loan giac ngu'));
});

it('reads decimal commas and dots, rejects other text', () => {
  expect(parseViNumber('52,5')).toBe(52.5);
  expect(parseViNumber(' 52.5 ')).toBe(52.5);
  expect(parseViNumber('78')).toBe(78);
  expect(parseViNumber('')).toBeNull();
  expect(parseViNumber('120/80')).toBeNaN();
  expect(parseViNumber('1.234,5')).toBeNaN();
});

it('formats numbers the Vietnamese way', () => {
  expect(formatViInteger(2033)).toBe('2.033');
  expect(formatViNumber(52.5)).toBe('52,5');
  expect(formatViNumber(78)).toBe('78');
  expect(formatViNumber(21.03, 1, 1)).toBe('21,0');
});

it('computes age from dd/mm/yyyy', () => {
  const today = new Date(2026, 9, 29);
  expect(ageFromViDate('07/07/1990', today)).toBe(36);
  expect(ageFromViDate('30/10/1990', today)).toBe(35);
  expect(ageFromViDate('1990-07-07', today)).toBeNull();
});
