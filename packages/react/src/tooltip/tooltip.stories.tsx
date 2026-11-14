import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, userEvent } from 'storybook/test';
import { Button } from '../button/button';
import { TokenReference } from '../tokens/token-reference';
import { Tooltip, TooltipArrow, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

const meta: Meta<typeof TooltipContent> = {
  title: 'Components/Tooltip',
  component: TooltipContent,
  tags: ['autodocs'],
  args: { side: 'top', sideOffset: 4, collisionPadding: 8, children: 'Saves your updates' },
  argTypes: {
    side: {
      control: 'select', options: ['top', 'right', 'bottom', 'left'],
      description: 'Preferred placement relative to the trigger; collision handling may adjust it.',
      table: { type: { summary: "'top' | 'right' | 'bottom' | 'left'" }, defaultValue: { summary: 'top' } },
    },
    sideOffset: {
      control: 'number', description: 'Distance in pixels from the trigger.',
      table: { type: { summary: 'number' }, defaultValue: { summary: '4' } },
    },
    collisionPadding: {
      control: 'number', description: 'Minimum distance in pixels from the viewport edge.',
      table: { type: { summary: 'number' }, defaultValue: { summary: '8' } },
    },
    children: { control: 'text', description: 'Concise supplementary description.', table: { type: { summary: 'ReactNode' } } },
    className: { control: false, description: 'Additional class names on the tooltip content.', table: { type: { summary: 'string' } } },
  },
  parameters: {
    docs: { description: { component: `Compose TooltipProvider, Tooltip, TooltipTrigger, and TooltipContent. A TooltipContent must describe its trigger; do not put interactive controls inside it. Radix provides hover/focus opening, accessible description wiring, collision-aware positioning, and Escape dismissal.

| Part | Props | Defaults and behavior |
| --- | --- | --- |
| TooltipProvider | Radix Provider props: \`delayDuration?\`, \`skipDelayDuration?\`, \`disableHoverableContent?\` | Shared provider; Radix defaults apply when omitted. |
| Tooltip | Radix Root props: \`open?\`, \`defaultOpen?\`, \`onOpenChange?\`, \`delayDuration?\` | One tooltip per trigger; supports controlled or uncontrolled open state. |
| TooltipTrigger | Radix Trigger props; \`asChild?\` | \`asChild=false\`; use true to compose with a button or other focusable trigger. |
| TooltipPortal | Radix Portal props, including \`container?\` | Portals content to the document body by default. |
| TooltipContent | Radix Content props, including \`side\`, \`align\`, \`className\`, focus and pointer callbacks | \`sideOffset=4\`, \`collisionPadding=8\`; wrapped in TooltipPortal. |
| TooltipArrow | Radix Arrow props | Optional decorative arrow; it is hidden from assistive technology. |

Use Tooltip for brief supplementary guidance, not information essential to completing a task. The trigger must remain operable without the tooltip.` } },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: args => (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild><Button variant="outline">Save changes</Button></TooltipTrigger>
        <TooltipContent {...args}>
          {args.children}
          <TooltipArrow className="svx-tooltip-arrow" />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: 'Save changes' });
    await userEvent.hover(trigger);
    const tooltip = await screen.findByRole('tooltip');
    await expect(tooltip).toHaveTextContent('Saves your updates');
    await expect(trigger).toHaveAttribute('aria-describedby', tooltip.id);
    await userEvent.keyboard('{Escape}');
    await expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  },
};

export const KeyboardFocus: Story = {
  render: args => (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild><Button variant="outline">Keyboard help</Button></TooltipTrigger>
        <TooltipContent {...args} />
      </Tooltip>
    </TooltipProvider>
  ),
  play: async ({ canvas }) => {
    await userEvent.tab();
    const trigger = canvas.getByRole('button', { name: 'Keyboard help' });
    await expect(trigger).toHaveFocus();
    await expect(await screen.findByRole('tooltip')).toBeVisible();
  },
};

export const Tokens: Story = {
  render: () => <TokenReference owner="tooltip" />,
  parameters: {
    controls: { disable: true },
    docs: { description: { story: 'Reference-only view of Tooltip design tokens. This story renders TokenReference rather than TooltipContent, so component controls do not apply.' } },
  },
};
