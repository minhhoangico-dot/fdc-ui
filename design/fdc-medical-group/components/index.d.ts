import * as React from 'react';

/** FDC Medical Group components — window.FDC in Claude Design, @fdc/ui in code. */

/* ===== utils/cx ===== */
/** Join class names, skipping falsy values. */
export declare const cx: (...names: Array<string | false | null | undefined>) => string;

/* ===== utils/phone ===== */
/** Href for a tap-to-call link; keeps digits and a leading +. */
export declare const telHref: (number: string) => string;
/**
 * Normalize what people type into a Vietnamese phone number: accepts spaces,
 * dots, dashes, brackets and +84/84 prefixes. Returns digits starting with 0,
 * or null when it is not a 10-digit mobile or 10–11 digit landline.
 */
export declare function normalizeVnPhone(input: string): string | null;
/** Display form: 0912 345 678 for mobiles, 024 3543 0430 for 11-digit landlines. */
export declare function formatVnPhone(digits: string): string;

/* ===== components/layout/Inline/Inline ===== */
export type InlineProps = {
    /** Gap between items, from the space-* tokens. Default 10. */
    gap?: Space;
    align?: 'start' | 'center' | 'end' | 'baseline';
    justify?: 'start' | 'center' | 'end' | 'between';
    /** Wrap onto new lines on narrow screens. Default true. */
    wrap?: boolean;
    as?: 'div' | 'ul' | 'nav';
} & HTMLAttributes<HTMLElement>;
/** Horizontal layout that wraps on narrow screens; owns the gap between items. */
export declare const Inline: import('react').ForwardRefExoticComponent<{
    /** Gap between items, from the space-* tokens. Default 10. */
    gap?: Space;
    align?: "start" | "center" | "end" | "baseline";
    justify?: "start" | "center" | "end" | "between";
    /** Wrap onto new lines on narrow screens. Default true. */
    wrap?: boolean;
    as?: "div" | "ul" | "nav";
} & HTMLAttributes<HTMLElement> & import('react').RefAttributes<HTMLElement>>;

/* ===== components/layout/Stack/Stack ===== */
export type Space = 5 | 10 | 15 | 20 | 30 | 40 | 50;
export type StackProps = {
    /** Vertical gap, from the space-* tokens. Default 15. */
    gap?: Space;
    /** Cross-axis alignment. Default stretch. */
    align?: 'start' | 'center' | 'end' | 'stretch';
    as?: 'div' | 'section' | 'ul' | 'ol' | 'form' | 'fieldset';
} & HTMLAttributes<HTMLElement>;
/** Vertical layout: owns the spacing between children so components never need margins. */
export declare const Stack: import('react').ForwardRefExoticComponent<{
    /** Vertical gap, from the space-* tokens. Default 15. */
    gap?: Space;
    /** Cross-axis alignment. Default stretch. */
    align?: "start" | "center" | "end" | "stretch";
    as?: "div" | "section" | "ul" | "ol" | "form" | "fieldset";
} & HTMLAttributes<HTMLElement> & import('react').RefAttributes<HTMLElement>>;

/* ===== components/atoms/Avatar/Avatar ===== */
export type AvatarProps = {
    /** Photo URL. Use patient and resident photos only with written consent. */
    src?: string;
    /** Person's name; used for alt text and initials. */
    name?: string;
    /** Override the computed initials. */
    initials?: string;
    alt?: string;
    /** Pixel size. Default 64. */
    size?: number;
    /** 5px brand-300 ring, as on the nursing home testimonials. */
    ring?: boolean;
    className?: string;
};
/** Initials from the last two words of a Vietnamese name: "Bùi Hiền" → "BH". */
export declare function initialsOf(name?: string): string;
/** Round photo, or initials on brand-100 when there is no photo (the safe default). */
export declare function Avatar({ src, name, initials, alt, size, ring, className }: AvatarProps): import("react").JSX.Element;

