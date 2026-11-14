import type { Meta, StoryObj } from '@storybook/react-vite';
import { Separator } from './separator';
import { TokenReference } from '../tokens/token-reference';

const meta: Meta<typeof Separator> = {
  title: 'Components/Separator',
  component: Separator,
  tags: ['autodocs'],
  args: { orientation: 'horizontal', decorative: false },
  argTypes: {
    orientation: {
      control: 'select', options: ['horizontal', 'vertical'], description: 'Line direction.',
      table: { type: { summary: "'horizontal' | 'vertical'" }, defaultValue: { summary: 'horizontal' } },
    },
    decorative: {
      control: 'boolean', description: 'Hide the visual divider from assistive technology.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    className: { control: false, description: 'Additional class names on the separator.', table: { type: { summary: 'string' } } },
  },
  parameters: {
    docs: { description: { component: `Separator accepts native div props and forwards its ref to the rendered div.

| Prop | Type | Default / behavior |
| --- | --- | --- |
| orientation | \`'horizontal' \\| 'vertical'\` | \`'horizontal'\`; vertical separators need a parent with a definite or stretched block size. |
| decorative | \`boolean\` | \`false\`; when true, the separator is removed from the accessibility tree. |

Use the semantic separator when it expresses a meaningful boundary between groups. Mark purely visual dividers decorative so they do not add redundant landmarks. A semantic separator exposes the matching \`aria-orientation\`.` } },
  },
};

export default meta;
type Story = StoryObj<typeof Separator>;

export const Horizontal: Story = {
  argTypes: { orientation: { control: false } },
  render: args => (
    <div style={{ display: 'grid', gap: 12, maxWidth: 360 }}>
      <span>Workspace details</span>
      <Separator {...args} />
      <span>Members and permissions</span>
    </div>
  ),
};

export const Vertical: Story = {
  args: { orientation: 'vertical', decorative: true },
  argTypes: { orientation: { control: false } },
  render: args => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, height: 40 }}>
      <button type="button">Overview</button>
      <Separator {...args} orientation="vertical" />
      <button type="button">Settings</button>
    </div>
  ),
  parameters: {
    docs: { description: { story: 'Decorative vertical divider between related actions; the divider is hidden from assistive technology.' } },
  },
};

export const Tokens: Story = {
  render: () => <TokenReference owner="separator" />,
  parameters: {
    controls: { disable: true },
    docs: { description: { story: 'Reference-only view of Separator design tokens. This story renders TokenReference rather than Separator, so component controls do not apply.' } },
  },
};
