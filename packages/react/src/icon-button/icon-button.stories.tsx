import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconButton } from './icon-button';

const meta: Meta<typeof IconButton> = {
  title: 'Components/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  args: {
    icon: 'add',
    label: 'Add item',
  },
  argTypes: {
    icon: {
      control: 'text',
      description: 'Material Symbols ligature name for the decorative icon.',
      table: { type: { summary: 'string' } },
    },
    label: {
      control: 'text',
      description: 'Required accessible name announced by assistive technology.',
      table: { type: { summary: 'string' } },
    },
    variant: {
      control: 'select',
      options: ['solid', 'soft', 'outline', 'ghost'],
      description: 'Visual treatment inherited from Button.',
      table: { type: { summary: "'solid' | 'soft' | 'outline' | 'ghost'" }, defaultValue: { summary: 'solid' } },
    },
    color: {
      control: 'select',
      options: ['accent', 'neutral', 'error', 'success', 'warning', 'info'],
      description: 'Semantic color intent inherited from Button.',
      table: { type: { summary: "'accent' | 'neutral' | 'error' | 'success' | 'warning' | 'info'" }, defaultValue: { summary: 'accent' } },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Button size inherited from Button.',
      table: { type: { summary: "'sm' | 'md' | 'lg'" }, defaultValue: { summary: 'md' } },
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
    type: {
      control: 'select',
      options: ['button', 'submit', 'reset'],
      description: 'Native button type.',
      table: { type: { summary: "'button' | 'submit' | 'reset'" }, defaultValue: { summary: 'button' } },
    },
    className: {
      control: false,
      description: 'Additional CSS class names.',
      table: { type: { summary: 'string' } },
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'IconButton requires both an icon and an accessible label. It also accepts the documented Button styling and state props, plus native button props.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof IconButton>;

export const Default: Story = {};
export const Outline: Story = { args: { variant: 'outline' } };
export const Disabled: Story = { args: { disabled: true } };
export const Loading: Story = { args: { loading: true } };
