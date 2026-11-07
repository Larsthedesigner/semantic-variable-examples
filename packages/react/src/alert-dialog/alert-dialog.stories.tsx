import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent } from 'storybook/test';
import { Button } from '../button/button';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from './alert-dialog';

const onConfirm = fn();

const meta = {
  title: 'Components/AlertDialog',
  component: AlertDialog,
  tags: ['autodocs'],
  parameters: { controls: { disable: true } },
} satisfies Meta<typeof AlertDialog>;
export default meta;
type Story = StoryObj<typeof meta>;

export const ConfirmDestructiveAction: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild><Button variant="outline">Delete workspace</Button></AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this workspace?</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone. Projects and settings in this workspace will be removed.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild><Button variant="outline">Keep workspace</Button></AlertDialogCancel>
          <AlertDialogAction asChild><Button onClick={onConfirm}>Delete workspace</Button></AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Delete workspace' }));
    await expect(screen.getByRole('alertdialog', { name: 'Delete this workspace?' })).toBeVisible();
    await userEvent.click(screen.getByRole('button', { name: 'Delete workspace' }));
    await expect(onConfirm).toHaveBeenCalledTimes(1);
    await expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  },
};

export const Open: Story = {
  render: () => (
    <AlertDialog defaultOpen>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Discard unsaved changes?</AlertDialogTitle>
          <AlertDialogDescription>Your edits will be lost if you leave this page.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild><Button variant="outline">Continue editing</Button></AlertDialogCancel>
          <AlertDialogAction asChild><Button>Discard changes</Button></AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};
