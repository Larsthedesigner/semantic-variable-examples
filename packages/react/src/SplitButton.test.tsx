// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { SplitButton } from './SplitButton';

// Radix's Popper/DropdownMenu primitives rely on APIs jsdom doesn't implement.
beforeAll(() => {
  class MockResizeObserver {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
  }
  window.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;
  Element.prototype.hasPointerCapture ??= () => false;
  Element.prototype.releasePointerCapture ??= () => {};
  Element.prototype.scrollIntoView ??= () => {};
});

const actions = [
  { value: 'duplicate', label: 'Duplicate' },
  { value: 'delete', label: 'Delete', disabled: true },
];

/**
 * The full open-menu / select-item flow is intentionally NOT exercised here:
 * Radix's `DropdownMenu` (Presence + FocusScope + Popper) hangs indefinitely
 * under jsdom + `@testing-library/user-event` regardless of how it's
 * composed — reproducible with the bare Radix primitives, unrelated to
 * SplitButton itself. That interaction is verified visually in Storybook;
 * these tests cover what SplitButton actually owns: primary click wiring,
 * trigger affordances, and disabled propagation.
 */
describe('SplitButton', () => {
  it('runs onClick with the primary value on main click', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <SplitButton actions={actions} onClick={onClick}>
        Save
      </SplitButton>,
    );

    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(onClick).toHaveBeenCalledWith(expect.objectContaining({ value: '__primary__', label: 'Save' }));
  });

  it('renders the chevron trigger with menu affordances', () => {
    render(
      <SplitButton actions={actions} onClick={vi.fn()}>
        Save
      </SplitButton>,
    );

    const trigger = screen.getByRole('button', { name: 'More actions' });
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('disables both halves when disabled', () => {
    render(
      <SplitButton actions={actions} onClick={vi.fn()} disabled>
        Save
      </SplitButton>,
    );

    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'More actions' })).toBeDisabled();
  });

  it('disables the chevron when there are no menu actions', () => {
    render(
      <SplitButton actions={[]} onClick={vi.fn()}>
        Save
      </SplitButton>,
    );

    expect(screen.getByRole('button', { name: 'More actions' })).toBeDisabled();
  });
});