/* ===== components/atoms/Button/Button ===== */
export type ButtonProps = {
    /** neutral = grey; primary = brand (one per view); hotline = pink, only for calling the hotline. Default neutral. */
    variant?: 'neutral' | 'primary' | 'hotline';
    /** Renders a link that looks like a button (for example href="tel:02435430430"). */
    href?: string;
    /** Leading icon. */
    icon?: IconName;
    /** Full width (recommended on phones for the main action). */
    block?: boolean;
    /** Shows a busy state and blocks repeat clicks while a request runs. */
    loading?: boolean;
    /** Label read during loading. Default "Đang xử lý…". */
    loadingLabel?: string;
    children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;
/** The action button: 48px tall, sentence-case label. Write labels verb first: "Đặt lịch khám". */
export declare const Button: import('react').ForwardRefExoticComponent<{
    /** neutral = grey; primary = brand (one per view); hotline = pink, only for calling the hotline. Default neutral. */
    variant?: "neutral" | "primary" | "hotline";
    /** Renders a link that looks like a button (for example href="tel:02435430430"). */
    href?: string;
    /** Leading icon. */
    icon?: IconName;
    /** Full width (recommended on phones for the main action). */
    block?: boolean;
    /** Shows a busy state and blocks repeat clicks while a request runs. */
    loading?: boolean;
    /** Label read during loading. Default "Đang xử lý…". */
    loadingLabel?: string;
    children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement> & import('react').RefAttributes<HTMLButtonElement>>;

/* ===== components/atoms/Icon/Icon ===== */
export type IconProps = {
    name: IconName;
    /** Pixel size. Default 16; 12–16 inline with text, 24–40 in cards. */
    size?: number;
    /** Accessible name. Omit for decorative icons (hidden from screen readers). */
    title?: string;
} & Omit<SVGAttributes<SVGSVGElement>, 'name'>;
/** Single-ink glyph that takes the surrounding text color. Set color on the parent, never on the icon. */
export declare function Icon({ name, size, title, className, ...rest }: IconProps): import("react").JSX.Element | null;

/* ===== components/atoms/Icon/icons ===== */
export type IconName = 'building-alt' | 'certificate' | 'comment' | 'double-left' | 'double-right' | 'envelope' | 'eye' | 'home' | 'location-pin' | 'minus' | 'navigation-menu' | 'pencil-alt-2' | 'phone' | 'play-alt-1' | 'plus' | 'rounded-down' | 'rounded-up' | 'search-1' | 'simple-left' | 'simple-right' | 'telephone' | 'ui-calendar' | 'ui-messaging' | 'ui-user';
export declare const iconNames: IconName[];

/* ===== components/atoms/TextField/TextField ===== */
export type TextFieldProps = {
    /** Visible label. Always pass one; placeholders never replace it. */
    label: string;
    /** Hide the label visually (still read by screen readers) only when a visible heading already names the field. */
    hideLabel?: boolean;
    /** Help text between the label and the field. */
    hint?: string;
    /** Error message; shown under the label with a thicker red border. */
    error?: string;
    /** Screen-reader prefix before the error. Default "Lỗi:". */
    errorPrefix?: string;
    /** Leading icon (the nursing home's icon-led fields). */
    icon?: IconName;
    /** Renders a resizable textarea. */
    multiline?: boolean;
    rows?: number;
    type?: 'text' | 'tel' | 'email' | 'number' | 'search' | 'password';
    onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onBlur?: (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange' | 'onBlur'>;
/** A labeled input or textarea with hint and error, for every FDC form. The consumer owns the value and validation. */
export declare const TextField: import('react').ForwardRefExoticComponent<{
    /** Visible label. Always pass one; placeholders never replace it. */
    label: string;
    /** Hide the label visually (still read by screen readers) only when a visible heading already names the field. */
    hideLabel?: boolean;
    /** Help text between the label and the field. */
    hint?: string;
    /** Error message; shown under the label with a thicker red border. */
    error?: string;
    /** Screen-reader prefix before the error. Default "Lỗi:". */
    errorPrefix?: string;
    /** Leading icon (the nursing home's icon-led fields). */
    icon?: IconName;
    /** Renders a resizable textarea. */
    multiline?: boolean;
    rows?: number;
    type?: "text" | "tel" | "email" | "number" | "search" | "password";
    onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onBlur?: (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "onBlur" | "onChange" | "type"> & import('react').RefAttributes<HTMLInputElement | HTMLTextAreaElement>>;

/* ===== components/atoms/TextLink/TextLink ===== */
export type TextLinkProps = {
    /** Default "Xem chi tiết". Prefer a specific label when the destination is not obvious. */
    children?: ReactNode;
    /** Show the double chevron. Default true. */
    arrow?: boolean;
} & AnchorHTMLAttributes<HTMLAnchorElement>;
/** The "Xem chi tiết »" link that ends cards and panels. For a main action use Button. */
export declare const TextLink: import('react').ForwardRefExoticComponent<{
    /** Default "Xem chi tiết". Prefer a specific label when the destination is not obvious. */
    children?: ReactNode;
    /** Show the double chevron. Default true. */
    arrow?: boolean;
} & AnchorHTMLAttributes<HTMLAnchorElement> & import('react').RefAttributes<HTMLAnchorElement>>;

/* ===== components/atoms/VisuallyHidden/VisuallyHidden ===== */
/** Text for screen readers only, such as the "Lỗi:" prefix before an error message. */
export declare function VisuallyHidden({ className, ...rest }: HTMLAttributes<HTMLSpanElement>): import("react").JSX.Element;

/* ===== components/molecules/DateInput/DateInput ===== */
export type DateInputProps = {
    /** The question, read as the group's legend: "Ngày sinh của người bệnh". */
    label: string;
    /** Default "Ví dụ: 27 3 1950". */
    hint?: string;
    error?: string;
    errorPrefix?: string;
    /** Adds bday-* autocomplete so browsers can fill a date of birth. Default true. */
    birthday?: boolean;
    /** Field names become `${name}-day`, `${name}-month`, `${name}-year`. */
    name?: string;
    value?: DateParts;
    defaultValue?: DateParts;
    onValueChange?: (value: DateParts) => void;
    /** Part labels. Default Ngày / Tháng / Năm. */
    partLabels?: {
        day: string;
        month: string;
        year: string;
    };
    required?: boolean;
    /** Base id; the parts get `${id}-day`, `${id}-month`, `${id}-year` (link an error summary to `${id}-day`). */
    id?: string;
    className?: string;
};
/**
 * A date people already know (date of birth), typed as three boxes: Ngày / Tháng / Năm.
 * Typing beats a calendar picker for older users; use partsToDate() to validate.
 */
export declare function DateInput({ label, hint, error, errorPrefix, birthday, name, value, defaultValue, onValueChange, partLabels, required, id: givenId, className, }: DateInputProps): import("react").JSX.Element;

/* ===== components/molecules/DateInput/dateParts ===== */
export type DateParts = {
    day: string;
    month: string;
    year: string;
};
/** A real calendar date from typed parts, or null. Accepts 1–2 digit day/month and a 4-digit year. */
export declare function partsToDate({ day, month, year }: DateParts): Date | null;
/** ISO yyyy-mm-dd for APIs. */
export declare const partsToIso: (p: DateParts) => string | null;

/* ===== components/molecules/FormNotice/FormNotice ===== */
export type FormNoticeValue = {
    type?: 'info' | 'success' | 'error';
    text: string;
};
export type FormNoticeProps = {
    notice?: FormNoticeValue | null;
    className?: string;
};
/** Status line under a form ("Đã gửi…"), announced by screen readers without moving focus. */
export declare function FormNotice({ notice, className }: FormNoticeProps): import("react").JSX.Element;

/* ===== components/molecules/HotlineCard/HotlineCard ===== */
export type HotlineCardProps = {
    /** As printed, e.g. "024 35 430 430" (clinic) or "096 583 7777" (nursing home). */
    number: string;
    /** Default "Tổng đài". */
    label?: string;
    /** inline = header and sticky bars; framed = contact sections. */
    variant?: 'inline' | 'framed';
    /** Small line under the framed number, e.g. "Hỗ trợ 24/7". */
    note?: string;
    className?: string;
};
/**
 * Tap-to-call hotline. Keep it in the same place on every page (WCAG 3.2.6).
 * The number is always selectable text, so it still works where tel: links do nothing.
 */
export declare function HotlineCard({ number, label, variant, note, className }: HotlineCardProps): import("react").JSX.Element;

/* ===== components/molecules/NewsCard/NewsCard ===== */
export type NewsCardProps = {
    title: string;
    excerpt?: string;
    image?: string;
    /** Pre-formatted dd/mm/yyyy, e.g. "12/10/2026". */
    date?: string;
    href?: string;
    headingLevel?: 2 | 3 | 4;
    className?: string;
};
/** Article teaser: image, date, title, excerpt. The image takes the leaf corner in the nursing-home theme. */
export declare function NewsCard({ title, excerpt, image, date, href, headingLevel, className }: NewsCardProps): import("react").JSX.Element;

/* ===== components/molecules/PhoneInput/PhoneInput ===== */
export type PhoneInputProps = {
    /** Default "Số điện thoại". */
    label?: string;
    /** Default "Ví dụ: 0912 345 678". */
    hint?: string;
    /** Called with the normalized digits (0912345678), or null while incomplete or invalid. */
    onPhoneChange?: (digits: string | null, raw: string) => void;
} & Omit<TextFieldProps, 'label' | 'type' | 'inputMode' | 'autoComplete'>;
/**
 * Phone field that accepts how people really type: spaces, dots, dashes, +84.
 * Tidies the number on blur (0912 345 678); validate with normalizeVnPhone().
 */
export declare const PhoneInput: import('react').ForwardRefExoticComponent<{
    /** Default "Số điện thoại". */
    label?: string;
    /** Default "Ví dụ: 0912 345 678". */
    hint?: string;
    /** Called with the normalized digits (0912345678), or null while incomplete or invalid. */
    onPhoneChange?: (digits: string | null, raw: string) => void;
} & Omit<TextFieldProps, "inputMode" | "type" | "autoComplete" | "label"> & import('react').RefAttributes<HTMLInputElement | HTMLTextAreaElement>>;

/* ===== components/molecules/ServiceAccordion/ServiceAccordion ===== */
export type ServiceAccordionItem = {
    title: string;
    content: string;
    href?: string;
    moreLabel?: string;
};
export type ServiceAccordionProps = {
    items: ServiceAccordionItem[];
    /** Index open at start; -1 for all closed. Default 0. */
    defaultOpen?: number;
    headingLevel?: 2 | 3 | 4;
    className?: string;
};
/** Expandable list of services, one open at a time. Headers are buttons with aria-expanded. */
export declare function ServiceAccordion({ items, defaultOpen, headingLevel, className }: ServiceAccordionProps): import("react").JSX.Element;

/* ===== components/molecules/ServiceCard/ServiceCard ===== */
export type ServiceCardProps = {
    title: string;
    /** About 30 words; clamps at four lines. */
    excerpt?: string;
    /** Illustration URL (Claude Design › Assets › Services). Decorative. */
    image?: string;
    /** Used when there is no image. */
    icon?: IconName;
    /** Makes the whole card a link. */
    href?: string;
    /** Bottom link text; false hides it. Default "Xem chi tiết". */
    moreLabel?: string | false;
    headingLevel?: 2 | 3 | 4;
    className?: string;
};
/** Centered card for one service line: illustration, title, excerpt, optional link. */
export declare function ServiceCard({ title, excerpt, image, icon, href, moreLabel, headingLevel, className }: ServiceCardProps): import("react").JSX.Element;

/* ===== components/molecules/SpecialtyTile/SpecialtyTile ===== */
export type SpecialtyTileProps = {
    /** One line: "Khoa nhi", "Tai - Mũi - Họng". */
    title: string;
    /** White icon URL (Claude Design › Assets › Specialties). */
    image?: string;
    icon?: IconName;
    href?: string;
    className?: string;
};
/** A 60px row: brand-colored square with a white icon, then the specialty name. Follows the theme. */
export declare function SpecialtyTile({ title, image, icon, href, className }: SpecialtyTileProps): import("react").JSX.Element;

/* ===== components/molecules/TestimonialCard/TestimonialCard ===== */
export type TestimonialCardProps = {
    /** Real words, unedited, short. */
    quote: string;
    name: string;
    role?: string;
    /** Photo URL, only with written consent; initials otherwise. */
    photo?: string;
    /** Default 120. */
    avatarSize?: number;
    className?: string;
};
/** A quote from a resident, family member or patient with a ringed avatar. */
export declare function TestimonialCard({ quote, name, role, photo, avatarSize, className }: TestimonialCardProps): import("react").JSX.Element;

/* ===== components/molecules/TimeSlotPicker/TimeSlotPicker ===== */
export type TimeSlot = {
    /** 24-hour "HH:mm", Hanoi time. */
    time: string;
    /** Already booked: shown, but cannot be chosen. */
    taken?: boolean;
};
export type TimeSlotPickerProps = {
    /** The question, e.g. "Chọn giờ khám, thứ Bảy 24/10". */
    label: string;
    slots: TimeSlot[];
    hint?: string;
    error?: string;
    errorPrefix?: string;
    /** Form field name. Default "time". */
    name?: string;
    value?: string;
    defaultValue?: string;
    onValueChange?: (time: string) => void;
    /** Text on a taken slot. Default "Đã kín". */
    takenLabel?: string;
    /** Shown when no slot is free. */
    emptyText?: string;
    required?: boolean;
    /** id placed on the first free slot's radio, so an ErrorSummary can link to it. */
    id?: string;
    className?: string;
};
/**
 * Pick one appointment time from a day's slots. Native radios inside a fieldset:
 * arrow keys move between free times, taken times stay visible but disabled, with words not just color.
 * The chosen tile fills with the brand color: a large lightness change, not hue alone.
 */
export declare function TimeSlotPicker({ label, slots, hint, error, errorPrefix, name, value, defaultValue, onValueChange, takenLabel, emptyText, required, id: firstSlotId, className, }: TimeSlotPickerProps): import("react").JSX.Element;

/* ===== components/molecules/ValueCard/ValueCard ===== */
export type ValueCardProps = {
    /** "F – Family" */
    title: string;
    text?: string;
    children?: ReactNode;
    className?: string;
};
/** Bordered box for one brand value or promise. The title stays group blue in every theme. */
export declare function ValueCard({ title, text, children, className }: ValueCardProps): import("react").JSX.Element;

/* ===== components/molecules/WorkingHours/WorkingHours ===== */
export type WorkingHoursProps = {
    /** Default "Thời gian làm việc". */
    title?: string;
    /** Times as 07:00–20:00 with an en dash. */
    rows: {
        label: string;
        hours: string;
    }[];
    note?: string;
    className?: string;
};
/** Opening hours as a short labeled list. */
export declare function WorkingHours({ title, rows, note, className }: WorkingHoursProps): import("react").JSX.Element;

/* ===== components/organisms/ContactForm/ContactForm ===== */
export type ContactValues = {
    name: string;
    phone: string;
    message: string;
};
export type ContactFormProps = {
    /** Called only when name and phone are valid; phone is digits. */
    onSubmit?: (values: ContactValues) => void;
    /** Default "Gửi liên hệ". */
    title?: string;
    intro?: string;
    messageHint?: string;
    /** Default "Gửi liên hệ". */
    submitLabel?: string;
    submitting?: boolean;
    notice?: FormNoticeValue | null;
    headingLevel?: 2 | 3;
    className?: string;
};
/** Contact request (name, phone, optional message) with an error summary. Pair with a framed HotlineCard. */
export declare function ContactForm({ onSubmit, title, intro, messageHint, submitLabel, submitting, notice, headingLevel, className, }: ContactFormProps): import("react").JSX.Element;

/* ===== components/organisms/ErrorSummary/ErrorSummary ===== */
export type ErrorSummaryItem = {
    /** id of the input to focus, e.g. "lookup-phone" or a DateInput's "<id>-day". */
    fieldId: string;
    /** Same words as the field's own message: "Nhập số điện thoại gồm 10 chữ số". */
    text: string;
};
export type ErrorSummaryProps = {
    errors: ErrorSummaryItem[];
    /** Default "Vui lòng kiểm tra lại thông tin". */
    title?: string;
    /** Move focus here when it appears (after a failed submit). Default true. */
    focusOnMount?: boolean;
    className?: string;
};
/**
 * The list of problems at the top of a form after a failed submit. Each item links to its field.
 * Render it only when there are errors; it takes focus so screen-reader and keyboard users land on it.
 */
export declare function ErrorSummary({ errors, title, focusOnMount, className }: ErrorSummaryProps): import("react").JSX.Element | null;

/* ===== components/organisms/ResultLookupForm/ResultLookupForm ===== */
export type ResultLookupValues = {
    visitDate: string;
    birthYear: string;
    phone: string;
    patientCode: string;
};
export type ResultLookupFormProps = {
    /** Called only when all four fields are valid; visitDate is yyyy-mm-dd, phone is digits. */
    onSubmit?: (values: ResultLookupValues) => void;
    /** Default "Tra cứu kết quả xét nghiệm". */
    title?: string;
    /** Default "Xem kết quả". */
    submitLabel?: string;
    submitting?: boolean;
    notice?: FormNoticeValue | null;
    headingLevel?: 2 | 3;
    className?: string;
};
/** The clinic's lab-result lookup: visit date, birth year, phone and patient code, with an error summary. */
export declare function ResultLookupForm({ onSubmit, title, submitLabel, submitting, notice, headingLevel, className, }: ResultLookupFormProps): import("react").JSX.Element;

/* ===== components/templates/BookingStep/BookingStep ===== */
export type BookingStepProps = {
    /** The one question this step asks; becomes the page h1. */
    title: string;
    /** Progress in words, e.g. "Bước 2 trên 4". */
    progress?: string;
    /** Short help under the title. */
    hint?: ReactNode;
    /** Slot for an ErrorSummary after a failed submit. */
    errorSummary?: ReactNode;
    /** The step's fields. */
    children: ReactNode;
    /** Back link. Omit on the first step. */
    backHref?: string;
    /** Default "Quay lại". */
    backLabel?: string;
    /** Default "Tiếp tục". */
    continueLabel?: string;
    onContinue?: (e: FormEvent<HTMLFormElement>) => void;
    submitting?: boolean;
    /** Clinic hotline by default, always in the same place (WCAG 3.2.6). */
    hotline?: {
        number: string;
        label?: string;
    } | false;
    className?: string;
};
/**
 * One question per page, as in GOV.UK/NHS booking flows: back link, progress, question as h1,
 * error summary, fields, one primary action, hotline. Layout only; the page supplies the content.
 */
export declare function BookingStep({ title, progress, hint, errorSummary, children, backHref, backLabel, continueLabel, onContinue, submitting, hotline, className, }: BookingStepProps): import("react").JSX.Element;
