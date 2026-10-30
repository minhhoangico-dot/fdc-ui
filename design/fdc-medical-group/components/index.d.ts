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

/* ===== utils/vi ===== */
/**
 * Fold Vietnamese text for searching: lower case, tone marks and vowel marks removed, đ → d.
 * "Tăng huyết áp" and "tang huyet ap" fold to the same string, so staff can type without Telex.
 */
export declare function foldVi(text: string): string;
/** 2033 → "2.033" (Vietnamese grouping). */
export declare const formatViInteger: (n: number) => string;
/**
 * Read a number the way Vietnamese staff type it: "52,5" and "52.5" both mean 52.5.
 * Returns null for empty input and NaN for anything that is not a plain number.
 */
export declare function parseViNumber(text: string): number | null;
/** 52.5 → "52,5"; keeps at most `decimals` digits after the comma, and at least `minDecimals` (21 → "21,0" for a BMI). */
export declare function formatViNumber(n: number, decimals?: number, minDecimals?: number): string;
/** Age in whole years on `today` for a date written dd/mm/yyyy; null when the date cannot be read. */
export declare function ageFromViDate(date: string, today?: Date): number | null;

/* ===== components/layout/FieldRow/FieldRow ===== */
export type FieldRowProps = {
    /** Narrowest a column may get before fields wrap onto the next line. Default "15rem". */
    minColumn?: string;
} & HTMLAttributes<HTMLDivElement>;
/**
 * Fields side by side in a form (Họ và tên · Ngày sinh · Số điện thoại). Labels line up with labels and
 * inputs with inputs, even when only some fields have a hint or an error. Wraps to one column on phones.
 *
 * Lines up TextField, NumberField (a TextField), Combobox and Select, in any mix. A new field component
 * lines up only when it tags its parts data-part="label" | "hint" | "error" | "control" (in that order,
 * as direct children of its root) and its data-component is added to the list in FieldRow.module.css.
 */
export declare const FieldRow: import('react').ForwardRefExoticComponent<{
    /** Narrowest a column may get before fields wrap onto the next line. Default "15rem". */
    minColumn?: string;
} & HTMLAttributes<HTMLDivElement> & import('react').RefAttributes<HTMLDivElement>>;

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
    /**
     * neutral = secondary: white with a brand edge, so it never looks unavailable (default);
     * primary = brand fill, one per screen state; hotline = pink, only for calling the hotline.
     */
    variant?: 'neutral' | 'primary' | 'hotline';
    /** Renders a link that looks like a button (for example href="tel:02435430430"). */
    href?: string;
    /** A glyph beside the label. */
    icon?: IconName;
    /**
     * Where the icon sits. Default "start". Use "end" for "next" and "forward" actions, so the arrow points the way it
     * goes and sits where the eye ends: "Người sau ›", like "5. Lâm sàng ›" and "Sau ›" elsewhere.
     */
    iconPosition?: 'start' | 'end';
    /** Full width (recommended on phones for the main action). */
    block?: boolean;
    /** Shows a busy state and blocks repeat clicks while a request runs. */
    loading?: boolean;
    /** Label read during loading. Default "Đang xử lý…". */
    loadingLabel?: string;
    /**
     * Why the button cannot be used yet, shown right next to it ("Chọn một dòng ở trên trước.").
     * Setting it makes the button unavailable but still reachable with Tab, so screen readers read the reason;
     * clicks do nothing. Prefer it to a bare `disabled`: an unavailable button always says why.
     */
    disabledReason?: string;
    children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;
