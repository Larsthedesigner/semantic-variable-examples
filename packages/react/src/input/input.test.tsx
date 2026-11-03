// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Input } from './input';

describe('Input', () => {
  it('forwards native props and ref and merges the shared focus class', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input ref={ref} aria-label="Email" type="email" name="email" autoComplete="email" required htmlSize={24} className="custom" aria-describedby="hint" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('svx-input', 'svx-focus-ring', 'custom');
    expect(input).toHaveAttribute('data-size', 'md');
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toHaveAttribute('name', 'email');
    expect(input).toHaveAttribute('autocomplete', 'email');
    expect(input).toHaveAttribute('size', '24');
    expect(input).toHaveAttribute('aria-describedby', 'hint');
    expect(input).toBeRequired();
    expect(ref.current).toBe(input);
  });

  it.each(['sm', 'md', 'lg'] as const)('supports %s sizing without setting native size', (size) => {
    render(<Input aria-label="Name" size={size} />);
    expect(screen.getByRole('textbox')).toHaveAttribute('data-size', size);
    expect(screen.getByRole('textbox')).not.toHaveAttribute('size');
  });

  it('supports invalid state and gives explicit aria-invalid precedence', () => {
    const { rerender } = render(<Input aria-label="Name" invalid />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    rerender(<Input aria-label="Name" invalid aria-invalid={false} />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'false');
    rerender(<Input aria-label="Name" aria-invalid="spelling" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'spelling');
  });

  it('supports uncontrolled editing and controlled values with native change events', async () => {
    const user = userEvent.setup();
    function Example() {
      const [value, setValue] = useState('');
      return <Input aria-label="Name" value={value} onChange={(event) => setValue(event.target.value)} />;
    }
    const { unmount } = render(<Input aria-label="Name" defaultValue="Alex" />);
    await user.type(screen.getByRole('textbox'), ' Smith');
    expect(screen.getByRole('textbox')).toHaveValue('Alex Smith');
    unmount();
    render(<Example />);
    await user.type(screen.getByRole('textbox'), 'Alex');
    expect(screen.getByRole('textbox')).toHaveValue('Alex');
  });

  it.each([{ disabled: true }, { readOnly: true }])('prevents editing with %o', async (props) => {
    const onChange = vi.fn();
    render(<Input aria-label="Name" defaultValue="Alex" onChange={onChange} {...props} />);
    await userEvent.setup().type(screen.getByRole('textbox'), ' Smith');
    expect(screen.getByRole('textbox')).toHaveValue('Alex');
    expect(onChange).not.toHaveBeenCalled();
  });
});
