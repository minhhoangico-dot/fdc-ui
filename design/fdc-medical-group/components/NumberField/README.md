# NumberField

A number with its unit, for measurements and results: "52,5 kg", "78 lần/phút". Built on TextField (`unit` inside the box on the right, read after the label).

- **Empty is neutral**: a grey hint "Chưa điền · ví dụ 78", never red.
- **The hint says only what still helps** (version 2.4):

  | Moment | Grey hint |
  |---|---|
  | Empty, nothing wrong | "Chưa điền · ví dụ 78" |
  | An error shows (its own or the page's) | "ví dụ 78" only, or nothing without an example: the red line already says what is wrong |
  | Typing (focused, a value in) | "ví dụ 78", so the box does not move on the first key |
  | Filled and left | nothing |

  So an empty field after "Xem lại" reads label, "ví dụ 78", red "Điền mạch": three lines, none repeated. A `hint` passed by the screen replaces all of this and shows in every state.
- **Decimal comma or dot**: "52,5" and "52.5" both work; on leaving the field a valid entry is tidied to "52,5". `decimals` sets how many digits may follow the comma (default 0).
- **Range checked on leaving, not while typing**: `min`/`max` give "Mạch từ 30 đến 250 lần/phút." The message clears as soon as the value is valid. An error from the page (`error`, e.g. still empty after "Xem lại") wins.
- **Outside the normal range is not an error**: `normalRange` adds a word tag next to the box (StatusTag `attention`, amber, sm: "Cao", "Thấp"), so color is never the only signal, and an abnormal value never looks like an input error.
- `inputmode` numeric or decimal opens the number keypad on phones; no spinner, no scroll-wheel changes.

Blood pressure is two fields ("Huyết áp tâm thu", "tâm trương"), not "120/80" in one.
