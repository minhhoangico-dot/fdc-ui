# PhoneInput

Phone field that accepts how people really type: spaces, dots, dashes and +84.

It shows the number pad, autofills from the phone, and tidies the number to "0912 345 678" when the person leaves the field. `onPhoneChange` gives normalized digits (or null). Say why you need the number in `hint` ("Chúng tôi gọi số này để xác nhận lịch"). Error text: "Nhập số điện thoại gồm 10 chữ số, ví dụ 0912 345 678", with no-break spaces in the number so it never breaks over two lines (the default hint "Ví dụ: 0912 345 678" has them). The error looks like a TextField's: the red "!" sign, the red edge drawn inside the box, and the dark-ink focus ring.