/** The action button: 48px tall, sentence-case label. Write labels verb first: "Đặt lịch khám". */
export declare const Button: import('react').ForwardRefExoticComponent<{
    /**
     * neutral = secondary: white with a brand edge, so it never looks unavailable (default);
     * primary = brand fill, one per screen state; hotline = pink, only for calling the hotline.
     */
    variant?: "neutral" | "primary" | "hotline";
    /** Renders a link that looks like a button (for example href="tel:02435430430"). */
    href?: string;
    /** A glyph beside the label. */
    icon?: IconName;
    /**
     * Where the icon sits. Default "start". Use "end" for "next" and "forward" actions, so the arrow points the way it
     * goes and sits where the eye ends: "Người sau ›", like "5. Lâm sàng ›" and "Sau ›" elsewhere.
     */
    iconPosition?: "start" | "end";
    /** Full width (recommended on phones for the main action). */
    block?: boolean;
    /** Shows a busy state and blocks repeat clicks while a request runs. */
    loading?: boolean;
    /** Label read during loading. Default "Đang xử lý…". */
    loadingLabel?: string;
    /**
     * Why the button cannot be used yet, shown right next to it ("Chọn một dòng ở trên trước.").
     * Setting it makes the button unavailable but still reachable with Tab, so screen readers read the reason;
     * clicks do nothing. Prefer it to a bare `disabled`: an unavailable button always says why.
     */
    disabledReason?: string;
    children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement> & import('react').RefAttributes<HTMLButtonElement>>;

/* ===== components/atoms/Checkbox/Checkbox ===== */
export type CheckboxProps = {
    /** What ticking means, said as a statement: "Tôi đã xem phần nhập tay". */
    label: ReactNode;
    /** Help under the label, lined up with its text: "1 kết quả nhập tay: X-quang tim phổi". */
    hint?: ReactNode;
    /** Error message; shown above the box with one red bar on the left. */
    error?: string;
    /** Screen-reader prefix before the error. Default "Lỗi:". */
    errorPrefix?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>;
/**
 * One yes/no statement the person ticks: a native checkbox inside its label, so the whole row
 * (at least 44px tall) is the click target. For one choice from a list, use RadioGroup.
 * The consumer owns the value and validation (checked / defaultChecked / onChange).
 */
export declare const Checkbox: import('react').ForwardRefExoticComponent<{
    /** What ticking means, said as a statement: "Tôi đã xem phần nhập tay". */
    label: ReactNode;
    /** Help under the label, lined up with its text: "1 kết quả nhập tay: X-quang tim phổi". */
    hint?: ReactNode;
    /** Error message; shown above the box with one red bar on the left. */
    error?: string;
    /** Screen-reader prefix before the error. Default "Lỗi:". */
    errorPrefix?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & import('react').RefAttributes<HTMLInputElement>>;

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

/* ===== components/atoms/Kbd/Kbd ===== */
export type KbdProps = {
    /** A key combination, e.g. ['Ctrl', 'S']: one key cap each, joined by the separator. */
    keys?: string[];
    /** Shown between keys. Default " + ". */
    separator?: string;
    /** A single key, when `keys` is not given. */
    children?: ReactNode;
} & HTMLAttributes<HTMLElement>;
/**
 * A keyboard key, for the shortcut hint shown where a shortcut works: "Ctrl + S lưu".
 * Staff tools use Ctrl combinations only: single-letter shortcuts fire by accident while typing Vietnamese (Telex).
 */
export declare const Kbd: import('react').ForwardRefExoticComponent<{
    /** A key combination, e.g. ['Ctrl', 'S']: one key cap each, joined by the separator. */
    keys?: string[];
    /** Shown between keys. Default " + ". */
    separator?: string;
    /** A single key, when `keys` is not given. */
    children?: ReactNode;
} & HTMLAttributes<HTMLElement> & import('react').RefAttributes<HTMLElement>>;

/* ===== components/atoms/Select/Select ===== */
export type SelectOption = {
    value: string;
    /** What the person reads: "Cần điền hoặc sửa · 1.019". */
    label: string;
    disabled?: boolean;
};
export type SelectProps = {
    /** Visible label. Always pass one. */
    label: string;
    /** Hide the label visually (still read by screen readers) only when a visible heading already names the field. */
    hideLabel?: boolean;
    /** Help text between the label and the field. */
    hint?: string;
    /** Error message; shown under the label with a thicker red border. */
    error?: string;
    /** Screen-reader prefix before the error. Default "Lỗi:". */
    errorPrefix?: string;
    /** The choices. Or pass <option>/<optgroup> elements as children. */
    options?: SelectOption[];
    children?: ReactNode;
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'>;
/**
 * One choice from a list, as a native select dressed like a TextField (same parts, height and edge),
 * so it lines up in a FieldRow. Use it where tiles would take too much room: a list filter on a phone,
 * a long fixed list. For a short question on its own page use RadioGroup; for coded items people type
 * to find, Combobox. The consumer owns the value (value / defaultValue / onChange).
 */
export declare const Select: import('react').ForwardRefExoticComponent<{
    /** Visible label. Always pass one. */
    label: string;
    /** Hide the label visually (still read by screen readers) only when a visible heading already names the field. */
    hideLabel?: boolean;
    /** Help text between the label and the field. */
    hint?: string;
    /** Error message; shown under the label with a thicker red border. */
    error?: string;
    /** Screen-reader prefix before the error. Default "Lỗi:". */
    errorPrefix?: string;
    /** The choices. Or pass <option>/<optgroup> elements as children. */
    options?: SelectOption[];
    children?: ReactNode;
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> & import('react').RefAttributes<HTMLSelectElement>>;

/* ===== components/atoms/SkipLink/SkipLink ===== */
export type SkipLinkProps = {
    /** id of the main content. Default "main". */
    targetId?: string;
    /** Default "Bỏ qua, đến nội dung chính". */
    label?: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>;
/** First focusable element on every page: lets keyboard and screen-reader users jump past the header. Visible only on focus. */
export declare function SkipLink({ targetId, label, className, ...rest }: SkipLinkProps): import("react").JSX.Element;

/* ===== components/atoms/StatusTag/StatusTag ===== */
export type StatusTagTone = 'neutral' | 'muted' | 'info' | 'success' | 'error' | 'attention'
/** @deprecated Since 2.4: no screen used it, and in the nursing-home theme it looked like the orange primary button. Shown as neutral; removed in 3.0. */
 | 'strong';
export type StatusTagProps = {
    /**
     * Tinted fills with no edge, so a tag never reads as a button. No tag is solid.
     * - neutral (default): grey fill, a state with no color of its own ("Cần điền", "Sẵn sàng xem lại").
     * - muted: the same pale grey fill with muted words and no dot, the quietest tag: a source rather than a state
     *   ("Nhập tay"), or a record nothing has been typed into yet ("Chưa điền").
     * - info: pending work ("Chờ gửi", "Đang gửi"); never green for pending.
     * - success: done and confirmed by the other side ("Sở đã tiếp nhận", "Bộ đã xác nhận").
     * - error: something must be fixed before going on ("Cần sửa", "Bị từ chối").
     * - attention: worth a look, not an input error: a value outside the normal range ("Cao", "Thấp") or an
     *   outcome not known yet ("Chưa rõ kết quả").
     * - strong: deprecated, shown as neutral.
     */
    tone?: StatusTagTone;
    /** sm sits next to a value in tables and summaries; md (default) stands alone. */
    size?: 'sm' | 'md';
    /** Always words: the tag must make sense without its color. */
    children: ReactNode;
} & HTMLAttributes<HTMLSpanElement>;
/**
 * A rounded status label for staff tools: "Cao", "Nhập tay", "Chờ gửi", "Sở đã tiếp nhận".
 * It is text, not a control; when the state needs an action, put a Button next to it.
 */
export declare const StatusTag: import('react').ForwardRefExoticComponent<{
    /**
     * Tinted fills with no edge, so a tag never reads as a button. No tag is solid.
     * - neutral (default): grey fill, a state with no color of its own ("Cần điền", "Sẵn sàng xem lại").
     * - muted: the same pale grey fill with muted words and no dot, the quietest tag: a source rather than a state
     *   ("Nhập tay"), or a record nothing has been typed into yet ("Chưa điền").
     * - info: pending work ("Chờ gửi", "Đang gửi"); never green for pending.
     * - success: done and confirmed by the other side ("Sở đã tiếp nhận", "Bộ đã xác nhận").
     * - error: something must be fixed before going on ("Cần sửa", "Bị từ chối").
     * - attention: worth a look, not an input error: a value outside the normal range ("Cao", "Thấp") or an
     *   outcome not known yet ("Chưa rõ kết quả").
     * - strong: deprecated, shown as neutral.
     */
    tone?: StatusTagTone;
    /** sm sits next to a value in tables and summaries; md (default) stands alone. */
    size?: "sm" | "md";
    /** Always words: the tag must make sense without its color. */
    children: ReactNode;
} & HTMLAttributes<HTMLSpanElement> & import('react').RefAttributes<HTMLSpanElement>>;

/* ===== components/atoms/TextField/TextField ===== */
/** A text the message line keeps room for: a hint, or an error (drawn with its "!" sign). */
export type TextFieldReserve = string | {
    error: string;
};
export type TextFieldProps = {
    /** Visible label. Always pass one; placeholders never replace it. */
    label: string;
    /** Hide the label visually (still read by screen readers) only when a visible heading already names the field. */
    hideLabel?: boolean;
    /** Help text between the label and the field. Usually a string; NumberField passes its "Cao" tag line. */
    hint?: ReactNode;
    /** Error message; shown above the field with a "!" sign and a thicker red border. */
    error?: string;
    /** Screen-reader prefix before the error. Default "Lỗi:". */
    errorPrefix?: string;
    /**
     * One stable message line above the box, for a field whose help changes while the person works in it
     * (NumberField). Setting it, even to [], puts the error in the hint's place instead of a line of its own, and the
     * line keeps the room of the tallest text listed here (and at least one line), so the box never moves when the
     * hint, a tag or an error comes or goes. The texts are drawn hidden from CSS, so they are not in the page text.
     */
    reserve?: TextFieldReserve[];
    /** Leading icon (the nursing home's icon-led fields). */
    icon?: IconName;
    /** Unit shown inside the box on the right ("kg", "lần/phút"), and read after the label. */
    unit?: string;
    /**
     * @deprecated Since 2.4: a tag beside the box takes the box's width, so a typed value can be cut off and boxes in a
     * column stop lining up. Put a tag in the hint line instead (NumberField does). Still drawn beside the box; removed in 3.0.
     */
    after?: ReactNode;
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
    /** Help text between the label and the field. Usually a string; NumberField passes its "Cao" tag line. */
    hint?: ReactNode;
    /** Error message; shown above the field with a "!" sign and a thicker red border. */
    error?: string;
    /** Screen-reader prefix before the error. Default "Lỗi:". */
    errorPrefix?: string;
    /**
     * One stable message line above the box, for a field whose help changes while the person works in it
     * (NumberField). Setting it, even to [], puts the error in the hint's place instead of a line of its own, and the
     * line keeps the room of the tallest text listed here (and at least one line), so the box never moves when the
     * hint, a tag or an error comes or goes. The texts are drawn hidden from CSS, so they are not in the page text.
     */
    reserve?: TextFieldReserve[];
    /** Leading icon (the nursing home's icon-led fields). */
    icon?: IconName;
    /** Unit shown inside the box on the right ("kg", "lần/phút"), and read after the label. */
    unit?: string;
    /**
     * @deprecated Since 2.4: a tag beside the box takes the box's width, so a typed value can be cut off and boxes in a
     * column stop lining up. Put a tag in the hint line instead (NumberField does). Still drawn beside the box; removed in 3.0.
     */
    after?: ReactNode;
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
    /**
     * The mark beside the words, hidden from screen readers so the link's name is only its words.
     * true (default) = the double chevron after them, for "Xem chi tiết »" at the end of a card or panel;
     * "back" = one chevron before them and "next" = one after them, for moving between the parts of a form
     * ("‹ 3. Tiền sử", "5. Lâm sàng ›"); false = none, for a plain link such as "Đăng xuất".
     */
    arrow?: boolean | 'back' | 'next';
} & AnchorHTMLAttributes<HTMLAnchorElement>;
/**
 * A text link: underlined `text-link` words at body size, a 44px tall target and the 3px focus ring.
 * Use it for every link that is not a button, so no link falls back to the browser's thin default ring.
 * For a main action use Button.
 */
export declare const TextLink: import('react').ForwardRefExoticComponent<{
    /** Default "Xem chi tiết". Prefer a specific label when the destination is not obvious. */
    children?: ReactNode;
    /**
     * The mark beside the words, hidden from screen readers so the link's name is only its words.
     * true (default) = the double chevron after them, for "Xem chi tiết »" at the end of a card or panel;
     * "back" = one chevron before them and "next" = one after them, for moving between the parts of a form
     * ("‹ 3. Tiền sử", "5. Lâm sàng ›"); false = none, for a plain link such as "Đăng xuất".
     */
    arrow?: boolean | "back" | "next";
} & AnchorHTMLAttributes<HTMLAnchorElement> & import('react').RefAttributes<HTMLAnchorElement>>;

/* ===== components/atoms/VisuallyHidden/VisuallyHidden ===== */
/** Text for screen readers only, such as the "Lỗi:" prefix before an error message. */
export declare function VisuallyHidden({ className, ...rest }: HTMLAttributes<HTMLSpanElement>): import("react").JSX.Element;

/* ===== components/molecules/Breadcrumb/Breadcrumb ===== */
export type BreadcrumbItem = {
    label: string;
    href?: string;
};
export type BreadcrumbProps = {
    /** From the top level down; the last item is the current page and is not a link. */
    items: BreadcrumbItem[];
    /** aria-label of the nav. Default "Vị trí". */
    label?: string;
    /** Below 40rem show only the way back to the parent ("‹ Rạng Đông KSK 2026"), so a long trail does not take three lines on a phone. */
    collapseOnPhone?: boolean;
} & HTMLAttributes<HTMLElement>;
/** Where this page sits: "Việc của tôi › Rạng Đông KSK 2026 › Người 6/2.033". Staff tools only; public pages are shallow. */
export declare function Breadcrumb({ items, label, collapseOnPhone, className, ...rest }: BreadcrumbProps): import("react").JSX.Element;

/* ===== components/molecules/CareCard/CareCard ===== */
export type CareLevel = 'non-urgent' | 'urgent' | 'emergency';
export type CareCardProps = {
    level: CareLevel;
    /** The action, e.g. "Gọi bác sĩ gia đình nếu:". */
    title: string;
    /** Symptoms or advice, usually a list. */
    children: ReactNode;
    /** Screen-reader prefix per level. Default "Không khẩn cấp:", "Cần khám trong ngày:", "Cấp cứu:". */
    levelLabels?: Record<CareLevel, string>;
    /** Emergency number. Default "115". */
    emergencyNumber?: string;
    /** Emergency call line. Default "Gọi 115 ngay". */
    emergencyCallLabel?: string;
    headingLevel?: 2 | 3;
    className?: string;
};
/**
 * "When to get help" advice in three levels (from the NHS care-card pattern). The level is in the heading
 * text for screen readers, in the band color and in words, never color alone. Inform and reassure; do not scare.
 */
export declare function CareCard({ level, title, children, levelLabels, emergencyNumber, emergencyCallLabel, headingLevel, className, }: CareCardProps): import("react").JSX.Element;

/* ===== components/molecules/CodeList/CodeList ===== */
export type CodeListProps = {
    /** The group question, read as the fieldset legend: "Bệnh, tật". */
    label: string;
    hint?: string;
    /** One message for the whole group, with one red bar. */
    error?: string;
    errorPrefix?: string;
    options: ComboboxOption[];
    /** Controlled list of chosen values, in the order they were added. */
    value?: string[];
    defaultValue?: string[];
    onValueChange?: (values: string[]) => void;
    /** Label of the field that adds the next item. Default "Thêm bệnh, tật". */
    addLabel?: string;
    /** Text of each item's remove button; the item's name is added for screen readers. Default "Bỏ". */
    removeLabel?: string;
    /** Shown while nothing is chosen. Default "Chưa có mục nào." */
    emptyText?: string;
    /** id of the add field's input, so an ErrorSummary can link to it. */
    id?: string;
    className?: string;
};
/**
 * Several coded items for one question, such as every disease found at a check-up: "Tăng huyết áp (I10)",
 * "Đái tháo đường type 2 (E11)". Chosen items read name first, code after and lighter, each with "Bỏ".
 * A Combobox under the list adds the next one: it leaves out what is already chosen, empties itself after
 * each choice and keeps focus, ready for the next. Adding and removing are announced politely.
 * The doctor's own wording stays in a separate text field on the page.
 */
export declare function CodeList({ label, hint, error, errorPrefix, options, value, defaultValue, onValueChange, addLabel, removeLabel, emptyText, id, className, }: CodeListProps): import("react").JSX.Element;

/* ===== components/molecules/Combobox/Combobox ===== */
export type ComboboxOption = {
    value: string;
    /** The name people know: "Tăng huyết áp". */
    label: string;
    /** The code, shown after the name in brackets and lighter: "I10". Never shown alone. */
    code?: string;
    /** A second line, e.g. the group it belongs to. */
    hint?: string;
    /** Other words that should find it: "cao huyet ap, THA". */
    keywords?: string;
};
export type ComboboxProps = {
    /** Visible label. */
    label: string;
    hideLabel?: boolean;
    /** Help under the label. Default says what can be typed: "Gõ tên hoặc mã, có dấu hay không dấu đều được." */
    hint?: string;
    error?: string;
    errorPrefix?: string;
    options: ComboboxOption[];
    /** Controlled value (an option's value); null = nothing chosen. */
    value?: string | null;
    defaultValue?: string | null;
    onValueChange?: (value: string | null, option: ComboboxOption | null) => void;
    /** Most options shown at once; staff refine by typing. Default 50. */
    maxResults?: number;
    /** Shown when nothing matches, and read out in place of the count. */
    noResultsText?: (query: string) => string;
    /** Read after the result count changes, while something matches. */
    resultsText?: (count: number) => string;
    /** Text of the button that empties the field. Default "Xóa". */
    clearLabel?: string;
    required?: boolean;
    disabled?: boolean;
    /** id of the input, so an ErrorSummary can link to it. */
    id?: string;
    name?: string;
    /** More ids that describe the input, read after the hint and error: e.g. the error of the group the field adds to (CodeList). */
    'aria-describedby'?: string;
    /** Marks the input invalid without a message or red edge of its own, when the message belongs to the group around it (CodeList). */
    'aria-invalid'?: boolean;
    className?: string;
};
/** "Tăng huyết áp (I10)": how a chosen option reads in the field and in summaries. */
export declare const optionText: (o: ComboboxOption) => string;
/** The default message when nothing matches (or, with nothing typed, when there is nothing to choose). */
export declare const notFoundText: (q: string) => string;
/** The options that match what was typed, best first, as the list shows them (tone marks and case ignored). */
export declare function matchOptions(options: ComboboxOption[], query: string, max?: number): ComboboxOption[];
/**
 * Choose one coded item by typing part of its name or its code: diagnoses (ICD-10), occupations, wards.
 * Typing without tone marks works ("tang huyet ap" finds "Tăng huyết áp"). The field only accepts an item
 * from the list; leaving it without choosing puts back the previous choice. Follows the ARIA 1.2 combobox pattern.
 */
export declare function Combobox({ label, hideLabel, hint, error, errorPrefix, options, value, defaultValue, onValueChange, maxResults, noResultsText, resultsText, clearLabel, required, disabled, id, name, 'aria-describedby': describedBy, 'aria-invalid': ariaInvalid, className, }: ComboboxProps): import("react").JSX.Element;

/* ===== components/molecules/ConfirmationPanel/ConfirmationPanel ===== */
export type StepState = 'done' | 'current' | 'todo' | 'failed';
/** A step and what has actually happened to it. Each state should come from a real event (a receipt, an answer). */
export type ConfirmationStep = {
    label: string;
    state: StepState;
};
export type ConfirmationTone = 'success' | 'pending' | 'error' | 'attention';
export type ConfirmationPanelProps = {
    /**
     * "Đã đặt lịch khám" (success), "Chờ gửi lên Sở" (pending), "Bị từ chối" (error), "Chưa rõ kết quả" (attention).
     * A focused title keeps one name; put a countdown in the text under it ("Còn 27 giây để hủy.").
     */
    title: string;
    /** Booking or receipt code, e.g. "FDC-2410-0830" or "SYT-HN-2026-118204". It never breaks across lines. */
    reference?: string;
    /** Default "Mã đặt lịch của bạn". */
    referenceLabel?: string;
    /** What happens next, how to change or cancel, and the buttons for the next step. */
    children?: ReactNode;
    /**
     * Move focus to the title when the panel is shown (after a submit). Default true. Read once, when the panel
     * mounts: a later change does not move focus, so a panel already on screen never takes focus from a button in
     * it. For a new result, show a new panel (a `key` per result) with `focusOnMount` set when it appears.
     */
    focusOnMount?: boolean;
    /**
     * What the result is. Every tone except a strong success is a pale panel: a tint, a sign in a circle before the
     * title and ordinary text, with no edge and no side bar (status colors are the same in both themes).
     * - success (default): the work is done and confirmed. Green is only ever for success.
     * - pending: pressed but not finished ("Chờ gửi lên Sở"; the seconds left go in the text under the title, "Còn 27
     *   giây để hủy."): status-info tint, sign "i".
     * - error: the other side refused and said why ("Bị từ chối"): status-error tint, sign "!". Say the reason,
     *   where to fix it and what comes after the fix.
     * - attention: the outcome is not known ("Chưa rõ kết quả"): status-warning tint, sign "!". Offer a check,
     *   never a resend, while the other side may already hold the record.
     */
    tone?: ConfirmationTone;
    /**
     * How loud a success is. strong (default) = the solid green panel with white text that ends a patient flow
     * ("Đã đặt lịch khám"). subtle = for staff screens, where a result is one block among many: a pale
     * status-success-bg panel with a "✓" sign, the title in green, ordinary text, left-aligned, the reference code
     * in a white box and the explanation inside the panel. Other tones are always pale.
     */
    emphasis?: 'strong' | 'subtle';
    /**
     * Short step line. Prefer objects with an explicit state per step, set from real events. Done steps say what
     * happened ("Đã gửi lên Sở", "Sở đã tiếp nhận"), the step waited for says "Chờ …" ("Chờ Bộ xác nhận"),
     * later steps are plain event names ("Bộ xác nhận"):
     * [{ label: 'Sở đã tiếp nhận', state: 'done' }, { label: 'Chờ Bộ xác nhận', state: 'current' }].
     * Plain strings with `currentStep` still work (earlier steps are then shown as done).
     * The steps sit on one row with an arrow between them while the row fits the panel; when it does not (a phone, a
     * narrow column), they become a list, one step per line, without arrows: the signs and the state words give the order.
     */
    steps?: Array<string | ConfirmationStep>;
    /** For plain-string steps: index of the current step (0-based). */
    currentStep?: number;
    /** Read before a done step. Default "Xong:". */
    donePrefix?: string;
    /** Read before the step being waited for. Default "Hiện tại:". */
    currentPrefix?: string;
    /** Read before a step still to come. Default "Bước sau:". */
    todoPrefix?: string;
    /** Read before a failed step. Default "Lỗi:". */
    failedPrefix?: string;
    /** Read before the step line. Default "Tiến trình". */
    stepsLabel?: string;
    /** Heading level of the title. Default 1 (the page result); use 2 or 3 inside a page that has its own h1. */
    headingLevel?: 1 | 2 | 3;
    className?: string;
};
/**
 * The finish of a flow, or its waiting state: a clear panel with the title, the reference code,
 * an optional step line, then what happens next.
 */
export declare function ConfirmationPanel({ title, reference, referenceLabel, children, focusOnMount, tone, emphasis, steps, currentStep, stepsLabel, donePrefix, currentPrefix, todoPrefix, failedPrefix, headingLevel, className, }: ConfirmationPanelProps): import("react").JSX.Element;

/* ===== components/molecules/DateInput/DateInput ===== */
export type DateInputProps = {
    /** The question, read as the group's legend: "Ngày sinh của người bệnh". */
    label: string;
    /** Default "Ví dụ: 27 3 1950" (the date joined by no-break spaces). */
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
    type?: 'info' | 'success' | 'warning' | 'error';
    text: ReactNode;
};
export type FormNoticeProps = {
    notice?: FormNoticeValue | null;
    /**
     * Stand-alone notice in a page (not under a form): a pale tint in the type's color (warning amber, error red,
     * success green, info blue; the same in every theme), the sign and the words. No edge and no side bar.
     */
    boxed?: boolean;
    /**
     * Announce changes politely (default true). Set false for text that changes by itself, such as a countdown
     * ("còn 22 giây"), which would otherwise be read out every second; announce the start and the end some other way.
     */
    live?: boolean;
    className?: string;
};
/**
 * Status line under a form ("Đã gửi…"), announced by screen readers without moving focus. `boxed` for a notice that stands alone.
 * A leading circle with "!", "i" or "✓" shows the type without relying on color; it is hidden from screen readers.
 */
export declare function FormNotice({ notice, boxed, live, className }: FormNoticeProps): import("react").JSX.Element;

/* ===== components/molecules/FormPartNav/FormPartNav ===== */
export type FormPartNavItem = {
    /** The part's number and name: "4. Thể lực". */
    label: string;
    /** Where the part is. With `href` the item is a link and the browser follows it; leave it out for an in-page switch (a button). */
    href?: string;
    /** Called when the item is chosen, before the list closes. */
    onSelect?: () => void;
    /** Items still to fill: "còn 2". Leave it out with `done` to read "Đủ". */
    count?: string;
    /** Every item of the part is filled: the count is green and reads "Đủ". */
    done?: boolean;
    /** The part on screen now (`aria-current="step"`). */
    current?: boolean;
    /** A muted second line: "12 chỉ số từ HIS, 09:12". */
    sub?: string;
    /** Something to fix in this part, in words: "1 cần sửa". Red, and repeated on the phone toggle. */
    problem?: string;
};
export type FormPartNavProps = {
    /** The parts in order; mark one `current`. */
    items: FormPartNavItem[];
    /** Text of the phone toggle. Default: the current item's label and count, "4. Thể lực · còn 2". */
    toggleLabel?: string;
    className?: string;
};
/**
 * The parts of a long staff form with what is left in each ("còn 2", "Đủ"). From 64rem up the list is always
 * shown (StaffLayout's side column); below that only a full-width toggle shows ("4. Thể lực · còn 2"), so the
 * form starts near the top of a phone screen, and it opens the list under itself.
 *
 * It renders a div, not a nav: StaffLayout's `aside` already is the `<nav>` landmark ("Các phần của phiếu").
 * Outside StaffLayout, put it in a labelled `<nav>`.
 *
 * Choosing an item closes the list. A link lets the browser move to its target; a button (no `href`) returns
 * focus to the toggle, which then names the new part. Escape closes the list too.
 */
export declare function FormPartNav({ items, toggleLabel, className }: FormPartNavProps): import("react").JSX.Element;

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

/* ===== components/molecules/NumberField/NumberField ===== */
export type NumberFieldProps = {
    /** The measurement, without the unit: "Cân nặng". The unit goes in `unit`. */
    label: string;
    /** Shown inside the box and read after the label: "kg", "lần/phút", "mmHg". */
    unit?: string;
    /** Lowest and highest value that can be typed at all; outside it is an error after leaving the field. */
    min?: number;
    max?: number;
    /** Digits allowed after the comma. Default 0 (whole numbers). */
    decimals?: number;
    /**
     * Normal range: a value outside it gets a word tag in the message line above the box ("Cao · bình thường 60–100",
     * the range only when it fits), never color alone and never beside the box. It is not an error.
     */
    normalRange?: [number, number];
    highLabel?: string;
    lowLabel?: string;
    /**
     * A typical value, shown as "ví dụ 78" while the field has focus (empty or typing). Empty and not focused, the line
     * says "Chưa điền"; filled and left, nothing. The line keeps its room in every state.
     */
    example?: string;
    /** Hint when the field is empty and not focused. Default "Chưa điền". Keep it to a word or two (one line). */
    emptyLabel?: string;
    /** Controlled text, as typed ("52,5"). */
    value?: string;
    defaultValue?: string;
    /** Called on every change with the number (null when empty or not a number) and the text typed. */
    onValueChange?: (value: number | null, text: string) => void;
    /**
     * An error from the page, e.g. a required field still empty after pressing "Xem lại". Wins over the field's own
     * checks and shows in the same line, as given. Keep it short ("Điền mạch", "Điền tâm thu"): the line is one line
     * in a 9rem column; the error summary can keep its own short name. Pass an "Điền …" only while the field is empty:
     * once something is typed, the line shows the field's own message ("Cao" tag, range error) even if the page keeps
     * its summary until the next press. The line keeps the room of the last page error, so dropping it moves nothing.
     */
    error?: string;
    /** Fixed help text instead of the automatic "Chưa điền" / "ví dụ 78"; an error or a "Cao" tag takes its place. */
    hint?: string;
} & Omit<TextFieldProps, 'type' | 'value' | 'defaultValue' | 'error' | 'hint' | 'reserve' | 'unit' | 'after' | 'multiline' | 'icon' | 'min' | 'max'>;
/**
 * A number with its unit, for measurements and results: "52,5 kg", "78 lần/phút".
 * Accepts a decimal comma or dot, checks the range when the user leaves the field (not while typing),
 * and flags values outside the normal range with a word. An empty field stays neutral: a grey hint, no red.
 * Everything it says is in one message line above the box (hint, "Cao" tag, error), and that line keeps its room
 * whatever it shows, so nothing above or below the field moves while it is focused, typed into or left, and the box
 * always has its column's full width. Every text it writes itself fits one line of a 9rem (144px) column.
 */
export declare const NumberField: import('react').ForwardRefExoticComponent<{
    /** The measurement, without the unit: "Cân nặng". The unit goes in `unit`. */
    label: string;
    /** Shown inside the box and read after the label: "kg", "lần/phút", "mmHg". */
    unit?: string;
    /** Lowest and highest value that can be typed at all; outside it is an error after leaving the field. */
    min?: number;
    max?: number;
    /** Digits allowed after the comma. Default 0 (whole numbers). */
    decimals?: number;
    /**
     * Normal range: a value outside it gets a word tag in the message line above the box ("Cao · bình thường 60–100",
     * the range only when it fits), never color alone and never beside the box. It is not an error.
     */
    normalRange?: [number, number];
    highLabel?: string;
    lowLabel?: string;
    /**
     * A typical value, shown as "ví dụ 78" while the field has focus (empty or typing). Empty and not focused, the line
     * says "Chưa điền"; filled and left, nothing. The line keeps its room in every state.
     */
    example?: string;
    /** Hint when the field is empty and not focused. Default "Chưa điền". Keep it to a word or two (one line). */
    emptyLabel?: string;
    /** Controlled text, as typed ("52,5"). */
    value?: string;
    defaultValue?: string;
    /** Called on every change with the number (null when empty or not a number) and the text typed. */
    onValueChange?: (value: number | null, text: string) => void;
    /**
     * An error from the page, e.g. a required field still empty after pressing "Xem lại". Wins over the field's own
     * checks and shows in the same line, as given. Keep it short ("Điền mạch", "Điền tâm thu"): the line is one line
     * in a 9rem column; the error summary can keep its own short name. Pass an "Điền …" only while the field is empty:
     * once something is typed, the line shows the field's own message ("Cao" tag, range error) even if the page keeps
     * its summary until the next press. The line keeps the room of the last page error, so dropping it moves nothing.
     */
    error?: string;
    /** Fixed help text instead of the automatic "Chưa điền" / "ví dụ 78"; an error or a "Cao" tag takes its place. */
    hint?: string;
} & Omit<TextFieldProps, "defaultValue" | "type" | "icon" | "after" | "max" | "min" | "value" | "hint" | "error" | "reserve" | "unit" | "multiline"> & import('react').RefAttributes<HTMLInputElement>>;

/* ===== components/molecules/Pagination/Pagination ===== */
export type PaginationProps = {
    /** Current page, from 1. */
    page: number;
    pageSize: number;
    /** Rows in the whole (filtered) list. */
    total: number;
    /** What the rows are, after the count: "người", "hồ sơ". Default "dòng". */
    itemLabel?: string;
    /** Links: the page's address, so pages can be bookmarked and opened in a new tab. Preferred. */
    getHref?: (page: number) => string;
    /** Buttons: called with the new page when there is no address per page. */
    onPageChange?: (page: number) => void;
    /** aria-label of the nav. Default "Trang của danh sách". */
    label?: string;
    /**
     * Announce the range line when it changes (a polite live region). Default true. DataTable sets false: it keeps one
     * live region of its own that says the count, the empty result or the failure, so nothing is read twice.
     */
    live?: boolean;
    previousLabel?: string;
    nextLabel?: string;
    className?: string;
};
/** The page and the rows it shows, clamped to the list: page 99 of a 41-page list is page 41. */
export declare function pageRange(page: number, pageSize: number, total: number): {
    pages: number;
    current: number;
    from: number;
    to: number;
};
/** "Hiển thị 1–50 trong 2.033 người": the range line in plain text (DataTable's live region says it too). */
export declare function rangeText({ page, pageSize, total, itemLabel }: Pick<PaginationProps, 'page' | 'pageSize' | 'total' | 'itemLabel'>): string;
/**
 * "Hiển thị 1–50 trong 2.033 người · ‹ Trước · Trang 1 / 41 · Sau ›".
 * Says what is shown and how much there is; only Previous and Next, so the control never grows with the list.
 * The arrows are hidden from screen readers: the controls are named "Trước" and "Sau".
 * Renders nothing when the list is empty (the table says so instead).
 */
export declare function Pagination({ page, pageSize, total, itemLabel, getHref, onPageChange, label, live, previousLabel, nextLabel, className, }: PaginationProps): import("react").JSX.Element | null;

/* ===== components/molecules/PhoneInput/PhoneInput ===== */
export type PhoneInputProps = {
    /** Default "Số điện thoại". */
    label?: string;
    /** Default "Ví dụ: 0912 345 678" (the number joined by no-break spaces, so it never breaks over two lines). */
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
    /** Default "Ví dụ: 0912 345 678" (the number joined by no-break spaces, so it never breaks over two lines). */
    hint?: string;
    /** Called with the normalized digits (0912345678), or null while incomplete or invalid. */
    onPhoneChange?: (digits: string | null, raw: string) => void;
} & Omit<TextFieldProps, "inputMode" | "type" | "autoComplete" | "label"> & import('react').RefAttributes<HTMLInputElement | HTMLTextAreaElement>>;

/* ===== components/molecules/RadioGroup/RadioGroup ===== */
export type RadioOption = {
    value: string;
    label: string;
    /** Optional second line, e.g. what the service includes. */
    description?: ReactNode;
    disabled?: boolean;
};
export type RadioGroupProps = {
    /** The question, read as the group's legend: "Bạn đặt lịch cho ai?". */
    label: string;
    options: RadioOption[];
    name: string;
    hint?: string;
    error?: string;
    errorPrefix?: string;
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    /** Make the legend the page heading on one-question pages. */
    legendAsHeading?: boolean;
    /** Hide the legend visually when the page heading already asks the question (still read by screen readers). */
    hideLegend?: boolean;
    required?: boolean;
    /** id put on the first option, so an ErrorSummary can link to it. */
    id?: string;
    /**
     * row = options side by side, sharing the width equally: for short answers such as Không / Có or Loại I–V.
     * The question then reads as a field label (body text), so a long list of questions stays calm.
     * wrap = options as wide as their words, flowing onto more lines: for list filters such as "Cần điền hoặc sửa · 15". Default column.
     */
    layout?: 'column' | 'row' | 'wrap';
    /** compact = less padding and gap, so five short options (I–V) fit a 360px phone; targets stay ≥ 44px. */
    density?: 'comfortable' | 'compact';
    /**
     * tiles = a bordered tile with a visible radio circle: for questions on a form ("Bạn đặt lịch cho ai?", Loại I–V).
     * pills = rounded pills without the circle: for list filters, so a filter never looks like a form question.
     * Use pills with layout "wrap". The radio stays in the page for the keyboard and screen readers; the checked
     * pill is marked by its fill, a heavier brand edge and bold text, not by color alone. Default tiles.
     */
    variant?: 'tiles' | 'pills';
    className?: string;
};
/**
 * One choice from a short list, as large tappable tiles built on native radios, or as pills for list filters.
 * Arrow keys move between options; the whole tile or pill is the hit area.
 */
export declare function RadioGroup({ label, options, name, hint, error, errorPrefix, value, defaultValue, onValueChange, legendAsHeading, hideLegend, required, id: firstId, layout, density, variant, className, }: RadioGroupProps): import("react").JSX.Element;

/* ===== components/molecules/SaveStatus/SaveStatus ===== */
export type SaveStatusState = 
/** Everything typed is on the server. */
{
    state: 'saved';
    at?: string;
}
/** Changes typed, not written yet ("ô chưa lưu"). */
 | {
    state: 'unsaved';
    count: number;
    lastSavedAt?: string;
}
/** The save request is on its way. */
 | {
    state: 'saving';
}
/**
 * Someone else changed the same fields while this person was typing: nothing is saved until each of the
 * `count` values is settled. Amber, never green: the last save time says what is safe, not that this is.
 */
 | {
    state: 'conflict';
    count: number;
    lastSavedAt?: string;
}
/** The server refused or the network failed. `reason` in plain words: "mất mạng". */
 | {
    state: 'error';
    reason: string;
    count?: number;
};
export type SaveStatusProps = {
    status: SaveStatusState;
    /** Shown with the error; the typed data is kept, so this only tries again. */
    onRetry?: () => void;
    retryLabel?: string;
} & Omit<HTMLAttributes<HTMLDivElement>, 'children'>;
/**
 * The save line of a staff form, one of five moments:
 *
 * | State | Reads | Color |
 * |---|---|---|
 * | unsaved | "8 ô chưa lưu · Lưu lần cuối 09:12" | `status-info-text` |
 * | saving | "Đang lưu…" | `status-info-text` |
 * | saved | "✓ Đã lưu 09:15" | `status-success-text` |
 * | conflict | "(!) Cần xử lý 2 giá trị trước khi lưu · Lưu lần cuối 09:12" | `status-warning-text` (never green) |
 * | error | "(!) Lưu không được: mất mạng. Chữ đã gõ vẫn còn (8 ô chưa lưu)." + "Lưu lại" | `status-error-text` |
 *
 * It counts unsaved fields only ("ô chưa lưu"); items still to fill ("mục còn thiếu") are a different count, shown elsewhere.
 * The conflict and the failed save carry the "!" sign in a circle, as FormNotice does: in the nursing-home theme the
 * red and the amber sit next to an orange button, so color alone does not tell them apart.
 *
 * One live region per moment: a polite `role="status"` that is always in the page and says the moment when it changes
 * (unsaved, saving, saved, conflict), and, for a failed save only, a `role="alert"` added with its sentence, so it is
 * read once and at once. Counts are never part of a region: while a person types, "1 ô chưa lưu" becoming "2 ô chưa
 * lưu" is not read out over the typing. On the line the count shows in the words as before; a screen reader hears the
 * same words in place (the count beside the region, outside it), so reading the line gives the current count once.
 * The count in brackets on a failed save and the "Lưu lại" button sit outside both regions: typing into another
 * field while the network is down does not read the failure again, and the button's name is never part of the message.
 */
export declare function SaveStatus({ status, onRetry, retryLabel, className, ...rest }: SaveStatusProps): import("react").JSX.Element;

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

/* ===== components/molecules/SummaryList/SummaryList ===== */
export type SummaryRow = {
    key: string;
    value: ReactNode;
    /** Where "Thay đổi" goes. Use onChange for in-page flows. */
    changeHref?: string;
    onChange?: () => void;
    /** Read-only detail opened right under the row (a table of answers or results). */
    details?: ReactNode;
    /** The toggle's words when closed, e.g. "Xem 12 chỉ số". Shown as "▸ Xem 12 chỉ số". Default "Xem chi tiết". */
    detailsLabel?: string;
    /** The toggle's words when open. Default: detailsLabel with "Xem" replaced by "Thu gọn" ("▾ Thu gọn 12 chỉ số"). */
    detailsOpenLabel?: string;
    /** Start with the details open. */
    defaultDetailsOpen?: boolean;
};
export type SummaryListProps = {
    rows: SummaryRow[];
    /** Default "Thay đổi". Screen readers hear it with the row key: "Thay đổi Họ và tên". */
    changeLabel?: string;
    className?: string;
};
/**
 * "Check your answers": key, value and a change link per row, before anything is booked or sent.
 * A row can also open read-only details right under it ("▸ Xem 12 chỉ số").
 */
export declare function SummaryList({ rows, changeLabel, className }: SummaryListProps): import("react").JSX.Element;

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

/* ===== components/organisms/DataTable/DataTable ===== */
export type DataTableColumn<Row> = {
    key: string;
    header: ReactNode;
    /** What the cell shows. */
    cell: (row: Row, index: number) => ReactNode;
    /** end = numbers and dates, right-aligned with even digit widths. Default start. */
    align?: 'start' | 'end';
    /**
     * A CSS width such as "6rem". Columns with a width keep it whatever the rows hold, so they do not move when a filter
     * changes the rows; leave the main column without one so it takes the rest.
     */
    width?: string;
    /** Keep on one line, also when the rows stack on phones (codes, dates, statuses). Names and next steps should wrap. */
    nowrap?: boolean;
    /**
     * This column names the row (usually the person); read before each cell of the row.
     * A link placed first in this cell is stretched over the whole cell, so the target is large on touch screens.
     * On phones (stackBelow="phone") this cell is the block's title and has no label.
     */
    rowHeader?: boolean;
    /** On phones (stackBelow="phone"), the label before the value. Default: the header, when it is plain text. */
    stackLabel?: string;
    /** On phones, show the value with no label, when it speaks for itself (a StatusTag with words). It stays in the value column. */
    hideLabelWhenStacked?: boolean;
};
export type DataTableProps<Row> = {
    /** Names the table for screen readers and the scroll region: "Người cần điền hoặc sửa". */
    caption: string;
    /** Show the caption as a heading above the table. Default hidden (the page heading usually says it). */
    showCaption?: boolean;
    columns: Array<DataTableColumn<Row>>;
    rows: Row[];
    getRowKey: (row: Row) => string;
    /**
     * boxed (default): a block on its own, with a 1px edge and a header band.
     * plain: no outer edge and no header band, only the rows and their dividers: for a table inside a card or a
     * SummaryList's details, so there is no box inside a box.
     */
    variant?: 'boxed' | 'plain';
    /** loading keeps the header and says so; error says what failed and offers to try again. */
    status?: 'ready' | 'loading' | 'error';
    loadingText?: string;
    /** What failed, in plain words: "Không tải được danh sách: mất mạng." */
    errorText?: string;
    /** "Tải lại". After it, focus moves to the first row's link (or the message, if the list is still empty or loading). */
    onRetry?: () => void;
    retryLabel?: string;
    /** Shown when there are no rows: say why and what to do ("Không có ai khớp “Hằng”. Xóa chữ tìm để xem cả đợt."). */
    emptyText?: ReactNode;
    /**
     * A sentence the live region adds after the count or the empty text, for what the table cannot know:
     * "Còn 1 người khớp “pham van nam” ở nhóm khác."
     */
    resultNote?: string;
    /** Narrowest width before the table scrolls sideways inside its box (never the page). Default 48rem. */
    minWidth?: string;
    /**
     * phone: below 40rem each row becomes a block: the row header (the name) as its title, then one line per cell
     * with its column's name before the value, so the first screen shows records instead of a sideways scroll.
     * Default none: the table keeps minWidth and scrolls inside its box.
     */
    stackBelow?: 'none' | 'phone';
    /** Under the table, inside the same box. */
    pagination?: PaginationProps;
    className?: string;
};
/**
 * A list of records for staff tools: one row per record, the name first, a status word, the next step.
 * The box scrolls sideways on narrow screens instead of the page, and becomes a keyboard-scrollable region
 * only when it actually overflows; with stackBelow="phone" each row becomes a block on phones instead.
 * Loading, empty and failed states keep the header so the page does not jump; their message sits under the table,
 * outside the sideways scroll, so it and "Tải lại" are always on screen. With no rows nothing scrolls: where the
 * header would not fit the box (a phone), it is kept for screen readers only, so it is never cut at the edge and
 * the box is never a Tab stop. One polite live region, always on the page, says the count, the empty result or
 * the failure whenever it changes.
 */
export declare function DataTable<Row>({ caption, showCaption, columns, rows, getRowKey, variant, status, loadingText, errorText, onRetry, retryLabel, emptyText, resultNote, minWidth, stackBelow, pagination, className, }: DataTableProps<Row>): import("react").JSX.Element;

/* ===== components/organisms/Dialog/Dialog ===== */
export type DialogProps = {
    open: boolean;
    /** Called on Esc, on the close action, or when the browser closes it. */
    onClose: () => void;
    title: string;
    children?: ReactNode;
    /** Buttons row; put the least destructive action first. */
    actions?: ReactNode;
    /** role="alertdialog" for warnings that need an answer (e.g. session timeout). */
    alert?: boolean;
    /** wide (about 52rem) for dialogs that hold a list or table. Default default (32rem). */
    size?: 'default' | 'wide';
    /**
     * The body scrolls between a fixed title and a fixed Actions row, with a fade at the bottom while
     * more content is below. Use with long lists so the buttons never scroll away.
     */
    scrollBody?: boolean;
    /** Label of the scrolling body for keyboard and screen-reader users. Default: the title. */
    bodyLabel?: string;
    className?: string;
};
/**
 * Modal dialog on the native <dialog> element: the browser traps focus, closes on Esc and returns focus to
 * the trigger. Use sparingly; a page is usually kinder than a dialog for older users.
 */
export declare function Dialog({ open, onClose, title, children, actions, alert, size, scrollBody, bodyLabel, className }: DialogProps): import("react").JSX.Element;

/* ===== components/organisms/ErrorSummary/ErrorSummary ===== */
export type ErrorSummaryItem = {
    /** id of the input to focus, e.g. "lookup-phone" or a DateInput's "<id>-day". */
    fieldId: string;
    /**
     * The link's words. `list`: the field's own message ("Nhập số điện thoại gồm 10 chữ số").
     * `inline`: the field's short name ("Mạch", "Tâm thu"), with the count in the title ("Còn 4 mục chưa điền").
     */
    text: string;
};
export type ErrorSummaryProps = {
    errors: ErrorSummaryItem[];
    /** Default "Vui lòng kiểm tra lại thông tin". */
    title?: string;
    /** Move focus here when it appears (after a failed submit). Default true. */
    focusOnMount?: boolean;
    /**
     * list = a heading and one link per line: patient forms, where each problem gets its own 44px line. Default.
     * inline = staff forms: a smaller heading, less padding and the links side by side in rows that wrap, set apart by
     * space (no dots), so four empty fields do not push the form down. Pass the fields' short names. Still a list for
     * screen readers, still focused on mount.
     */
    layout?: 'list' | 'inline';
    className?: string;
};
/**
 * The list of problems at the top of a form after a failed submit. Each item links to its field.
 * Render it only when there are errors; it takes focus so screen-reader and keyboard users land on it.
 *
 * It is read once. It appears as an alert (read at once, even when it does not take focus). Once focus has been in it
 * and moved on, or once its list changes without it being shown again (a page that drops filled fields on "Lưu"), it
 * becomes a group named by its title: later changes are not read over what the person is doing. Rendered again after
 * having no errors, or given a new `key`, it is an alert again.
 */
export declare function ErrorSummary({ errors, title, focusOnMount, layout, className, }: ErrorSummaryProps): import("react").JSX.Element | null;

/* ===== components/organisms/Footer/Footer ===== */
export type FooterProps = {
    /** Legal or facility name, e.g. "Công ty cổ phần Trung tâm bác sĩ gia đình Hà Nội". */
    name: string;
    tagline?: string;
    address: string;
    /** Shown as text and tap-to-call links. */
    phones: Array<{
        number: string;
        label?: string;
    }>;
    email?: string;
    /** Registration and representative lines. */
    legal?: string[];
    columns?: Array<{
        title: string;
        links: Array<{
            label: string;
            href: string;
        }>;
    }>;
    copyright?: string;
    labels?: {
        address?: string;
        phone?: string;
        email?: string;
    };
    className?: string;
};
/** Site footer on brand-700: who we are, where, how to reach us (as text, not only links), legal lines, site links. */
export declare function Footer({ name, tagline, address, phones, email, legal, columns, copyright, labels, className }: FooterProps): import("react").JSX.Element;

/* ===== components/organisms/Header/Header ===== */
export type NavItem = {
    label: string;
    href: string;
    /** Marks the current page (aria-current="page"). */
    current?: boolean;
    /** Sub-pages; the item becomes a button that opens them. */
    children?: Array<{
        label: string;
        href: string;
        current?: boolean;
    }>;
};
export type HeaderProps = {
    logo: {
        src: string;
        alt: string;
        href?: string;
        width?: number;
        height?: number;
    };
    items: NavItem[];
    hotline?: {
        number: string;
        label?: string;
    };
    /** One line such as "Mở cửa 07:00–20:00, tất cả các ngày". Hidden on phones. */
    hours?: string;
    /** Main call to action, e.g. { label: 'Đặt lịch khám', href: '/dat-lich' }. */
    cta?: {
        label: string;
        href: string;
    };
    /** aria-label of the nav. Default "Menu chính". */
    navLabel?: string;
    /** Mobile menu button. Default "Menu" / "Đóng menu". */
    menuLabel?: string;
    closeMenuLabel?: string;
    /**
     * site (default) = the two-row public header (logo, hotline, hours, CTA, then the menu).
     * compact = one white row for staff tools: logo, app name, menu and a `tools` slot; nothing else.
     */
    variant?: 'site' | 'compact';
    /** compact: the app's name next to the logo, e.g. "hoso" (Montserrat 700, 18px). */
    appName?: string;
    /** compact: right-hand slot for system status, the signed-in person and "Đăng xuất". Below 1024px (phones, tablets) it moves into the menu. */
    tools?: ReactNode;
    /**
     * compact, below 1024px: stick to the top and shrink to a thin bar after scrolling down.
     * From 1024px up the header scrolls away and a sticky PatientContextBar keeps the person in view.
     * The thin bar shows `compactBar` (the person being worked on: name, date of birth, record code) and the menu button.
     */
    collapseOnScroll?: boolean;
    /**
     * compact: the person in the thin bar shown when collapsed, as a fragment: the name first, then each fact as its
     * own element, e.g. `<><strong>Đặng Thanh Chi</strong><span>Sinh 07/07/1990</span><span>RD26-0006</span></>`.
     * The name keeps one line (a very long name ends in "…"); each fact stays whole, set apart by space, never by "·".
     * The thin bar is never taller than the full header row.
     */
    compactBar?: ReactNode;
    className?: string;
};
/**
 * Site header: logo, hotline (same place on every page), optional hours and call to action, and the main menu.
 * Sub-menus open on click or Enter/Space, never on hover alone, and close with Esc.
 */
export declare function Header({ logo, items, hotline, hours, cta, navLabel, menuLabel, closeMenuLabel, variant, appName, tools, collapseOnScroll, compactBar, className, }: HeaderProps): import("react").JSX.Element;

/* ===== components/organisms/IdleTimeoutDialog/IdleTimeoutDialog ===== */
export type IdleTimeoutDialogProps = {
    /** Inactivity before onTimeout runs. Default 20 minutes. */
    timeoutMs?: number;
    /** How long before the timeout the warning opens. Default 2 minutes (WCAG 2.2.1 needs at least 20 seconds). */
    warnBeforeMs?: number;
    /** Save what you can and sign out or clear the form. */
    onTimeout: () => void;
    /** Person chose "Thoát". Defaults to onTimeout. */
    onSignOut?: () => void;
    /** Person chose to continue; refresh the session here. */
    onStay?: () => void;
    /** Pause the timer (e.g. when nothing is entered yet). Default false. */
    disabled?: boolean;
    title?: string;
    /** Text before the remaining time. */
    message?: string;
    stayLabel?: string;
    signOutLabel?: string;
};
/** "2 phút 05 giây", "45 giây". */
export declare function formatRemaining(ms: number): string;
/**
 * Warns before a session ends after inactivity and lets the person continue with one tap.
 * Keep what they typed: older users are often slow, interrupted, or helped by a relative.
 */
export declare function IdleTimeoutDialog({ timeoutMs, warnBeforeMs, onTimeout, onSignOut, onStay, disabled, title, message, stayLabel, signOutLabel, }: IdleTimeoutDialogProps): import("react").JSX.Element;

/* ===== components/organisms/PatientContextBar/PatientContextBar ===== */
export type PatientContextBarProps = {
    /** Full name, exactly as on the record. */
    name: string;
    sex?: string;
    /** dd/mm/yyyy. Shown as "Sinh 07/07/1990 (36 tuổi)": the age is added when the date can be read. */
    birthDate: string;
    /** The day the age is counted on; default today. Set it to the exam date for past records. */
    ageOn?: Date;
    /** Last four digits of the citizen ID; the full number is never shown here. */
    idEnd?: string;
    /** Record or visit code: "RD26-0006", shown in bold after its label. */
    recordCode: string;
    /** Words before the code. Default "Mã lượt khám". On phones only the bold code shows (as in the Header's thin bar); the words stay for screen readers. */
    recordCodeLabel?: string;
    /** Company or ward, after the code. */
    organization?: string;
    /** Where this page sits, above the name. */
    breadcrumb?: BreadcrumbItem[];
    /** The record's state: a StatusTag naming the state ("Cần điền"), with any count as muted text after it ("còn 47 mục"), never joined by a "·". It sits right after the name. */
    status?: ReactNode;
    /**
     * The way to the previous and next person: two Buttons with short visible words, the next arrow after them, and
     * an accessible name that starts with those words and adds the person:
     * `<Button icon="simple-left" aria-label="Người trước: Ngô Văn Nam">Người trước</Button>`,
     * `<Button icon="simple-right" iconPosition="end" aria-label="Người sau: Lê Thị Hà">Người sau</Button>`.
     * They sit on the name's row from 40rem up, and share one row of two 44px buttons on phones.
     */
    actions?: ReactNode;
    /**
     * Facts about this version of the record, on a muted line of their own under the person's facts: on the review
     * page the exam time, the signer and the last save. Pass each as its own element; each stays whole, set apart by
     * space: `<><span>Khám 10/10/2026 08:15</span><span>Người ký: <strong>BS Hoàng Thị Cúc</strong></span></>`.
     */
    recordFacts?: ReactNode;
    /** The name is the page's heading. Default 1. */
    headingLevel?: 1 | 2;
    /**
     * bar (default) = a full-width bar with a bottom edge, in StaffLayout's `context` slot under the header (a record
     * form). block = a white block with one light edge all round, among the page's own blocks (the review page, after
     * its title); put no box around it, so there is one edge, not two.
     */
    variant?: 'bar' | 'block';
    /**
     * Stay at the top while the page scrolls, from 1024px up, in either variant. Below that the compact Header's thin
     * bar (collapseOnScroll + compactBar) does this job. A sticky block must be a direct child of the page's content
     * (StaffLayout's main), so it sticks for the whole page; StaffLayout measures it like the bar.
     */
    sticky?: boolean;
    className?: string;
};
/**
 * Who is being worked on, always in view on a staff form: name, sex, date of birth with age, the last four ID digits,
 * the record code, the state and the way to the previous or next person.
 * Name, date of birth and record code are the three facts that tell two people apart; they are never hidden.
 * Facts are whole chunks set apart by space, not by dots: a dot left at a line end reads like a stray mark.
 * Rows: the breadcrumb; the name with its state (and, from 40rem, the previous/next buttons at the end); the facts;
 * the record facts. From 64rem, where it sticks, that is one row of buttons, not a second row under the facts.
 * On phones it is as short as it can be without losing a fact: the state sits beside the name when both fit, and
 * the facts run on as few lines as their whole chunks allow (the code without its words, 10px apart).
 */
export declare function PatientContextBar({ name, sex, birthDate, ageOn, idEnd, recordCode, recordCodeLabel, organization, breadcrumb, status, actions, recordFacts, headingLevel, sticky, variant, className, }: PatientContextBarProps): import("react").JSX.Element;

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
    /** In-page back action (single-page flows); prevents navigation when given. */
    onBack?: () => void;
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
 * Place it inside SiteLayout, which provides the page's single <main> landmark.
 */
export declare function BookingStep({ title, progress, hint, errorSummary, children, backHref, onBack, backLabel, continueLabel, onContinue, submitting, hotline, className, }: BookingStepProps): import("react").JSX.Element;

/* ===== components/templates/SiteLayout/SiteLayout ===== */
export type SiteLayoutProps = {
    header: HeaderProps;
    footer: FooterProps;
    /** Page content; rendered inside <main id="main">. Do not nest another <main>. */
    children: ReactNode;
    /** "clinic" (default) or "nursing-home". */
    theme?: 'clinic' | 'nursing-home';
    skipLabel?: string;
    className?: string;
};
/** Page shell: skip link, header, main content, footer. Every public FDC page uses it. */
export declare function SiteLayout({ header, footer, children, theme, skipLabel, className }: SiteLayoutProps): import("react").JSX.Element;

/* ===== components/templates/StaffLayout/focusInView ===== */
/**
 * The measuring behind StaffLayout's keyboard focus helper: where a focused control shows, ring and label included,
 * and how far to scroll so it shows between the sticky bars. Kept apart from the component so the numbers can be
 * tested without a browser.
 */
/**
 * Where a focused control shows on screen, ring included: the element that draws the ring (the control itself, or
 * the closest option or slot that draws it for a small or hidden input, as RadioGroup and TimeSlotPicker do) grown
 * by the ring's width and offset, and the control's drawn labels (an option's words can run below its ring).
 * `top` is the top of a label above the control (a field's label sits above its message line and box), else the
 * ring's top.
 */
export declare function focusBox(el: HTMLElement): {
    top: number;
    ringTop: number;
    bottom: number;
};
/**
 * How far to scroll (px, positive = down) after focus moved to a control, so the control with its ring and its
 * label show between the sticky bars; null leaves the page as it is. `bars` is the clear area 5px inside the sticky
 * bars' edges, `padded` the band the scroll padding keeps (80px under the top bars, 15px above the action bar).
 * - Usually: the control with its ring inside the padded band, then its label down to `bars.top` if a tall message
 *   line left it under the top bars.
 * - On a short screen (a phone held sideways) where that band is too small: the real bar edges, the label 5px under
 *   the top bars and the ring above the action bar, up to 15px clear of it as room allows. The label is let go
 *   before the control is; when even the control with its ring does not fit, the browser's own scroll stands.
 */
export declare function focusScroll(box: {
    top: number;
    ringTop: number;
    bottom: number;
}, bars: {
    top: number;
    bottom: number;
}, padded: {
    top: number;
    bottom: number;
}): number | null;

/* ===== components/templates/StaffLayout/StaffLayout ===== */
export type StaffLayoutProps = {
    /** The compact header; `variant` is set for you. */
    header: Omit<HeaderProps, 'variant'>;
    /** Full-width bar under the header, e.g. a sticky PatientContextBar on a record form. */
    context?: ReactNode;
    /**
     * A column beside the content (from 64rem up; above the content on smaller screens). It is the `<nav>` landmark,
     * so put the form's parts in it as a FormPartNav: a full list on computers, one "4. Thể lực · còn 2" toggle on phones.
     */
    aside?: ReactNode;
    /** aria-label of the aside's landmark. Default "Các phần của phiếu". */
    asideLabel?: string;
    /** Page content; rendered inside <main id="main">. */
    children: ReactNode;
    /** Sticky bar at the bottom for the save line and the screen's actions. */
    actionBar?: ReactNode;
    /** Keyboard shortcut hints under the action bar ("Ctrl + S lưu"). Shown from 1024px up only: phones have no Ctrl key. */
    shortcuts?: ReactNode;
    /** aria-label of the action bar. Default "Lưu và chuyển bước". */
    actionBarLabel?: string;
    /** Sets the brand theme on the shell. Leave it out to inherit the theme already set on <html> or a parent. */
    theme?: 'clinic' | 'nursing-home';
    skipLabel?: string;
    className?: string;
};
/**
 * Page shell for staff tools (hoso, FDC Manager): compact density, a grey work surface, the one-row header,
 * an optional context bar and side column, and a sticky action bar. Blocks inside are separated by edges and space,
 * not shadows; only the action bar, which floats over content, has one. Below 40rem the spacing is tighter
 * (10px above the content, 15px between blocks), so the work area starts sooner on a phone.
 * It measures the bars that stick and writes their heights as --header-space, --context-bar-space and
 * --action-bar-space, so the scroll padding (a focused field is never under a bar) and the side column's sticky top
 * follow the real bars at every width and in every state. Pages never hard-code sticky offsets.
 */
export declare function StaffLayout({ header, context, aside, asideLabel, children, actionBar, shortcuts, actionBarLabel, theme, skipLabel, className, }: StaffLayoutProps): import("react").JSX.Element;
