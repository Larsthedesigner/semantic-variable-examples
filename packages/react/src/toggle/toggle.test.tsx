// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Toggle } from './toggle';

describe('Toggle', () => {
  it('renders a native non-submitting button with a stable accessible name and ref', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Toggle ref={ref} className="custom" iconStartIcon="format_bold">Bold</Toggle>);
    const button = screen.getByRole('button', { name: 'Bold' });
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(button).toHaveClass('svx-toggle', 'svx-focus-ring', 'custom');
    expect(screen.getByText('format_bold')).toHaveAttribute('aria-hidden', 'true');
    expect(ref.current).toBe(button);
  });

  it('toggles uncontrolled state with click, Space, and Enter', async () => {
    const user = userEvent.setup();
    const onPressedChange = vi.fn();
    render(<Toggle defaultPressed onPressedChange={onPressedChange}>Bold</Toggle>);
    const button = screen.getByRole('button', { name: 'Bold' });
    expect(button).toHaveAttribute('aria-pressed', 'true');
    await user.click(button);
    expect(button).toHaveAttribute('aria-pressed', 'false');
    await user.keyboard(' ');
    expect(button).toHaveAttribute('aria-pressed', 'true');
    await user.keyboard('{Enter}');
    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(onPressedChange.mock.calls).toEqual([[false], [true], [false]]);
  });

  it('keeps controlled state with the owner and supports updates', async () => {
    const user = userEvent.setup();
    const onPressedChange = vi.fn();
    const { rerender, unmount } = render(<Toggle pressed={false} onPressedChange={onPressedChange}>Bold</Toggle>);
    await user.click(screen.getByRole('button'));
    expect(onPressedChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
    rerender(<Toggle pressed>Bold</Toggle>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
    unmount();
    function Example() {
      const [pressed, setPressed] = useState(false);
      return <Toggle pressed={pressed} onPressedChange={setPressed}>Bold</Toggle>;
    }
    render(<Example />);
    await user.click(screen.getByRole('button'));
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
  });

  it('does not toggle when disabled or when onClick prevents default', async () => {
    const user = userEvent.setup();
    const onPressedChange = vi.fn();
    const { rerender } = render(<Toggle disabled defaultPressed onPressedChange={onPressedChange}>Bold</Toggle>);
    await user.click(screen.getByRole('button'));
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
    expect(onPressedChange).not.toHaveBeenCalled();
    rerender(<Toggle onPressedChange={onPressedChange} onClick={(event) => event.preventDefault()}>Bold</Toggle>);
    await user.click(screen.getByRole('button'));
    expect(onPressedChange).not.toHaveBeenCalled();
  });

  it.each(['sm', 'md', 'lg'] as const)('uses the shared %s button size', (size) => {
    render(<Toggle size={size} aria-label="Bold" iconStartIcon="format_bold" />);
    expect(screen.getByRole('button', { name: 'Bold' })).toHaveClass(`svx-button--${size}`);
  });

  it('does not submit its surrounding form by default', async () => {
    const onSubmit = vi.fn((event) => event.preventDefault());
    render(<form onSubmit={onSubmit}><Toggle>Bold</Toggle></form>);
    await userEvent.setup().click(screen.getByRole('button'));
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
