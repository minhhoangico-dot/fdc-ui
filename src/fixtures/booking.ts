import type { TimeSlot } from '../components/molecules/TimeSlotPicker';

/** Realistic Saturday at the clinic: morning mostly taken, afternoon open. */
export const saturdaySlots: TimeSlot[] = [
  { time: '07:30', taken: true }, { time: '08:00', taken: true }, { time: '08:30' }, { time: '09:00', taken: true },
  { time: '09:30' }, { time: '10:00', taken: true }, { time: '10:30' }, { time: '11:00', taken: true },
  { time: '14:00' }, { time: '14:30' }, { time: '15:00' }, { time: '15:30', taken: true }, { time: '16:00' }, { time: '16:30' },
];

export const fullyBooked: TimeSlot[] = saturdaySlots.map((s) => ({ ...s, taken: true }));

/** Stress data: long compound family name with stacked diacritics. */
export const longPatientName = 'Tôn Thất Nguyễn Hoàng Phương Quỳnh';
