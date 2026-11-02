// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { IconButton } from './icon-button';

describe('IconButton', () => {
  it('uses its required label as the accessible name and hides the decorative icon', () => {
    render(<IconButton icon="add" label="Add item" />);
    const button = screen.getByRole('button', { name: 'Add item' });

    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveClass('svx-icon-button', 'svx-button');
    expect(screen.getByText('add')).toHaveClass('svx-material-symbol', 'svx-button__icon');
    expect(screen.getByText('add')).toHaveAttribute('aria-hidden', 'true');
  });

  it('shares button variants and disabled behavior', () => {
    const onClick = vi.fn();
    render(
      <IconButton
        icon="add"
        label="Add item"
        variant="outline"
        color="success"
        size="sm"
        disabled
        onClick={onClick}
      />,
    );
    const button = screen.getByRole('button', { name: 'Add item' });

    expect(button).toHaveClass('svx-button--outline', 'svx-button--color-success', 'svx-button--sm');
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('keeps its accessible name while loading and forwards its ref', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<IconButton ref={ref} icon="save" label="Saving" loading />);
    const button = screen.getByRole('button', { name: 'Saving' });

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button.querySelector('.svx-button__spinner')).toBeInTheDocument();
    expect(button.querySelector('.svx-material-symbol')).not.toBeInTheDocument();
    expect(ref.current).toBe(button);
  });

  it('allows form submission behavior to be opted into explicitly', () => {
    render(<IconButton icon="send" label="Submit" type="submit" />);
    expect(screen.getByRole('button', { name: 'Submit' })).toHaveAttribute('type', 'submit');
  });
});
