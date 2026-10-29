# NumberField

A number with its unit, for measurements and results: "52,5 kg", "78 lần/phút". Built on TextField (`unit` inside the box on the right, read after the label).

- **Empty is neutral**: a grey hint "Chưa điền · ví dụ 78", never red. The hint keeps one line when filled ("ví dụ 78"), so the form does not jump.
- **Decimal comma or dot**: "52,5" and "52.5" both work; on leaving the field a valid entry is tidied to "52,5". `decimals` sets how many digits may follow the comma (default 0).
- **Range checked on leaving, not while typing**: `min`/`max` give "Mạch từ 30 đến 250 lần/phút." The message clears as soon as the value is valid. An error from the page (`error`, e.g. still empty after "Xem lại") wins.
- **Outside the normal range is not an error**: `normalRange` adds a word tag next to the box (StatusTag `error`, sm: "Cao", "Thấp"), so color is never the only signal.
- `inputmode` numeric or decimal opens the number keypad on phones; no spinner, no scroll-wheel changes.

Blood pressure is two fields ("Huyết áp tâm thu", "tâm trương"), not "120/80" in one.
