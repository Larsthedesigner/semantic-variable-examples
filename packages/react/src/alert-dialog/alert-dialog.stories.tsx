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
  parameters: {
    controls: { disable: true },
    docs: { description: { component: `AlertDialog is a compound confirmation API. Use its explicit cancel and action parts; unlike a regular Dialog, it cannot be dismissed with Escape or by clicking outside.

| Part | Props | Defaults and behavior |
| --- | --- | --- |
| AlertDialog | Radix Root props: \`open?\`, \`defaultOpen?\`, \`onOpenChange?\` | Controlled with \`open\` and \`onOpenChange\`, or initialize with \`defaultOpen\`. |
| AlertDialogTrigger | Radix Trigger props; \`asChild?\` | \`asChild=false\`; merges trigger behavior onto a custom child when true. |
| AlertDialogPortal | Radix Portal props | Portals modal content to the document body. |
| AlertDialogOverlay | Radix Overlay props; \`className?\` | Focus remains modal; overlay styling is provided by the component. |
| AlertDialogContent | Radix Content props; \`scrim?\`, \`overlayClassName?\` | \`scrim=true\`; false hides the backdrop without disabling modal behavior. |
| AlertDialogCancel / AlertDialogAction | Radix Cancel/Action button props; \`asChild?\` | \`asChild=false\`; use these explicit controls to dismiss or confirm. |
| AlertDialogHeader / AlertDialogFooter | Native div props | Layout containers for the heading/description and decision actions. |
| AlertDialogTitle / AlertDialogDescription | Radix Title/Description props | Provide the accessible title and explanation required by the confirmation. |

The action and cancel controls should be clearly labeled and ordered according to the consequences of the decision. Destructive confirmations should use a destructive action style and a safe initial focus target.` } },
  },
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
          <AlertDialogAction asChild><Button color="error" onClick={onConfirm}>Delete workspace</Button></AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Delete workspace' }));
    await expect(screen.getByRole('alertdialog', { name: 'Delete this workspace?' })).toBeVisible();
    await expect(screen.getByRole('button', { name: 'Delete workspace' })).toHaveClass('svx-button--color-error');
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
          <AlertDialogAction asChild><Button color="error">Discard changes</Button></AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

export const WithoutScrim: Story = {
  render: () => (
    <AlertDialog defaultOpen>
      <AlertDialogContent scrim={false}>
        <AlertDialogHeader>
          <AlertDialogTitle>Discard unsaved changes?</AlertDialogTitle>
          <AlertDialogDescription>Your edits will be lost if you leave this page.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild><Button variant="outline">Continue editing</Button></AlertDialogCancel>
          <AlertDialogAction asChild><Button color="error">Discard changes</Button></AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
  play: async () => {
    await expect(screen.getByRole('alertdialog', { name: 'Discard unsaved changes?' })).toBeVisible();
    await userEvent.click(screen.getByRole('button', { name: 'Continue editing' }));
    await expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  },
};
