# NumberField

A number with its unit, for measurements and results: "52,5 kg", "78 lần/phút". Built on TextField (`unit` inside the box on the right, read after the label).

- **One message line above the box** (version 2.4). Everything the field says sits in that one line, which keeps its room whatever it shows:

  | Moment | The line shows |
  |---|---|
  | Empty, not focused | grey "Chưa điền" |
  | Focused (empty or typing) | grey "ví dụ 78" |
  | Filled and left, value normal | nothing (the line keeps its room) |
  | Outside the normal range, typing or left | amber tag "Cao" or "Thấp", then "· bình thường 60–100" when it fits |
  | Its own check failed on leaving | red "!" and "Từ 30 đến 250" (or "Từ 30 trở lên", "Tối đa 250"), "Chỉ nhập số", "Chỉ số nguyên" or "Chỉ 1 số lẻ" |
  | The page's error (after "Xem lại", while still empty) | red "!" and the page's short text, as given: "Điền mạch" |

  The line is as tall as the tallest text it may show while the person works here (the hints, the field's own errors, the page's last error), drawn hidden, so **nothing above or below the field moves when it is focused, typed into or left**, and a click on the next control (typing 95 in Tâm trương, then clicking "Loại II") always lands. **Every text the field writes itself fits one line of a 9rem (144px) column** with the error sign (the longest, "Từ 50 đến 300", is 141px), so the line is one line in every state: give a measurement at least 9rem (FieldRow `minColumn="9rem"`; the entry page puts the blood pressure pair under each other below two 9rem columns). The example shows while the field has focus, the moment it helps; at rest an empty field just says "Chưa điền".
- **The tag never sits beside the box.** The box always has its column's full width, so "112 lần/phút" shows whole at every width, the box does not change width when "Cao" appears, and boxes in one column share their right edge.
- **Outside the normal range is not an error**: `normalRange` adds the word tag (StatusTag `attention`, amber, sm), so color is never the only signal and an abnormal value never looks like an input error. The range after it is caption size and is left out when it does not fit beside the tag (screen readers still read it); the line never ends with a stray "·".
- **Errors carry a sign**: a red circle with "!" before the words, as on FormNotice, because in the nursing-home theme red sits next to the orange brand. Screen readers hear "Lỗi:" instead.
- **Range first, then decimals**: "1,58" in a field for centimetres gets "Từ 50 đến 250", not "Chỉ số nguyên". The field's own check runs on leaving, not while typing, and its message clears as soon as the value is valid. The texts do not repeat the label or the unit: both are on screen.
- **The page's error wins** and shows in the same line, as given (no example is added: it would take a second line in a phone column). Keep it short and name the measure: "Điền mạch", "Điền tâm thu", "Điền tâm trương" (the group label says "Huyết áp"); the error summary links with the short names. **Pass an "Điền …" only while the field is empty**: once something is typed the line shows the field's own message (a pulse of 112 gets the amber "Cao · bình thường 60–100" with no red edge; 300 gets "Từ 30 đến 250" on leaving), even while the page keeps its error summary as it was until the next press. The line keeps the room of the page's last error, so dropping it moves nothing. A `hint` passed by the screen replaces the automatic hint; an error or a tag takes its place while they show.
- **Decimal comma or dot**: "52,5" and "52.5" both work; on leaving the field a valid entry is tidied to "52,5". `decimals` sets how many digits may follow the comma (default 0).
- `inputmode` numeric or decimal opens the number keypad on phones; no spinner, no scroll-wheel changes.

Blood pressure is two fields ("Tâm thu", "Tâm trương" under a "Huyết áp (mmHg)" group label), not "120/80" in one.
