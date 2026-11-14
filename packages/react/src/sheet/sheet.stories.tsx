import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentProps } from 'react';
import { expect, screen, userEvent } from 'storybook/test';
import { Button } from '../button/button';
import {
  Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter,
  SheetHeader, SheetTitle, SheetTrigger,
} from './sheet';
import type { SheetContentProps } from './sheet';

type SheetStoryArgs = ComponentProps<typeof Sheet> &
  Pick<SheetContentProps, 'side' | 'size' | 'scrim' | 'overlayClassName'>;

const meta = {
  title: 'Components/Sheet',
  component: Sheet,
  tags: ['autodocs'],
  args: { side: 'right', size: 'md', scrim: true },
  argTypes: {
  size: {
      control: 'select',
    options: ['sm', 'md', 'lg', 'full'],
    description: 'SheetContent: preset size for the sheet width or height.',
    table: { category: 'SheetContent', type: { summary: "'sm' | 'md' | 'lg' | 'full'" }, defaultValue: { summary: 'md' } },
    },
  side: {
    control: 'select',
    options: ['top', 'right', 'bottom', 'left'],
    description: 'SheetContent: viewport edge where the sheet appears.',
    table: { category: 'SheetContent', type: { summary: "'top' | 'right' | 'bottom' | 'left'" }, defaultValue: { summary: 'right' } },
  },
  scrim: {
    control: 'boolean',
    description: 'SheetContent: show the dialog scrim without changing modal behavior.',
    table: { category: 'SheetContent', type: { summary: 'boolean' }, defaultValue: { summary: 'true' } },
  },
    overlayClassName: {
      control: 'text',
      description: 'SheetContent: additional class applied to the dialog overlay.',
      table: { category: 'SheetContent', type: { summary: 'string' } },
    },
    open: { control: false, description: 'Sheet: controlled open state.', table: { category: 'Sheet', type: { summary: 'boolean' } } },
    defaultOpen: { control: false, description: 'Sheet: initial uncontrolled open state.', table: { category: 'Sheet', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } } },
    onOpenChange: { control: false, description: 'Sheet: called when the open state changes.', table: { category: 'Sheet', type: { summary: '(open: boolean) => void' } } },
    modal: { control: false, description: 'Sheet: enable modal focus and interaction behavior.', table: { category: 'Sheet', type: { summary: 'boolean' }, defaultValue: { summary: 'true' } } },
  },
  parameters: {
    docs: {
      description: {
        component: 'Sheet is a foundational, edge-placed composition of the existing Dialog interaction behavior. Use SheetContent, SheetTitle, and SheetDescription for accessible dialog structure. SheetContent accepts the DialogContent DOM and Radix props plus side, scrim, and overlayClassName. It does not impose responsive behavior; wrap it with an opinionated responsive composition when a product use case calls for one.',
      },
    },
  },
} satisfies Meta<SheetStoryArgs>;
export default meta;
type Story = StoryObj<SheetStoryArgs>;

export const Default: Story = {
  render: ({ side, size, scrim, overlayClassName }) => (
    <Sheet>
      <SheetTrigger asChild><Button variant="outline">Open workspace details</Button></SheetTrigger>
      <SheetContent side={side} size={size} scrim={scrim} overlayClassName={overlayClassName}>
        <SheetHeader>
          <SheetTitle>Workspace details</SheetTitle>
          <SheetDescription>Review the current workspace and its settings.</SheetDescription>
        </SheetHeader>
        <p>Design system refresh</p>
        <SheetFooter>
          <SheetClose asChild><Button variant="outline">Close</Button></SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
  play: async ({ canvas, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Open workspace details' }));
    const sheet = await screen.findByRole('dialog', { name: 'Workspace details' });
    await expect(sheet).toHaveAttribute('data-side', args.side ?? 'right');
    await expect(sheet).toHaveAttribute('data-size', args.size ?? 'md');
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    await expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  },
};

export const Open: Story = {
  args: { defaultOpen: true },
  render: ({ side, size, scrim, overlayClassName }) => (
    <Sheet defaultOpen>
      <SheetContent side={side} size={size} scrim={scrim} overlayClassName={overlayClassName}>
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
          <SheetDescription>Choose a destination.</SheetDescription>
        </SheetHeader>
        <nav aria-label="Workspace">
          <a href="#overview">Overview</a>
        </nav>
      </SheetContent>
    </Sheet>
  ),
};
