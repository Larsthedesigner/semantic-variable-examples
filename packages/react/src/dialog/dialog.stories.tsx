import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentProps } from 'react';
import { expect, screen, userEvent } from 'storybook/test';
import { Button } from '../button/button';
import { Input } from '../input/input';
import { TokenReference } from '../tokens/token-reference';
import type { TokenMode } from '../tokens/token-catalog';
import {
  Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from './dialog';
import type { DialogContentProps } from './dialog';

type DialogStoryArgs = ComponentProps<typeof Dialog> &
  Pick<DialogContentProps, 'scrim' | 'overlayClassName' | 'className' | 'asChild' |
    'onEscapeKeyDown' | 'onPointerDownOutside' | 'onInteractOutside' |
    'onOpenAutoFocus' | 'onCloseAutoFocus'> & { mode?: TokenMode };

const meta = {
  title: 'Components/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  args: { scrim: true },
  argTypes: {
    scrim: {
      control: 'boolean',
      description: 'DialogContent: show the scrim without changing modal behavior.',
      table: { category: 'DialogContent', type: { summary: 'boolean' }, defaultValue: { summary: 'true' } },
    },
    overlayClassName: {
      control: 'text',
      description: 'DialogContent: additional class applied to the overlay.',
      table: { category: 'DialogContent', type: { summary: 'string' } },
    },
    className: { control: false, description: 'DialogContent: additional class applied to the content.', table: { category: 'DialogContent', type: { summary: 'string' } } },
    asChild: { control: false, description: 'DialogContent: merge content props onto its child.', table: { category: 'DialogContent', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } } },
    onEscapeKeyDown: { control: false, description: 'DialogContent: called when Escape is pressed.', table: { category: 'DialogContent', type: { summary: '(event: KeyboardEvent) => void' } } },
    onPointerDownOutside: { control: false, description: 'DialogContent: called for a pointer down outside the dialog.', table: { category: 'DialogContent', type: { summary: '(event: PointerDownOutsideEvent) => void' } } },
    onInteractOutside: { control: false, description: 'DialogContent: called for an outside interaction.', table: { category: 'DialogContent', type: { summary: '(event: OutsideInteractionEvent) => void' } } },
    onOpenAutoFocus: { control: false, description: 'DialogContent: called before focus is moved on open.', table: { category: 'DialogContent', type: { summary: '(event: Event) => void' } } },
    onCloseAutoFocus: { control: false, description: 'DialogContent: called before focus is restored on close.', table: { category: 'DialogContent', type: { summary: '(event: Event) => void' } } },
    open: { control: false, description: 'Dialog: controlled open state.', table: { category: 'Dialog', type: { summary: 'boolean' } } },
    defaultOpen: { control: false, description: 'Dialog: initial uncontrolled open state.', table: { category: 'Dialog', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } } },
    onOpenChange: { control: false, description: 'Dialog: called when the open state changes.', table: { category: 'Dialog', type: { summary: '(open: boolean) => void' } } },
    modal: { control: false, description: 'Dialog: enable modal focus and interaction behavior.', table: { category: 'Dialog', type: { summary: 'boolean' }, defaultValue: { summary: 'true' } } },
    mode: {
      control: 'select', options: ['light', 'dark', 'high-contrast'],
      description: 'Story-only theme mode for the token reference.',
      table: { category: 'Token reference', type: { summary: "'light' | 'dark' | 'high-contrast'" }, defaultValue: { summary: 'light' } },
    },
  },
  parameters: {
    controls: { exclude: ['mode'] },
    docs: { description: { component: 'Compose Dialog with DialogContent, DialogTitle, and DialogDescription. Content props below apply to DialogContent; root props apply to Dialog. DialogContent also accepts standard DOM and inherited Radix Content props. The token reference mode is a story-only argument.' } },
  },
} satisfies Meta<DialogStoryArgs>;
export default meta;
type Story = StoryObj<DialogStoryArgs>;

export const Default: Story = {
  render: ({ scrim, overlayClassName }) => (
    <Dialog>
      <DialogTrigger asChild><Button variant="outline">Edit profile</Button></DialogTrigger>
      <DialogContent scrim={scrim} overlayClassName={overlayClassName}>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>Update your public name. Your changes are not saved by this example.</DialogDescription>
        </DialogHeader>
        <label className="svx-dialog__field">
          Display name
          <Input defaultValue="Alex Morgan" />
        </label>
        <DialogFooter>
          <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
          <DialogClose asChild><Button>Save changes</Button></DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Edit profile' }));
    await expect(screen.getByRole('dialog', { name: 'Edit profile' })).toBeVisible();
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    await expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  },
};

export const Open: Story = {
  render: ({ scrim, overlayClassName }) => (
    <Dialog defaultOpen>
      <DialogContent scrim={scrim} overlayClassName={overlayClassName}>
        <DialogHeader>
          <DialogTitle>Project details</DialogTitle>
          <DialogDescription>Review the project before returning to your workspace.</DialogDescription>
        </DialogHeader>
        <p>Design system refresh</p>
        <DialogFooter><DialogClose asChild><Button>Done</Button></DialogClose></DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const WithoutScrim: Story = {
  args: { scrim: false },
  render: ({ scrim, overlayClassName }) => (
    <Dialog defaultOpen>
      <DialogContent scrim={scrim} overlayClassName={overlayClassName}>
        <DialogHeader>
          <DialogTitle>Project details</DialogTitle>
          <DialogDescription>Review the project before returning to your workspace.</DialogDescription>
        </DialogHeader>
        <DialogFooter><DialogClose asChild><Button>Done</Button></DialogClose></DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  play: async () => {
    await expect(screen.getByRole('dialog', { name: 'Project details' })).toBeVisible();
    await userEvent.click(screen.getByRole('button', { name: 'Done' }));
    await expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  },
};

export const Tokens: Story = {
  args: { mode: 'light' },
  parameters: { controls: { include: ['mode'], exclude: [] }, docs: { description: { story: 'The mode control changes the token reference, not the Dialog component.' } } },
  render: ({ mode }) => <TokenReference owner="dialog" mode={mode} />,
};
