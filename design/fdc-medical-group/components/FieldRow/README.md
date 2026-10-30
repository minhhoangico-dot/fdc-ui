# FieldRow

Fields side by side in a form ("Họ và tên · Mã bệnh nhân · Năm sinh"). Labels line up with labels and inputs with inputs, even when only some fields have a hint or an error: each field spans four row tracks (label, hint, error, input) through CSS subgrid. Columns wrap to one on phones; `minColumn` (default 15rem) sets how narrow a column may get.

It lines up **TextField, NumberField (a TextField), Combobox and Select** in any mix: a Combobox with its search hint next to a TextField with a longer hint and a Select with none still share one label line and one box line. A new field component lines up only when it tags its parts `data-part="label" | "hint" | "error" | "control"` (in that order, as direct children of its root) and its `data-component` is added to FieldRow's list.

Use it for every multi-column form instead of an ad-hoc grid. Put related fields together and keep each row to one topic. In staff tools, wrap the form in `data-density="compact"` for 16px text and 44px fields.
