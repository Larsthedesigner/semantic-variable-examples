// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Label } from './label';

describe('Label', () => {
  it('associates with its control and focuses it on click', async () => {
    const user = userEvent.setup();
    render(<><Label htmlFor="email">Email</Label><input id="email" /></>);
    await user.click(screen.getByText('Email'));
    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveFocus();
  });

  it('shows a decorative required indicator without duplicating the accessible name', () => {
    render(<><Label htmlFor="email" required>Email</Label><input id="email" required /></>);
    expect(screen.getByText('*')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByRole('textbox', { name: 'Email' })).toBeRequired();
  });

  it('omits the indicator for optional fields', () => {
    render(<Label>Email</Label>);
    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it.each(['sm', 'md', 'lg'] as const)('supports the %s typography size', (size) => {
    render(<Label size={size}>Email</Label>);
    expect(screen.getByText('Email').closest('label')).toHaveClass(`svx-label--${size}`);
  });

  it('forwards refs, native attributes, custom classes, and visual states', () => {
    const ref = createRef<HTMLLabelElement>();
    render(<Label ref={ref} id="label" htmlFor="email" invalid disabled className="custom">Email</Label>);
    expect(ref.current).toBe(screen.getByText('Email').closest('label'));
    expect(ref.current).toHaveAttribute('for', 'email');
    expect(ref.current).toHaveAttribute('id', 'label');
    expect(ref.current).toHaveAttribute('data-invalid', 'true');
    expect(ref.current).toHaveAttribute('data-disabled', 'true');
    expect(ref.current).toHaveClass('svx-label', 'svx-label--md', 'custom');
    expect(ref.current).not.toHaveAttribute('disabled');
  });

  it('supports optional hints and uppercase without transforming the hint', () => {
    render(<Label optional textCase="uppercase">Email</Label>);
    expect(screen.getByText('Email').closest('label')).toHaveAttribute('data-case', 'uppercase');
    expect(screen.getByText('(optional)')).toHaveClass('svx-label__optional');
  });

  it('gives the required indicator precedence over the optional hint', () => {
    render(<Label required optional>Email</Label>);
    expect(screen.getByText('*')).toBeInTheDocument();
    expect(screen.queryByText('(optional)')).not.toBeInTheDocument();
  });
});
