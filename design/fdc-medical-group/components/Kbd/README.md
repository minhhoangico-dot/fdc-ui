# Kbd

A keyboard key for shortcut hints: "Ctrl + S lưu". A light key cap: `surface-alt` fill, a 1px `border` edge (no heavy bottom), `text-default` at 500 weight, so a hint never outweighs the screen's buttons.

Pass `keys={['Ctrl', 'S']}` for a combination (one key cap each, joined by " + ") or a single key as children. Show the hint where the shortcut works, after the words ("Ctrl + S lưu"), not in a far-away help page.

Staff tools use **Ctrl combinations only**. Single-letter shortcuts fire by accident while typing Vietnamese with Telex, so never bind J, K, S, E or digits on their own.
