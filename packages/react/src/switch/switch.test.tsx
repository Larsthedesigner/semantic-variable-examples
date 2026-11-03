// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Switch } from './switch';
import { Field, FieldLabel, FieldControl, FieldDescription, FieldError } from '../field/field';

describe('Switch', () => {
  it('renders a named native checkbox with switch semantics and a forwarded ref', () => {
    const ref = createRef<HTMLInputElement>();
    render(<><label htmlFor="notifications">Notifications</label><Switch id="notifications" ref={ref} className="custom" /></>);
    const control = screen.getByRole('switch', { name: 'Notifications' });
    expect(control).toHaveAttribute('type', 'checkbox');
    expect(control).not.toBeChecked();
    expect(control).toHaveClass('svx-switch', 'svx-focus-ring', 'custom');
    expect(control.parentElement).toHaveAttribute('data-size', 'md');
    expect(ref.current).toBe(control);
  });

  it('toggles using its label and Space with native change events', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const onCheckedChange = vi.fn();
    render(<label>Notifications<Switch onChange={onChange} onCheckedChange={onCheckedChange} /></label>);
    const control = screen.getByRole('switch', { name: 'Notifications' });
    await user.click(screen.getByText('Notifications'));
    expect(control).toBeChecked();
    expect(control).toHaveFocus();
    await user.keyboard(' ');
    expect(control).not.toBeChecked();
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onCheckedChange.mock.calls).toEqual([[true], [false]]);
  });

  it('leaves controlled state with the owner and supports controlled updates', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    const { rerender, unmount } = render(<Switch aria-label="Notifications" checked={false} onCheckedChange={onCheckedChange} />);
    await user.click(screen.getByRole('switch'));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole('switch')).not.toBeChecked();
    rerender(<Switch aria-label="Notifications" checked onCheckedChange={onCheckedChange} />);
    expect(screen.getByRole('switch')).toBeChecked();
    unmount();
    function Example() {
      const [checked, setChecked] = useState(false);
      return <Switch aria-label="Notifications" checked={checked} onCheckedChange={setChecked} />;
    }
    render(<Example />);
    await user.click(screen.getByRole('switch'));
    expect(screen.getByRole('switch')).toBeChecked();
  });

  it('supports native form values, required validation, and uncontrolled reset', async () => {
    const user = userEvent.setup();
    render(
      <form aria-label="Settings">
        <Switch aria-label="Notifications" name="notifications" value="enabled" defaultChecked required />
        <button type="reset">Reset</button>
      </form>,
    );
    const form = screen.getByRole('form') as HTMLFormElement;
    const control = screen.getByRole('switch');
    expect(new FormData(form).get('notifications')).toBe('enabled');
    expect(control).toBeValid();
    await user.click(control);
    expect(new FormData(form).has('notifications')).toBe(false);
    expect(control).toBeInvalid();
    await user.click(screen.getByRole('button'));
    expect(control).toBeChecked();
    expect(control).toBeValid();
    expect(new FormData(form).get('notifications')).toBe('enabled');
  });

  it('does not change or submit a value when disabled', async () => {
    const onCheckedChange = vi.fn();
    render(<form aria-label="Settings"><Switch aria-label="Notifications" disabled defaultChecked name="notifications" onCheckedChange={onCheckedChange} /></form>);
    const control = screen.getByRole('switch');
    await userEvent.setup().click(control);
    expect(control).toBeDisabled();
    expect(control).toBeChecked();
    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(new FormData(screen.getByRole('form') as HTMLFormElement).has('notifications')).toBe(false);
  });

  it('composes Field associations, size, state, and refs without losing switch behavior', () => {
    const ref = createRef<HTMLElement>();
    const example = (invalid: boolean, disabled: boolean) => (
      <Field size="lg" invalid={invalid} disabled={disabled} required>
        <FieldLabel>Notifications</FieldLabel>
        <FieldControl ref={ref}><Switch size="sm" invalid /></FieldControl>
        <FieldDescription>Receive notifications.</FieldDescription>
        <FieldError>Enable notifications to continue.</FieldError>
      </Field>
    );
    const { rerender } = render(example(true, true));
    const control = screen.getByRole('switch', { name: 'Notifications' });
    expect(control).toHaveAccessibleDescription('Receive notifications. Enable notifications to continue.');
    expect(control).toHaveAttribute('aria-invalid', 'true');
    expect(control).toBeDisabled();
    expect(control).toBeRequired();
    expect(control.parentElement).toHaveAttribute('data-size', 'lg');
    expect(ref.current).toBe(control);
    rerender(example(false, false));
    expect(control).toHaveAttribute('aria-invalid', 'false');
    expect(control).not.toBeDisabled();
    expect(control).toHaveAccessibleDescription('Receive notifications.');
  });

  it.each(['sm', 'md', 'lg'] as const)('supports standalone %s sizing and invalid state', (size) => {
    render(<Switch aria-label="Notifications" size={size} invalid />);
    const control = screen.getByRole('switch');
    expect(control.parentElement).toHaveAttribute('data-size', size);
    expect(control).toHaveAttribute('aria-invalid', 'true');
  });
});
