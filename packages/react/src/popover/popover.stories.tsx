import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, userEvent } from 'storybook/test';
import { Button } from '../button/button';
import { Input } from '../input/input';
import { TokenReference } from '../tokens/token-reference';
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from './popover';

const meta = {
  title: 'Components/Popover',
  component: Popover,
  tags: ['autodocs'],
  argTypes: {
    children: { control: false, description: 'Compose a trigger/anchor and content.', table: { type: { summary: 'ReactNode' } } },
  },
  parameters: {
    controls: { disable: true },
    docs: { description: { component: `Popover is a compound Radix-based API; compose its parts rather than controlling the complete interaction through one story args object.

| Part | Props | Defaults and behavior |
| --- | --- | --- |
| Popover | Radix Root props: \`open?\`, \`defaultOpen?\`, \`onOpenChange?\`, \`modal?\` | Uncontrolled and non-modal by default. |
| PopoverTrigger | Radix Trigger props; \`asChild?\` | \`asChild=false\`; merge trigger behavior onto a custom child when true. |
| PopoverAnchor | Radix Anchor props; \`asChild?\` | \`asChild=false\`; positions the popover relative to its anchor. |
| PopoverPortal | Radix Portal props, including \`container?\` | Portals content to the document body unless a container is supplied. |
| PopoverContent | Radix Content props, including \`side\`, \`align\`, focus callbacks, and \`className\` | \`sideOffset=8\`, \`collisionPadding=8\`; rendered in a portal. |
| PopoverClose | Radix Close props; \`asChild?\` | \`asChild=false\`; closes the root when activated. |

Give PopoverContent an accessible name directly or through a visible heading using \`aria-labelledby\`. Keyboard navigation, Escape dismissal, and focus restoration are provided by the Radix primitive.` } },
  },
} satisfies Meta<typeof Popover>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild><Button variant="outline">Filter projects</Button></PopoverTrigger>
      <PopoverContent aria-label="Project filters">
        <div className="svx-popover__content">
          <h2 className="svx-popover__title">Project filters</h2>
          <label>
            Owner
            <Input placeholder="Search people" />
          </label>
          <PopoverClose asChild><Button variant="outline">Done</Button></PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Filter projects' }));
    await expect(screen.getByRole('dialog', { name: 'Project filters' })).toBeVisible();
    await userEvent.click(screen.getByRole('button', { name: 'Done' }));
    await expect(screen.queryByRole('dialog', { name: 'Project filters' })).not.toBeInTheDocument();
  },
};

export const Open: Story = {
  render: () => (
    <Popover defaultOpen>
      <PopoverTrigger asChild><Button variant="outline">More information</Button></PopoverTrigger>
      <PopoverContent aria-label="More information">
        <div className="svx-popover__content">
          <h2 className="svx-popover__title">More information</h2>
          <p>Popover content stays anchored to its trigger and moves to remain inside the viewport.</p>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const Tokens: Story = { render: () => <TokenReference owner="popover" /> };
