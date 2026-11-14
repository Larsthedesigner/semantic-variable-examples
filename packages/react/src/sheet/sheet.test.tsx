// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from './sheet';

describe('Sheet', () => {
  it('uses Dialog semantics and dismisses with focus restored to its trigger', async () => {
    const user = userEvent.setup();
    render(
      <Sheet>
        <SheetTrigger>Open navigation</SheetTrigger>
        <SheetContent>
          <SheetTitle>Navigation</SheetTitle>
          <SheetDescription>Choose a workspace destination.</SheetDescription>
          <SheetClose>Close navigation</SheetClose>
        </SheetContent>
      </Sheet>,
    );

    const trigger = screen.getByRole('button', { name: 'Open navigation' });
    await user.click(trigger);
    expect(screen.getByRole('dialog', { name: 'Navigation' })).toHaveAttribute('data-side', 'right');
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it.each(['top', 'right', 'bottom', 'left'] as const)('sets the %s placement', side => {
    render(
      <Sheet defaultOpen>
        <SheetContent side={side}>
          <SheetTitle>Details</SheetTitle>
          <SheetDescription>Sheet contents.</SheetDescription>
        </SheetContent>
      </Sheet>,
    );

    expect(screen.getByRole('dialog', { name: 'Details' })).toHaveAttribute('data-side', side);
  });

  it.each(['sm', 'md', 'lg', 'full'] as const)('sets the %s size preset', size => {
    render(
      <Sheet defaultOpen>
        <SheetContent size={size}>
          <SheetTitle>Sizes</SheetTitle>
          <SheetDescription>Sheet contents.</SheetDescription>
        </SheetContent>
      </Sheet>,
    );

    expect(screen.getByRole('dialog', { name: 'Sizes' })).toHaveAttribute('data-size', size);
  });
});
