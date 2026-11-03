// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { SupportingText } from './supporting-text';

describe('SupportingText', () => {
  it('provides a control description through its id', () => {
    render(
      <>
        <input aria-label="Email" aria-describedby="hint" />
        <SupportingText id="hint">Use your work email.</SupportingText>
      </>,
    );
    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveAccessibleDescription('Use your work email.');
    expect(screen.getByText('Use your work email.').closest('p')).toBeInTheDocument();
  });

  it('styles errors without implicitly creating a live region', () => {
    render(<SupportingText invalid>Enter a valid email address.</SupportingText>);
    const text = screen.getByText('Enter a valid email address.').closest('p');
    expect(text).toHaveAttribute('data-invalid', 'true');
    expect(text).not.toHaveAttribute('role');
    expect(text).not.toHaveAttribute('aria-live');
  });

  it('allows consumers to opt into announcements', () => {
    render(<SupportingText invalid role="alert">Email is required.</SupportingText>);
    expect(screen.getByRole('alert')).toHaveTextContent('Email is required.');
  });

  it.each(['sm', 'md', 'lg'] as const)('supports the %s typography size', (size) => {
    render(<SupportingText size={size}>Hint</SupportingText>);
    expect(screen.getByText('Hint').closest('p')).toHaveClass(`svx-supporting-text--${size}`);
  });

  it('forwards refs, custom classes, and disabled styling without native disabled markup', () => {
    const ref = createRef<HTMLParagraphElement>();
    render(<SupportingText ref={ref} id="hint" disabled className="custom">Hint</SupportingText>);
    expect(ref.current).toBe(screen.getByText('Hint').closest('p'));
    expect(ref.current).toHaveClass('svx-supporting-text', 'svx-supporting-text--md', 'custom');
    expect(ref.current).toHaveAttribute('id', 'hint');
    expect(ref.current).toHaveAttribute('data-disabled', 'true');
    expect(ref.current).not.toHaveAttribute('disabled');
    expect(ref.current).not.toHaveAttribute('data-invalid');
  });

  it.each([['default', 'lock'], ['error', 'error'], ['success', 'check_circle'], ['disabled', 'lock']] as const)(
    'renders decorative Material Symbols for the %s variant',
    (variant, icon) => {
      render(<SupportingText variant={variant} startIcon endIcon>Message</SupportingText>);
      expect(screen.getByText('Message').closest('p')).toHaveAttribute('data-variant', variant);
      for (const symbol of screen.getAllByText(icon)) {
        expect(symbol).toHaveClass('svx-material-symbol');
        expect(symbol).toHaveAttribute('aria-hidden', 'true');
      }
    },
  );

  it('gives disabled state precedence over invalid and success', () => {
    render(<SupportingText disabled invalid variant="success">Message</SupportingText>);
    expect(screen.getByText('Message').closest('p')).toHaveAttribute('data-variant', 'disabled');
  });
});
