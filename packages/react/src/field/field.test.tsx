// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, StrictMode } from 'react';
import { describe, expect, it } from 'vitest';
import { Field, FieldLabel, FieldControl, FieldDescription, FieldError } from './field';
import { Input } from '../input/input';
import { Textarea } from '../textarea/textarea';

describe('Field', () => {
  it('associates the label and forwards required, disabled, and invalid state', () => {
    render(
      <Field controlId="email" required disabled invalid size="sm">
        <FieldLabel>Email</FieldLabel>
        <FieldControl><input /></FieldControl>
        <FieldDescription>Use your work email.</FieldDescription>
        <FieldError>Enter a valid email.</FieldError>
      </Field>,
    );
    const input = screen.getByRole('textbox', { name: 'Email' });
    expect(input).toHaveAttribute('id', 'email');
    expect(input).toBeRequired();
    expect(input).toBeDisabled();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Use your work email. Enter a valid email.');
    expect(screen.getByText('Email').closest('label')).toHaveClass('svx-label--sm');
    expect(screen.getByText('Enter a valid email.').closest('p')).toHaveAttribute('data-disabled', 'true');
    expect(screen.getByText('lock')).toHaveAttribute('aria-hidden', 'true');
  });

  it('focuses its input when the label is clicked', async () => {
    const user = userEvent.setup();
    render(<Field><FieldLabel>Name</FieldLabel><FieldControl><input /></FieldControl></Field>);
    await user.click(screen.getByText('Name'));
    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveFocus();
    expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-describedby');
  });

  it('updates error associations and removes unmounted descriptions', () => {
    const example = (invalid: boolean, hint: boolean) => (
      <Field invalid={invalid}>
        <FieldLabel>Email</FieldLabel>
        <FieldControl><input aria-describedby="external" /></FieldControl>
        {hint && <FieldDescription id="hint">Hint</FieldDescription>}
        <FieldError id="error">Error</FieldError>
        <span id="external">External</span>
      </Field>
    );
    const { rerender } = render(example(false, true));
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-describedby', 'external hint');
    expect(screen.queryByText('Error')).not.toBeInTheDocument();
    rerender(example(true, true));
    expect(input).toHaveAttribute('aria-describedby', 'external hint error');
    rerender(example(false, false));
    expect(input).toHaveAttribute('aria-describedby', 'external');
    expect(input).toHaveAttribute('aria-invalid', 'false');
  });

  it('uses unique ids for separate fields and preserves child handlers and refs', async () => {
    const user = userEvent.setup();
    const childRef = createRef<HTMLInputElement>();
    const controlRef = createRef<HTMLElement>();
    render(
      <>
        <Field><FieldLabel>First</FieldLabel><FieldControl ref={controlRef}><input ref={childRef} defaultValue="Hello" /></FieldControl></Field>
        <Field><FieldLabel>Second</FieldLabel><FieldControl><textarea /></FieldControl></Field>
      </>,
    );
    const first = screen.getByRole('textbox', { name: 'First' });
    expect(first.id).not.toBe(screen.getByRole('textbox', { name: 'Second' }).id);
    expect(childRef.current).toBe(first);
    expect(controlRef.current).toBe(first);
    await user.type(first, ' world');
    expect(first).toHaveValue('Hello world');
  });

  it('does not duplicate description ids in StrictMode', () => {
    render(
      <StrictMode>
        <Field><FieldControl><input aria-label="Email" aria-describedby="hint" /></FieldControl><FieldDescription id="hint">Hint</FieldDescription></Field>
      </StrictMode>,
    );
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-describedby', 'hint');
  });

  it.each([Input, Textarea])('supplies size, state, descriptions, and refs to a styled control (%#)', (Control) => {
    const ref = createRef<HTMLElement>();
    render(
      <Field size="lg">
        <FieldLabel>Message</FieldLabel>
        <FieldControl ref={ref}><Control size="sm" invalid required disabled /></FieldControl>
        <FieldDescription>Help</FieldDescription>
      </Field>,
    );
    const control = screen.getByRole('textbox', { name: 'Message' });
    expect(control).toHaveAttribute('data-size', 'lg');
    expect(control).toHaveAttribute('aria-invalid', 'false');
    expect(control).not.toBeDisabled();
    expect(control).not.toBeRequired();
    expect(control).toHaveAccessibleDescription('Help');
    expect(control).toHaveClass('svx-focus-ring');
    expect(ref.current).toBe(control);
  });

  it('throws an explicit error for parts outside Field', () => {
    expect(() => render(<FieldLabel>Email</FieldLabel>)).toThrow('Field parts must be rendered inside a Field.');
  });
});
