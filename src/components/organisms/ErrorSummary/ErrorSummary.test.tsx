import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorSummary } from './ErrorSummary';

const fields = ['chieu-cao', 'can-nang', 'mach', 'huyet-ap'];
const errors = [
  { fieldId: 'chieu-cao', text: 'Chiều cao' },
  { fieldId: 'can-nang', text: 'Cân nặng' },
  { fieldId: 'mach', text: 'Mạch' },
  { fieldId: 'huyet-ap', text: 'Huyết áp tâm thu' },
];
const title = (n: number) => `Còn ${n} mục chưa điền`;

function Form({ layout, items = errors, focusOnMount }: { layout?: 'list' | 'inline'; items?: typeof errors; focusOnMount?: boolean }) {
  return (
    <>
      <ErrorSummary layout={layout} title={title(items.length)} errors={items} focusOnMount={focusOnMount} />
      {fields.map((id) => (
        <input key={id} id={id} aria-label={id} />
      ))}
    </>
  );
}

describe('ErrorSummary', () => {
  it('renders nothing without errors', () => {
    const { container } = render(<ErrorSummary errors={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('is an alert named by its title, focused on mount, one link per problem', () => {
    render(<ErrorSummary errors={[{ fieldId: 'name', text: 'Nhập họ và tên' }]} />);
    const alert = screen.getByRole('alert', { name: 'Vui lòng kiểm tra lại thông tin' });
    expect(alert).toHaveAttribute('data-layout', 'list');
    expect(alert).toHaveFocus();
    expect(screen.getByRole('link', { name: 'Nhập họ và tên' })).toHaveAttribute('href', '#name');
  });

  it('moves focus to the field when a link is pressed', async () => {
    render(<Form />);
    await userEvent.click(screen.getByRole('link', { name: 'Mạch' }));
    expect(document.getElementById('mach')).toHaveFocus();
  });

  it('can wait for the page to move focus', () => {
    render(<ErrorSummary focusOnMount={false} errors={[{ fieldId: 'name', text: 'Nhập họ và tên' }]} />);
    expect(screen.getByRole('alert')).not.toHaveFocus();
  });
});

describe('ErrorSummary v2.4 inline', () => {
  it('puts the links side by side, set apart by space only, but keeps a list of four items for screen readers', () => {
    render(<Form layout="inline" />);
    const alert = screen.getByRole('alert', { name: 'Còn 4 mục chưa điền' });
    expect(alert).toHaveAttribute('data-layout', 'inline');
    const list = within(alert).getByRole('list');
    const items = within(list).getAllByRole('listitem');
    expect(items).toHaveLength(4);
    // No dots between the links: each item is exactly its link, so no line can start or end with a dot.
    expect(items.map((li) => li.textContent)).toEqual(['Chiều cao', 'Cân nặng', 'Mạch', 'Huyết áp tâm thu']);
    expect(within(items[1]).getByRole('link')).toHaveAccessibleName('Cân nặng');
  });

  it('shows the "!" sign before the heading, hidden from screen readers', () => {
    render(<Form layout="inline" />);
    const heading = screen.getByRole('heading', { level: 2 });
    const mark = heading.querySelector('[data-part="mark"]');
    expect(mark).toHaveTextContent('!');
    expect(mark).toHaveAttribute('aria-hidden', 'true');
    expect(heading).toHaveAccessibleName('Còn 4 mục chưa điền');
  });

  it('is still focused on mount and its links still move focus to the fields', async () => {
    render(<Form layout="inline" />);
    expect(screen.getByRole('alert')).toHaveFocus();
    await userEvent.tab();
    expect(screen.getByRole('link', { name: 'Chiều cao' })).toHaveFocus();
    await userEvent.click(screen.getByRole('link', { name: 'Huyết áp tâm thu' }));
    expect(document.getElementById('huyet-ap')).toHaveFocus();
  });
});

describe('ErrorSummary v2.4 read once', () => {
  it('stays an alert while focus is in it, and becomes a group named by its title once focus moves on', async () => {
    render(<Form layout="inline" />);
    const summary = screen.getByRole('alert', { name: 'Còn 4 mục chưa điền' });
    await userEvent.tab();
    expect(screen.getByRole('alert')).toBe(summary);
    await userEvent.click(screen.getByRole('link', { name: 'Mạch' }));
    expect(document.getElementById('mach')).toHaveFocus();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Còn 4 mục chưa điền' })).toBe(summary);
  });

  it('does not read a changed list again: the new words come with the group role, in the same render', () => {
    const { rerender } = render(<Form layout="inline" focusOnMount={false} />);
    expect(screen.getByRole('alert')).not.toHaveFocus();
    rerender(<Form layout="inline" focusOnMount={false} items={errors.slice(2)} />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    const group = screen.getByRole('group', { name: 'Còn 2 mục chưa điền' });
    expect(within(group).getAllByRole('link')).toHaveLength(2);
  });

  it('keeps the same element and focus when the list changes while it has focus', () => {
    const { rerender } = render(<Form layout="inline" />);
    const summary = screen.getByRole('alert');
    rerender(<Form layout="inline" focusOnMount={false} items={errors.slice(1)} />);
    expect(screen.getByRole('group', { name: 'Còn 3 mục chưa điền' })).toBe(summary);
    expect(summary).toHaveFocus();
  });

  it('is an alert again when it comes back after having no errors', () => {
    const { rerender } = render(<Form focusOnMount={false} />);
    act(() => screen.getByRole('alert').focus());
    act(() => screen.getByRole('link', { name: 'Mạch' }).focus());
    act(() => (document.getElementById('mach') as HTMLElement).focus());
    expect(screen.getByRole('group')).toBeInTheDocument();
    rerender(<Form focusOnMount={false} items={[]} />);
    expect(screen.queryByRole('group')).not.toBeInTheDocument();
    rerender(<Form focusOnMount={false} items={errors.slice(0, 1)} />);
    expect(screen.getByRole('alert', { name: 'Còn 1 mục chưa điền' })).toBeInTheDocument();
  });

  it('is an alert again with a new key (the page shows it again on the next "Xem lại")', () => {
    const { rerender } = render(<ErrorSummary key={1} focusOnMount={false} errors={errors} title={title(4)} />);
    rerender(<ErrorSummary key={1} focusOnMount={false} errors={errors.slice(1)} title={title(3)} />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    rerender(<ErrorSummary key={2} focusOnMount={false} errors={errors.slice(1)} title={title(3)} />);
    expect(screen.getByRole('alert', { name: 'Còn 3 mục chưa điền' })).toBeInTheDocument();
  });
});
