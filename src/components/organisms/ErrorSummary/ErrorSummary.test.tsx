import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorSummary } from './ErrorSummary';

const fields = ['chieu-cao', 'can-nang', 'mach', 'huyet-ap'];
const errors = [
  { fieldId: 'chieu-cao', text: 'Điền chiều cao' },
  { fieldId: 'can-nang', text: 'Điền cân nặng' },
  { fieldId: 'mach', text: 'Điền mạch' },
  { fieldId: 'huyet-ap', text: 'Điền huyết áp tâm thu' },
];

function Form({ layout }: { layout?: 'list' | 'inline' }) {
  return (
    <>
      <ErrorSummary layout={layout} title="Còn 4 mục ở phần 4. Thể lực" errors={errors} />
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
    await userEvent.click(screen.getByRole('link', { name: 'Điền mạch' }));
    expect(document.getElementById('mach')).toHaveFocus();
  });

  it('can wait for the page to move focus', () => {
    render(<ErrorSummary focusOnMount={false} errors={[{ fieldId: 'name', text: 'Nhập họ và tên' }]} />);
    expect(screen.getByRole('alert')).not.toHaveFocus();
  });
});

describe('ErrorSummary v2.4 inline', () => {
  it('puts the links in one line but keeps a list of four items for screen readers', () => {
    render(<Form layout="inline" />);
    const alert = screen.getByRole('alert', { name: 'Còn 4 mục ở phần 4. Thể lực' });
    expect(alert).toHaveAttribute('data-layout', 'inline');
    const list = within(alert).getByRole('list');
    const items = within(list).getAllByRole('listitem');
    expect(items).toHaveLength(4);
    // The dots between links are drawn, not read: link names stay exactly the field's message.
    expect(items[1]).toHaveTextContent(/^Điền cân nặng\s*·$/);
    expect(within(items[1]).getByRole('link')).toHaveAccessibleName('Điền cân nặng');
    expect(alert.querySelectorAll('[aria-hidden="true"]')).toHaveLength(3);
    expect(items[3]).toHaveTextContent(/^Điền huyết áp tâm thu$/);
  });

  it('is still focused on mount and its links still move focus to the fields', async () => {
    render(<Form layout="inline" />);
    expect(screen.getByRole('alert')).toHaveFocus();
    await userEvent.tab();
    expect(screen.getByRole('link', { name: 'Điền chiều cao' })).toHaveFocus();
    await userEvent.click(screen.getByRole('link', { name: 'Điền huyết áp tâm thu' }));
    expect(document.getElementById('huyet-ap')).toHaveFocus();
  });
});
