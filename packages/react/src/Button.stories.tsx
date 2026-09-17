import type { Meta, StoryObj } from '@storybook/react';
import type { ComponentProps } from 'react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['solid', 'outline', 'ghost'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    asChild: { control: 'boolean' },
  },
  args: {
    children: 'Button',
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Solid: Story = { args: { variant: 'solid' } };
export const Outline: Story = { args: { variant: 'outline' } };
export const Ghost: Story = { args: { variant: 'ghost' } };

export const Sizes: Story = {
  render: (args: ComponentProps<typeof Button>) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Button {...args} size="sm">
        Small
      </Button>
      <Button {...args} size="md">
        Medium
      </Button>
      <Button {...args} size="lg">
        Large
      </Button>
    </div>
  ),
};

export const PolymorphicAsLink: Story = {
  name: 'as="a" (polymorphic)',
  render: (args: ComponentProps<typeof Button>) => (
    <Button {...args} as="a" href="https://example.com">
      I render as an anchor
    </Button>
  ),
};

export const AsChild: Story = {
  name: 'asChild (Radix Slot)',
  render: (args: ComponentProps<typeof Button>) => (
    <Button {...args} asChild>
      <a href="https://example.com">Props merge onto this anchor</a>
    </Button>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
};
