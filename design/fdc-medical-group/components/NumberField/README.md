# NumberField

A number with its unit, for measurements and results: "52,5 kg", "78 lần/phút". Built on TextField (`unit` inside the box on the right, read after the label).

- **One message line above the box** (version 2.4). Everything the field says sits in that one line, which keeps its room whatever it shows:

  | Moment | The line shows |
  |---|---|
  | Empty, nothing wrong | grey "Chưa điền · ví dụ 78" |
  | Typing (focused, a value in) | grey "ví dụ 78" |
  | Filled and left, value normal | nothing (the line keeps its room) |
  | Outside the normal range, typing or left | amber tag "Cao" or "Thấp", then "· bình thường 60–100" when it fits |
  | Its own check failed on leaving | red "!" and "Nhập từ 30 đến 250", "Nhập số, ví dụ 78" or "Nhập số nguyên" |
  | The page's error (after "Xem lại") | red "!" and "Điền mạch, ví dụ 78" |

  The line is as tall as the tallest text it may show while the person works here (the hint, the field's own errors, the page's last error), drawn hidden, so **nothing above or below the field moves when it is focused, typed into or left**, and a click on the next control (typing 95 in Tâm trương, then clicking "Loại II") always lands. In a 13rem staff column every one of these fits one line; in a narrow phone column (the blood pressure pair at 320px) the line is two lines in every state.
- **The tag never sits beside the box.** The box always has its column's full width, so "112 lần/phút" shows whole at every width, the box does not change width when "Cao" appears, and boxes in one column share their right edge.
- **Outside the normal range is not an error**: `normalRange` adds the word tag (StatusTag `attention`, amber, sm), so color is never the only signal and an abnormal value never looks like an input error. The range after it is caption size and is left out when it does not fit beside the tag (screen readers still read it); the line never ends with a stray "·".
- **Errors carry a sign**: a red circle with "!" before the words, as on FormNotice, because in the nursing-home theme red sits next to the orange brand. Screen readers hear "Lỗi:" instead.
- **Range first, then decimals**: "1,58" in a field for centimetres gets "Nhập từ 50 đến 250", not "Nhập số nguyên". The field's own check runs on leaving, not while typing, and its message clears as soon as the value is valid.
- **The page's error wins** and shows in the same line with the example after it. Keep it short ("Điền mạch", "Điền tâm thu"): the line is one line wide in a staff column; the error summary can keep the longer name. A `hint` passed by the screen replaces the automatic hint; an error or a tag takes its place while they show.
- **Decimal comma or dot**: "52,5" and "52.5" both work; on leaving the field a valid entry is tidied to "52,5". `decimals` sets how many digits may follow the comma (default 0).
- `inputmode` numeric or decimal opens the number keypad on phones; no spinner, no scroll-wheel changes.

Blood pressure is two fields ("Tâm thu", "Tâm trương" under a "Huyết áp (mmHg)" group label), not "120/80" in one.
