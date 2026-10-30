import { focusBox, focusScroll } from './focusInView';

// Numbers measured in Chrome on the result entry page (pages-nhân-viên-nhập-kết-quả); px from the viewport top.
describe('focusScroll', () => {
  it('a radio option whose ring reaches past the scroll padding: the ring ends 15px above the action bar (1024x768)', () => {
    // Header 0 (it scrolls away from 1024px), context bar 176.4 → 177, action bar 96 → top 672. The browser scrolled the
    // small input to the padding; its option and ring reach 10px lower, to 671.8.
    const bars = { top: 177 + 5, bottom: 768 - 96 - 5 };
    const padded = { top: 177 + 80, bottom: 768 - 96 - 15 };
    const d = focusScroll({ top: 617.8, ringTop: 617.8, bottom: 671.8 }, bars, padded);
    expect(d).toBeCloseTo(14.8);
    expect(671.8 - d!).toBeCloseTo(657); // 15px clear of the bar at 672
  });

  it('a field already clear of both bars is left where it is', () => {
    expect(focusScroll({ top: 300, ringTop: 330, bottom: 390 }, { top: 182, bottom: 667 }, { top: 257, bottom: 657 })).toBe(0);
  });

  it('brings the label 5px under the top bars when a tall message line left it under them', () => {
    // Ring in the padded band, label 20px above the top bars' edge.
    const d = focusScroll({ top: 162, ringTop: 260, bottom: 320 }, { top: 182, bottom: 667 }, { top: 257, bottom: 657 });
    expect(d).toBe(-20);
  });

  it('a phone held sideways (568x320): a textarea taller than the padded band goes between the real bar edges', () => {
    // Header 55, action bar 98: clear area 55–222, padded band only 135–207 (72px) for a ring 97.2px tall.
    const bars = { top: 55 + 5, bottom: 320 - 98 - 5 };
    const padded = { top: 55 + 80, bottom: 320 - 98 - 15 };
    const box = { top: 93.7, ringTop: 144.5, bottom: 241.7 }; // label, then hint, then the box; ring 19px under the bar
    const d = focusScroll(box, bars, padded)!;
    expect(box.top - d).toBeCloseTo(60); // label 5px under the header
    expect(box.bottom - d).toBeCloseTo(208); // ring 14px above the action bar at 222, not under it
  });

  it('on a short screen, lets the label go before the control, and gives up only when the ring does not fit either', () => {
    const bars = { top: 60, bottom: 217 };
    const padded = { top: 135, bottom: 207 };
    // Label and box together 190px: only the box with its ring (120px) fits. Coming from below, it stops 15px above
    // the action bar (ring 87–207), which leaves as much as fits of what is above it in view.
    expect(focusScroll({ top: 100, ringTop: 170, bottom: 290 }, bars, padded)).toBeCloseTo(83);
    // The ring alone is taller than the clear area: the browser's own scroll stands.
    expect(focusScroll({ top: 100, ringTop: 100, bottom: 300 }, bars, padded)).toBeNull();
  });
});

describe('focusBox', () => {
  const rect = (top: number, bottom: number) => ({ x: 0, y: top, top, bottom, left: 0, right: 100, width: 100, height: bottom - top, toJSON: () => ({}) }) as DOMRect;
  afterEach(() => vi.restoreAllMocks());

  it('measures the option that draws the ring around a small radio, ring width and offset included, and its label', () => {
    document.body.innerHTML = `
      <div id="option" style="outline-style: solid; outline-width: 3px; outline-offset: 2px">
        <input id="radio" type="radio" /><label id="label" for="radio">Loại I</label>
      </div>`;
    const tops: Record<string, [number, number]> = { option: [600, 644], radio: [612, 636], label: [610, 638] };
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
      const [t, b] = tops[this.id] ?? [0, 0];
      return rect(t, b);
    });
    expect(focusBox(document.getElementById('radio')!)).toEqual({ top: 595, ringTop: 595, bottom: 649 });
  });

  it('measures a field from its label above to its own ring below', () => {
    document.body.innerHTML = `
      <label id="label" for="box">Lời khuyên</label>
      <textarea id="box" style="outline-style: solid; outline-width: 3px; outline-offset: 1px"></textarea>`;
    const tops: Record<string, [number, number]> = { label: [100, 125], box: [160, 249] };
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
      const [t, b] = tops[this.id] ?? [0, 0];
      return rect(t, b);
    });
    expect(focusBox(document.getElementById('box')!)).toEqual({ top: 100, ringTop: 156, bottom: 253 });
  });
});
