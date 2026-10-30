/**
 * The measuring behind StaffLayout's keyboard focus helper: where a focused control shows, ring and label included,
 * and how far to scroll so it shows between the sticky bars. Kept apart from the component so the numbers can be
 * tested without a browser.
 */

/** A control's labels that are drawn (not display: none, nor visually hidden to 1px). */
function shownLabels(el: HTMLElement): DOMRect[] {
  const labels = 'labels' in el ? Array.from((el as HTMLInputElement).labels ?? []) : [];
  return labels.map((l) => l.getBoundingClientRect()).filter((r) => r.width > 1 && r.height > 1);
}

/**
 * Where a focused control shows on screen, ring included: the element that draws the ring (the control itself, or
 * the closest option or slot that draws it for a small or hidden input, as RadioGroup and TimeSlotPicker do) grown
 * by the ring's width and offset, and the control's drawn labels (an option's words can run below its ring).
 * `top` is the top of a label above the control (a field's label sits above its message line and box), else the
 * ring's top.
 */
export function focusBox(el: HTMLElement): { top: number; ringTop: number; bottom: number } {
  let drawer: HTMLElement = el;
  let ring = 0;
  for (let node: HTMLElement | null = el, i = 0; node && i < 4; node = node.parentElement, i++) {
    const cs = getComputedStyle(node);
    const width = cs.outlineStyle === 'none' ? 0 : parseFloat(cs.outlineWidth) || 0;
    if (width > 0) {
      drawer = node;
      ring = Math.max(0, width + (parseFloat(cs.outlineOffset) || 0));
      break;
    }
  }
  const r = drawer.getBoundingClientRect();
  const labels = shownLabels(el);
  const ringTop = r.top - ring;
  return {
    top: Math.min(ringTop, ...labels.map((l) => l.top)),
    ringTop,
    bottom: Math.max(r.bottom + ring, ...labels.map((l) => l.bottom)),
  };
}

/** How far to scroll (px, positive = down) so [top, bottom] lies inside [min, max], moving as little as possible; null when it is taller. */
function scrollToFit(top: number, bottom: number, min: number, max: number): number | null {
  if (bottom - top > max - min) return null;
  if (top < min) return top - min;
  if (bottom > max) return bottom - max;
  return 0;
}

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
export function focusScroll(
  box: { top: number; ringTop: number; bottom: number },
  bars: { top: number; bottom: number },
  padded: { top: number; bottom: number },
): number | null {
  const usual = scrollToFit(box.ringTop, box.bottom, padded.top, padded.bottom);
  if (usual !== null) {
    const under = bars.top - (box.top - usual);
    return under > 0 && box.bottom - usual + under <= padded.bottom ? usual - under : usual;
  }
  const between = (top: number) => {
    const d = scrollToFit(top, box.bottom, bars.top, bars.bottom);
    if (d === null || d < 0) return d;
    // Clear of the action bar: spend the room left above on up to the usual 15px under the ring.
    return d + Math.max(0, Math.min(top - d - bars.top, box.bottom - d - padded.bottom));
  };
  return between(box.top) ?? between(box.ringTop);
}
