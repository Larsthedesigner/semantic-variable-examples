// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import {
  Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger,
} from './dialog';

describe('Dialog', () => {
  it.each([undefined, true, false])('sets the scrim to %s without changing modal dismissal', async (scrim) => {
    const user = userEvent.setup();
    render(
      <Dialog defaultOpen>
        <DialogContent scrim={scrim} overlayClassName="custom-overlay">
          <DialogTitle>Project details</DialogTitle>
          <DialogDescription>Review project information.</DialogDescription>
          <DialogClose>Done</DialogClose>
        </DialogContent>
      </Dialog>,
    );

    expect(document.querySelector('.custom-overlay')).toHaveAttribute('data-scrim', String(scrim ?? true));
    expect(screen.getByRole('dialog', { name: 'Project details' })).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders a named trigger and keeps modal content closed by default', () => {
    render(
      <Dialog>
        <DialogTrigger>Open details</DialogTrigger>
        <DialogContent>
          <DialogTitle>Project details</DialogTitle>
          <DialogDescription>Review project information.</DialogDescription>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.getByRole('button', { name: 'Open details' })).toHaveAttribute('aria-haspopup', 'dialog');
    expect(screen.getByRole('button', { name: 'Open details' })).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens a labelled modal and closes from its close control', async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger>Open details</DialogTrigger>
        <DialogContent>
          <DialogTitle>Project details</DialogTitle>
          <DialogDescription>Review project information.</DialogDescription>
          <DialogClose>Done</DialogClose>
        </DialogContent>
      </Dialog>,
    );

    const trigger = screen.getByRole('button', { name: 'Open details' });
    await user.click(trigger);
    expect(screen.getByRole('dialog', { name: 'Project details' })).toHaveAttribute('data-state', 'open');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await user.click(screen.getByRole('button', { name: 'Done' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('dismisses on Escape and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger>Open details</DialogTrigger>
        <DialogContent>
          <DialogTitle>Project details</DialogTitle>
          <DialogDescription>Review project information.</DialogDescription>
        </DialogContent>
      </Dialog>,
    );

    const trigger = screen.getByRole('button', { name: 'Open details' });
    await user.click(trigger);
    expect(screen.getByRole('dialog', { name: 'Project details' })).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});
