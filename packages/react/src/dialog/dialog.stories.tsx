import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, userEvent } from 'storybook/test';
import { Button } from '../button/button';
import { Input } from '../input/input';
import { TokenReference } from '../tokens/token-reference';
import {
  Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from './dialog';

const meta = {
  title: 'Components/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  parameters: { controls: { disable: true } },
} satisfies Meta<typeof Dialog>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild><Button variant="outline">Edit profile</Button></DialogTrigger>
      <DialogContent>
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
  render: () => (
    <Dialog defaultOpen>
      <DialogContent>
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
  render: () => (
    <Dialog defaultOpen>
      <DialogContent scrim={false}>
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

export const Tokens: Story = { render: () => <TokenReference owner="dialog" /> };
