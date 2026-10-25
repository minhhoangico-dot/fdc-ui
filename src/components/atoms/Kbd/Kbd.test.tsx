import { createRef } from 'react';
import { render } from '@testing-library/react';
import { Kbd } from './Kbd';

describe('Kbd', () => {
  it('renders a combination as one <kbd> holding a <kbd> per key', () => {
    const ref = createRef<HTMLElement>();
    const { container } = render(<Kbd ref={ref} keys={['Ctrl', 'S']} />);
    const outer = container.firstElementChild!;
    expect(outer).toBe(ref.current);
    expect(outer.tagName).toBe('KBD');
    expect([...outer.querySelectorAll('kbd')].map((k) => k.textContent)).toEqual(['Ctrl', 'S']);
    expect(outer).toHaveTextContent('Ctrl + S');
  });

  it('renders a single key from children', () => {
    const { container } = render(<Kbd>Esc</Kbd>);
    expect(container.querySelector('kbd')).toHaveTextContent('Esc');
    expect(container.querySelectorAll('kbd')).toHaveLength(1);
  });
});
