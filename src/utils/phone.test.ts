import { formatVnPhone, normalizeVnPhone, telHref } from './phone';

describe('normalizeVnPhone', () => {
  it.each([
    ['0912 345 678', '0912345678'],
    ['0912.345.678', '0912345678'],
    ['+84 912 345 678', '0912345678'],
    ['84912345678', '0912345678'],
    ['(024) 3543 0430', '02435430430'],
  ])('accepts %s', (input, expected) => expect(normalizeVnPhone(input)).toBe(expected));

  it.each(['123', '912345678', '09123456789012', 'abc'])('rejects %s', (input) => expect(normalizeVnPhone(input)).toBeNull());
});

it('formats and links numbers', () => {
  expect(formatVnPhone('0912345678')).toBe('0912 345 678');
  expect(telHref('024 35 430 430')).toBe('tel:02435430430');
});
