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
    icon: { control: 'text' },
    label: { control: 'text' },
    variant: { control: 'select', options: ['solid', 'soft', 'outline', 'ghost'] },
    color: { control: 'select', options: ['accent', 'neutral', 'error', 'success', 'warning', 'info'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};

export default meta;
type Story = StoryObj<typeof IconButton>;

export const Default: Story = {};
export const Outline: Story = { args: { variant: 'outline' } };
export const Disabled: Story = { args: { disabled: true } };
export const Loading: Story = { args: { loading: true } };
