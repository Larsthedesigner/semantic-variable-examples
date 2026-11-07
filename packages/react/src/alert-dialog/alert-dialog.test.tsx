// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger,
} from './alert-dialog';

describe('AlertDialog', () => {
  it('uses alertdialog semantics and initially focuses the safe cancel action', async () => {
    const user = userEvent.setup();
    render(
      <AlertDialog>
        <AlertDialogTrigger>Delete account</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Delete your account?</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Delete account</AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>,
    );

    await user.click(screen.getByRole('button', { name: 'Delete account' }));
    expect(screen.getByRole('alertdialog', { name: 'Delete your account?' })).toHaveAttribute('data-state', 'open');
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus();
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });
});
