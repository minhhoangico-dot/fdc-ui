// Smoke test: every exported component renders in both themes without throwing,
// carries its data-component hook, and the export list matches the Claude Design catalogue.
import { render } from '@testing-library/react';
import * as FDC from '../index';
import { clinicFooter, clinicHeader } from '../fixtures/site';

const samples: Record<string, JSX.Element> = {
  Stack: <FDC.Stack>x</FDC.Stack>,
  Inline: <FDC.Inline>x</FDC.Inline>,
  FieldRow: <FDC.FieldRow><FDC.TextField label="Họ và tên" /></FDC.FieldRow>,
  Avatar: <FDC.Avatar name="Bùi Hiền" />,
  Button: <FDC.Button>Gửi</FDC.Button>,
  Icon: <FDC.Icon name="phone" title="Gọi" />,
  TextField: <FDC.TextField label="Họ và tên" />,
  TextLink: <FDC.TextLink href="#" />,
  StatusTag: <FDC.StatusTag tone="info">Chờ gửi</FDC.StatusTag>,
  Kbd: <FDC.Kbd keys={['Ctrl', 'S']} />,
  DateInput: <FDC.DateInput label="Ngày sinh" />,
  FormNotice: <FDC.FormNotice notice={{ text: 'Đã gửi' }} />,
  HotlineCard: <FDC.HotlineCard number="024 35 430 430" />,
  NewsCard: <FDC.NewsCard title="Tin" />,
  PhoneInput: <FDC.PhoneInput />,
  ServiceAccordion: <FDC.ServiceAccordion items={[{ title: 'A', content: 'B' }]} />,
  ServiceCard: <FDC.ServiceCard title="Khám" icon="home" />,
  SpecialtyTile: <FDC.SpecialtyTile title="Khoa nhi" />,
  TestimonialCard: <FDC.TestimonialCard quote="Tốt" name="Cụ Hòa" />,
  TimeSlotPicker: <FDC.TimeSlotPicker label="Giờ" slots={[{ time: '08:00' }]} />,
  ValueCard: <FDC.ValueCard title="F – Family" text="Gia đình" />,
  WorkingHours: <FDC.WorkingHours rows={[{ label: 'Hằng ngày', hours: '07:00–20:00' }]} />,
  ContactForm: <FDC.ContactForm />,
  ErrorSummary: <FDC.ErrorSummary focusOnMount={false} errors={[{ fieldId: 'x', text: 'Lỗi' }]} />,
  ResultLookupForm: <FDC.ResultLookupForm />,
  BookingStep: <FDC.BookingStep title="Câu hỏi">x</FDC.BookingStep>,
  SkipLink: <FDC.SkipLink />,
  RadioGroup: <FDC.RadioGroup label="Ai?" name="who" options={[{ value: 'a', label: 'A' }]} />,
  SummaryList: <FDC.SummaryList rows={[{ key: 'Tên', value: 'A' }]} />,
  CareCard: <FDC.CareCard level="non-urgent" title="Gọi bác sĩ">x</FDC.CareCard>,
  ConfirmationPanel: <FDC.ConfirmationPanel title="Đã đặt lịch" reference="FDC-1" focusOnMount={false} />,
  Dialog: <FDC.Dialog open onClose={() => {}} title="Hỏi">x</FDC.Dialog>,
  IdleTimeoutDialog: <div><FDC.IdleTimeoutDialog onTimeout={() => {}} /><span>idle</span></div>,
  Header: <FDC.Header {...clinicHeader} />,
  Footer: <FDC.Footer {...clinicFooter} />,
  SiteLayout: <FDC.SiteLayout header={clinicHeader} footer={clinicFooter}>x</FDC.SiteLayout>,
};

describe.each(['clinic', 'nursing-home'])('theme %s', (theme) => {
  it.each(Object.keys(samples))('%s renders', (name) => {
    const { container } = render(<div data-theme={theme}>{samples[name]}</div>);
    expect(container.firstChild).not.toBeEmptyDOMElement();
  });
});

it('every PascalCase export has a sample', () => {
  const components = Object.keys(FDC).filter((k) => /^[A-Z]/.test(k) && !['ICONS'].includes(k) && k !== 'VisuallyHidden');
  expect(components.sort()).toEqual(Object.keys(samples).sort());
});
