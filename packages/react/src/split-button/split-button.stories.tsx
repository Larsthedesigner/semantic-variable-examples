import type { Meta, StoryObj } from '@storybook/react-vite';
import { SplitButton } from './split-button';

const actions = [
  { value: 'duplicate', label: 'Duplicate' },
  { value: 'archive', label: 'Archive' },
  { value: 'delete', label: 'Delete', disabled: true },
];

const meta: Meta<typeof SplitButton> = {
  title: 'Components/SplitButton',
  component: SplitButton,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['solid', 'outline', 'ghost'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  args: {
    children: 'Save',
    actions,
    onClick: (action) => console.log('clicked', action),
  },
};

export default meta;
type Story = StoryObj<typeof SplitButton>;

export const Solid: Story = { args: { variant: 'solid' } };
export const Outline: Story = { args: { variant: 'outline' } };
export const Ghost: Story = { args: { variant: 'ghost' } };

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <SplitButton {...args} size="sm" />
      <SplitButton {...args} size="md" />
      <SplitButton {...args} size="lg" />
    </div>
  ),
};

export const Disabled: Story = { args: { disabled: true } };

export const NoActions: Story = {
  name: 'No menu actions (chevron disabled)',
  args: { actions: [] },
};
