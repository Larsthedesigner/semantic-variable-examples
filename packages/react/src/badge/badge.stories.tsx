import { TokenReference } from '../tokens/token-reference';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './badge';

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: { children: 'In progress', variant: 'info', size: 'md' },
  argTypes: {
    variant: {
      control: 'select', options: ['neutral', 'info', 'success', 'warning', 'error'],
      description: 'Semantic status/category color treatment.',
      table: { type: { summary: "'neutral' | 'info' | 'success' | 'warning' | 'error'" }, defaultValue: { summary: 'neutral' } },
    },
    size: {
      control: 'select', options: ['sm', 'md', 'lg'], description: 'Badge size.',
      table: { type: { summary: "'sm' | 'md' | 'lg'" }, defaultValue: { summary: 'md' } },
    },
    children: { control: 'text', description: 'Visible badge content.', table: { type: { summary: 'ReactNode' } } },
    className: { control: false, description: 'Additional class names on the badge.', table: { type: { summary: 'string' } } },
  },
  parameters: {
    docs: { description: { component: 'Badge accepts native span props and forwards its ref. Color variants provide visual categorization only; the visible text should communicate the status, and the Badge does not create a live region or status role.' } },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {};
export const Statuses: Story = {
  argTypes: { variant: { control: false }, children: { control: false } },
  render: (args) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {(['neutral', 'info', 'success', 'warning', 'error'] as const).map((variant) => (
        <Badge {...args} key={variant} variant={variant}>{variant}</Badge>
      ))}
    </div>
  ),
  parameters: {
    docs: { description: { story: 'Fixed semantic status comparison; variant and content are disabled because each badge sets them explicitly.' } },
  },
};
export const Sizes: Story = {
  argTypes: { size: { control: false }, children: { control: false } },
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Badge {...args} key={size} size={size}>{size}</Badge>
      ))}
    </div>
  ),
  parameters: {
    docs: { description: { story: 'Fixed size comparison; size and content are disabled because each badge sets them explicitly.' } },
  },
};
export const Tokens: Story = {
  render: () => <TokenReference owner="badge" />,
  parameters: {
    controls: { disable: true },
    docs: { description: { story: 'Reference-only view of Badge design tokens. This story renders TokenReference rather than Badge, so component controls do not apply.' } },
  },
};
