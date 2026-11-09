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
    variant: {
      control: 'select', options: ['solid', 'soft', 'outline', 'ghost'],
      description: 'Visual treatment shared by the primary button and menu trigger.',
      table: { type: { summary: "'solid' | 'soft' | 'outline' | 'ghost'" }, defaultValue: { summary: 'solid' } },
    },
    size: {
      control: 'select', options: ['sm', 'md', 'lg'],
      description: 'Size shared by both buttons.',
      table: { type: { summary: "'sm' | 'md' | 'lg'" }, defaultValue: { summary: 'md' } },
    },
    children: {
      control: 'text', description: 'Stable primary button content; choosing a menu action does not replace it.',
      table: { type: { summary: 'ReactNode' } },
    },
    actions: {
      control: 'object', description: 'Alternative actions. Each action has a stable value, a visible label, and an optional disabled flag. An empty array disables the menu trigger.',
      table: { type: { summary: 'SplitButtonAction[]', detail: '{ value: string; label: string; disabled?: boolean }[]' } },
    },
    onClick: {
      control: false, description: 'Called for primary and menu actions. The primary action uses primaryValue and String(children) as its label.',
      table: { type: { summary: '(action: SplitButtonAction) => void' } },
    },
    primaryValue: {
      control: 'text', description: 'Action value passed to onClick for the primary button.',
      table: { type: { summary: 'string' }, defaultValue: { summary: '__primary__' } },
    },
    disabled: {
      control: 'boolean', description: 'Disable both buttons.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    wrapperClassName: {
      control: false, description: 'Additional CSS classes for the group wrapper.',
      table: { type: { summary: 'string' } },
    },
    className: {
      control: false, description: 'Native div className; overrides the generated wrapper classes. Prefer wrapperClassName for additive styling.',
      table: { type: { summary: 'string' } },
    },
  },
  args: {
    children: 'Save',
    actions,
    onClick: (action) => console.log('clicked', action),
  },
  parameters: {
    docs: { description: { component: 'SplitButton combines a primary action with a menu of alternatives. Native div props and the forwarded ref apply to the group wrapper, not the inner buttons. Unlike Button, it exposes only variant and size styling props; color, loading, and polymorphic rendering are not part of this API.' } },
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
