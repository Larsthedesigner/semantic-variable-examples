// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';

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

  it('forwards refs to the underlying element', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Ref me</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('maps variants to token-driven class names', () => {
    render(<Button variant="ghost">Delete</Button>);
    expect(screen.getByRole('button', { name: 'Delete' }).className).toContain('svx-button--ghost');
  });

  it('forwards click handlers and native props', () => {
    const onClick = vi.fn();
    render(
      <Button onClick={onClick} disabled>
        Disabled
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Disabled' });
    expect(button).toBeDisabled();
  });
});
