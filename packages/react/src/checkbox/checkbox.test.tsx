// @vitest-environment jsdom
import { createRef, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Checkbox } from './checkbox';
import { Field, FieldLabel, FieldControl, FieldDescription, FieldError } from '../field/field';

describe('Checkbox', () => {
  it('forwards a native input ref and toggles through its label and Space', async () => {
    const ref = createRef<HTMLInputElement>();
    const changed = vi.fn();
    render(<label>Accept terms<Checkbox ref={ref} onCheckedChange={changed} /></label>);
    const checkbox = screen.getByRole('checkbox', { name: 'Accept terms' });
    expect(ref.current).toBe(checkbox);
    await userEvent.click(screen.getByText('Accept terms'));
    expect(checkbox).toBeChecked();
    await userEvent.keyboard(' ');
    expect(checkbox).not.toBeChecked();
    expect(changed.mock.calls).toEqual([[true], [false]]);
  });
  it('supports controlled checked and mixed state independently', async () => {
    function Example() {
      const [checked, setChecked] = useState(false);
      const [mixed, setMixed] = useState(true);
      return <Checkbox aria-label="All rows" checked={checked} indeterminate={mixed}
        onCheckedChange={value => { setChecked(value); setMixed(false); }} />;
    }
    render(<Example />);
    const input = screen.getByRole('checkbox') as HTMLInputElement;
    expect(input.indeterminate).toBe(true);
    expect(input.checked).toBe(false);
    await userEvent.click(input);
    expect(input.indeterminate).toBe(false);
    expect(input.checked).toBe(true);
  });
  it('preserves a controlled mixed indicator across activation and rerenders', async () => {
    const { rerender } = render(<Checkbox aria-label="All" indeterminate />);
    const input = screen.getByRole('checkbox') as HTMLInputElement;
    await userEvent.click(input);
    expect(input.indeterminate).toBe(true);
    rerender(<Checkbox aria-label="All" indeterminate={false} />);
    expect(input.indeterminate).toBe(false);
  });
  it('supports native required validation, submission, reset, and disabled exclusion', async () => {
    render(<form aria-label="Preferences">
      <Checkbox aria-label="Terms" name="terms" value="accepted" required defaultChecked />
      <Checkbox aria-label="Unavailable" name="disabled" disabled defaultChecked />
      <button type="reset">Reset</button>
    </form>);
    const form = screen.getByRole('form') as HTMLFormElement;
    const control = screen.getByRole('checkbox', { name: 'Terms' });
    expect(new FormData(form).get('terms')).toBe('accepted');
    expect(new FormData(form).has('disabled')).toBe(false);
    await userEvent.click(control);
    expect(control).toBeInvalid();
    await userEvent.click(screen.getByRole('button'));
    expect(control).toBeChecked();
    expect(control).toBeValid();
  });
  it('honors change cancellation and disabled behavior', async () => {
    const changed = vi.fn();
    const { rerender } = render(<Checkbox aria-label="Terms" onChange={event => event.preventDefault()} onCheckedChange={changed} />);
    await userEvent.click(screen.getByRole('checkbox'));
    expect(changed).not.toHaveBeenCalled();
    rerender(<Checkbox aria-label="Terms" disabled onCheckedChange={changed} />);
    await userEvent.click(screen.getByRole('checkbox'));
    expect(changed).not.toHaveBeenCalled();
  });
  it('inherits Field associations and states', () => {
    const ref = createRef<HTMLElement>();
    render(<Field size="lg" invalid disabled required>
      <FieldLabel>Terms</FieldLabel>
      <FieldControl ref={ref}><Checkbox size="sm" /></FieldControl>
      <FieldDescription>Read the terms.</FieldDescription>
      <FieldError>Accept to continue.</FieldError>
    </Field>);
    const input = screen.getByRole('checkbox', { name: 'Terms' });
    expect(input).toHaveAccessibleDescription('Read the terms. Accept to continue.');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toBeDisabled();
    expect(input).toBeRequired();
    expect(input.parentElement).toHaveAttribute('data-size', 'lg');
    expect(ref.current).toBe(input);
  });
});
