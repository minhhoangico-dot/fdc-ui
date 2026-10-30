import { render, screen } from '@testing-library/react';
import { FormPartNav } from '../../molecules/FormPartNav';
import { StaffLayout } from './StaffLayout';

it('is a compact page with one main, a labelled aside and action bar', () => {
  const { container } = render(
    <StaffLayout header={{ logo: { src: 'x.png', alt: 'FDC' }, items: [], appName: 'hoso' }} aside={<p>Phần</p>} actionBar={<button type="button">Lưu</button>}>
      <h1>Phiếu</h1>
    </StaffLayout>,
  );
  expect(container.firstChild).toHaveAttribute('data-density', 'compact');
  expect(screen.getByRole('main')).toHaveAttribute('id', 'main');
  expect(screen.getByRole('navigation', { name: 'Các phần của phiếu' })).toBeInTheDocument();
  expect(screen.getByRole('region', { name: 'Lưu và chuyển bước' })).toContainElement(screen.getByRole('button', { name: 'Lưu' }));
});

it('keeps one nav landmark when the aside holds a FormPartNav', () => {
  render(
    <StaffLayout header={{ logo: { src: 'x.png', alt: 'FDC' }, items: [], appName: 'hoso' }} aside={<FormPartNav items={[{ label: '4. Thể lực', count: 'còn 2', current: true }]} />}>
      <h1>Phiếu</h1>
    </StaffLayout>,
  );
  const nav = screen.getByRole('navigation', { name: 'Các phần của phiếu' });
  expect(nav).toContainElement(screen.getByRole('button', { name: '4. Thể lực · còn 2' }));
  expect(nav.querySelector('nav')).toBeNull();
});

describe('sticky bar space', () => {
  const header = { logo: { src: 'x.png', alt: 'FDC' }, items: [], appName: 'hoso' };
  const vars = ['--header-space', '--context-bar-space', '--action-bar-space'];
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('measures the bars that stick and writes their heights on its root and on <html>, removed on unmount', () => {
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
      },
    );
    // jsdom has no layout: give the three bars a sticky position and the heights measured at 320px in a save conflict.
    const heights: Array<[string, number]> = [
      ['header', 55],
      ['[data-component="PatientContextBar"]', 121.4],
      ['section[aria-label="Lưu và chuyển bước"]', 206.8],
    ];
    const heightOf = (el: Element) => heights.find(([sel]) => el.matches(sel))?.[1];
    const realStyle = window.getComputedStyle.bind(window);
    vi.spyOn(window, 'getComputedStyle').mockImplementation((el: Element) => {
      const cs = realStyle(el);
      if (heightOf(el) === undefined) return cs;
      return new Proxy(cs, {
        get: (t, p) => {
          if (p === 'position') return 'sticky';
          const v = Reflect.get(t, p);
          return typeof v === 'function' ? v.bind(t) : v;
        },
      });
    });
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
      const h = heightOf(this) ?? 0;
      return { x: 0, y: 0, top: 0, left: 0, right: 0, width: 0, bottom: h, height: h, toJSON: () => ({}) } as DOMRect;
    });

    const { container, unmount } = render(
      <StaffLayout header={header} context={<section aria-label="Người đang làm" data-component="PatientContextBar" />} actionBar={<button type="button">Lưu</button>}>
        <h1>Phiếu</h1>
      </StaffLayout>,
    );
    const root = container.firstChild as HTMLElement;
    const html = document.documentElement;
    expect(vars.map((v) => html.style.getPropertyValue(v))).toEqual(['55px', '122px', '207px']);
    expect(vars.map((v) => root.style.getPropertyValue(v))).toEqual(['55px', '122px', '207px']);
    unmount();
    expect(vars.map((v) => html.style.getPropertyValue(v))).toEqual(['', '', '']);
  });

  it('without ResizeObserver (old browsers, jsdom) renders and writes nothing; the CSS fallbacks apply', () => {
    vi.stubGlobal('ResizeObserver', undefined);
    render(
      <StaffLayout header={header} actionBar={<button type="button">Lưu</button>}>
        <h1>Phiếu</h1>
      </StaffLayout>,
    );
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(document.documentElement.style.getPropertyValue('--action-bar-space')).toBe('');
  });
});
