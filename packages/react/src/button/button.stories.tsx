import { TokenReference } from '../tokens/token-reference';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentProps } from 'react';
import { Button, buttonColors } from './button';
import { IconButton } from '../icon-button/icon-button';
import { SplitButton } from '../split-button/split-button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['solid', 'soft', 'outline', 'ghost'],
      description: 'Visual treatment of the button.',
      table: { type: { summary: "'solid' | 'soft' | 'outline' | 'ghost'" }, defaultValue: { summary: 'solid' } },
    },
    color: {
      control: 'select',
      options: buttonColors,
      description: 'Semantic color intent.',
      table: { type: { summary: "'accent' | 'neutral' | 'error' | 'success' | 'warning' | 'info'" }, defaultValue: { summary: 'accent' } },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Button size.',
      table: { type: { summary: "'sm' | 'md' | 'lg'" }, defaultValue: { summary: 'md' } },
    },
    as: {
      control: false,
      description: 'Render as the specified element or component; its props depend on the selected element.',
      table: { type: { summary: 'ElementType' }, defaultValue: { summary: 'button' } },
    },
    asChild: {
      control: false,
      description: 'Merge button behavior and props onto one child using the Radix Slot pattern.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    loading: {
      control: 'boolean',
      description: 'Show a loading indicator and disable interaction.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Disable interaction.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    iconStartIcon: {
      control: 'text',
      description: 'Material Symbols ligature name for a leading icon.',
      table: { type: { summary: 'string' } },
    },
    iconEndIcon: {
      control: 'text',
      description: 'Material Symbols ligature name for a trailing icon.',
      table: { type: { summary: 'string' } },
    },
    children: {
      control: 'text',
      description: 'Button content.',
      table: { type: { summary: 'ReactNode' } },
    },
    className: {
      control: 'text',
      description: 'Additional CSS class names.',
      table: { type: { summary: 'string' } },
    },
    type: {
      control: 'select',
      options: ['button', 'submit', 'reset'],
      description: 'Native button type. Defaults to submit when used in a form.',
      table: { type: { summary: "'button' | 'submit' | 'reset'" }, defaultValue: { summary: 'submit' } },
    },
  },
  args: {
    children: 'Button',
  },
  parameters: {
    docs: {
      description: {
        component: 'Button accepts native button props and supports polymorphic rendering with `as` or `asChild`. When using `as`, the available props depend on the rendered element; see the polymorphic and asChild stories.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Solid: Story = { args: { variant: 'solid' } };
export const Soft: Story = { args: { variant: 'soft' } };
export const Outline: Story = { args: { variant: 'outline' } };
export const Ghost: Story = { args: { variant: 'ghost' } };

export const ColorVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
      {buttonColors.map((color) => (
        <div key={color} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ width: 72, textTransform: 'capitalize' }}>{color}</span>
          <Button color={color} variant="solid">{color}</Button>
          <Button color={color} variant="soft">{color}</Button>
          <Button color={color} variant="outline">{color}</Button>
          <Button color={color} variant="ghost">{color}</Button>
        </div>
      ))}
    </div>
  ),
};

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

export const Loading: Story = {
  args: { loading: true },
};

export const WithIcons: Story = {
  render: (args: ComponentProps<typeof Button>) => (
    <div style={{ display: 'flex', gap: 12 }}>
      <Button {...args} iconStartIcon="arrow_forward">Continue</Button>
      <Button {...args} iconEndIcon="arrow_forward">Continue</Button>
      <Button {...args} iconStartIcon="arrow_forward" iconEndIcon="arrow_forward">Continue</Button>
    </div>
  ),
};

export const SharedIconSizing: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Button size={size} iconStartIcon="add">Add item</Button>
          <IconButton size={size} icon="add" label="Add item" />
          <SplitButton
            size={size}
            actions={[{ value: 'save-copy', label: 'Save a copy' }]}
            onClick={() => {}}
          >
            Save
          </SplitButton>
          <Button size={size} loading>Saving</Button>
        </div>
      ))}
    </div>
  ),
};

export const Tokens: Story = { render: () => <TokenReference owner="button" /> };
