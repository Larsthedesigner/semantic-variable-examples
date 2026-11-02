// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Button, buttonColors } from './button';

describe('Button', () => {
  it('renders a native button by default', () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('supports the polymorphic `as` prop', () => {
    render(
      <Button as="a" href="/somewhere">
        Go
      </Button>,
    );
    const link = screen.getByRole('link', { name: 'Go' });
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '/somewhere');
  });

  it('supports asChild, merging props onto the single child', () => {
    render(
      <Button asChild variant="outline">
        <a href="/child">Child link</a>
      </Button>,
    );
    const link = screen.getByRole('link', { name: 'Child link' });
    expect(link.tagName).toBe('A');
    expect(link.className).toContain('svx-button--outline');
  });

  it('renders decorative Material Symbols inside an asChild link', () => {
    render(
      <Button asChild iconStartIcon="add" iconEndIcon="arrow_forward">
        <a href="/new">Create</a>
      </Button>,
    );
    const link = screen.getByRole('link', { name: 'Create' });
    expect(link.querySelectorAll('.svx-material-symbol')).toHaveLength(2);
    expect(link).toHaveTextContent('addCreatearrow_forward');
  });

  it('forwards refs to the underlying element', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Ref me</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('maps variants to token-driven class names', () => {
    render(<Button variant="ghost">Delete</Button>);
    expect(screen.getByRole('button', { name: 'Delete' }).className).toContain('svx-button--ghost');
  });

  it.each(['sm', 'md', 'lg'] as const)('maps the %s size to its size class', (size) => {
    render(<Button size={size}>Sized</Button>);
    expect(screen.getByRole('button', { name: 'Sized' })).toHaveClass(`svx-button--${size}`);
  });

  it('forwards click handlers and disables native buttons', () => {
    const onClick = vi.fn();
    render(
      <Button onClick={onClick} disabled>
        Disabled
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Disabled' });
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it.each(buttonColors)('maps the %s color to a color class', (color) => {
    render(<Button color={color}>Colored</Button>);
    expect(screen.getByRole('button', { name: 'Colored' })).toHaveClass(`svx-button--color-${color}`);
  });

  it('marks loading buttons busy and disabled while showing the spinner', () => {
    render(<Button loading iconStartIcon="save" iconEndIcon="check">Saving</Button>);
    const button = screen.getByRole('button', { name: 'Saving' });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button.querySelector('.svx-button__spinner')).toBeInTheDocument();
    expect(button.querySelector('.svx-material-symbol')).not.toBeInTheDocument();
  });

  it('renders decorative icons around the label', () => {
    render(
      <Button iconStartIcon="add" iconEndIcon="arrow_forward">
        Label
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Label' });
    expect(button).toHaveTextContent('addLabelarrow_forward');
    expect(button.querySelectorAll('.svx-material-symbol.svx-button__icon')).toHaveLength(2);
    expect(button.querySelectorAll('[aria-hidden="true"]')).toHaveLength(2);
  });

  it('prevents clicks on disabled polymorphic links', () => {
    const onClick = vi.fn();
    render(
      <Button as="a" href="/somewhere" disabled onClick={onClick}>
        Disabled link
      </Button>,
    );
    const link = screen.getByRole('link', { name: 'Disabled link' });
    expect(link).toHaveAttribute('aria-disabled', 'true');
    expect(link).toHaveAttribute('tabindex', '-1');
    fireEvent.click(link);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('prevents child click handlers on a disabled asChild button', () => {
    const onClick = vi.fn();
    render(
      <Button asChild disabled>
        <a href="/somewhere" onClick={onClick}>Disabled child</a>
      </Button>,
    );
    const link = screen.getByRole('link', { name: 'Disabled child' });
    expect(link).toHaveAttribute('aria-disabled', 'true');
    fireEvent.click(link);
    expect(onClick).not.toHaveBeenCalled();
  });
});
