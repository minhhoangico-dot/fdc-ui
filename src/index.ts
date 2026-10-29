// FDC UI: the components of the FDC Medical Group design system.
// Tokens and guidelines are mastered in Claude Design ("FDC Medical Group"); see README.md.

// The density layer ships with the components (data-density="compact" for staff tools).
import './tokens/density.css';

// Layout
export * from './components/layout/Stack';
export * from './components/layout/Inline';
export * from './components/layout/FieldRow';

// Atoms
export * from './components/atoms/Avatar';
export * from './components/atoms/Button';
export * from './components/atoms/Icon';
export * from './components/atoms/Kbd';
export * from './components/atoms/SkipLink';
export * from './components/atoms/StatusTag';
export * from './components/atoms/TextField';
export * from './components/atoms/TextLink';
export * from './components/atoms/VisuallyHidden';

// Molecules
export * from './components/molecules/Breadcrumb';
export * from './components/molecules/CareCard';
export * from './components/molecules/Combobox';
export * from './components/molecules/ConfirmationPanel';
export * from './components/molecules/DateInput';
export * from './components/molecules/FormNotice';
export * from './components/molecules/HotlineCard';
export * from './components/molecules/NewsCard';
export * from './components/molecules/NumberField';
export * from './components/molecules/Pagination';
export * from './components/molecules/PhoneInput';
export * from './components/molecules/RadioGroup';
export * from './components/molecules/SaveStatus';
export * from './components/molecules/ServiceAccordion';
export * from './components/molecules/ServiceCard';
export * from './components/molecules/SpecialtyTile';
export * from './components/molecules/SummaryList';
export * from './components/molecules/TestimonialCard';
export * from './components/molecules/TimeSlotPicker';
export * from './components/molecules/ValueCard';
export * from './components/molecules/WorkingHours';

// Organisms
export * from './components/organisms/ContactForm';
export * from './components/organisms/DataTable';
export * from './components/organisms/Dialog';
export * from './components/organisms/ErrorSummary';
export * from './components/organisms/Footer';
export * from './components/organisms/Header';
export * from './components/organisms/IdleTimeoutDialog';
export * from './components/organisms/PatientContextBar';
export * from './components/organisms/ResultLookupForm';

// Templates
export * from './components/templates/BookingStep';
export * from './components/templates/SiteLayout';
export * from './components/templates/StaffLayout';

// Utilities
export { formatVnPhone, normalizeVnPhone, telHref } from './utils/phone';
export { ageFromViDate, foldVi, formatViInteger, formatViNumber, parseViNumber } from './utils/vi';
