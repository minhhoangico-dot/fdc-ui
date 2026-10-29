# FieldRow

Fields side by side in a form ("Họ và tên · Mã bệnh nhân · Năm sinh"). Labels line up with labels and inputs with inputs, even when only some fields have a hint or an error: each TextField spans four row tracks (label, hint, error, input) through CSS subgrid. Columns wrap to one on phones; `minColumn` (default 15rem) sets how narrow a column may get.

Use it for every multi-column form instead of an ad-hoc grid. Put related fields together and keep each row to one topic. In staff tools, wrap the form in `data-density="compact"` for 16px text and 44px fields.
