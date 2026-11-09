import { TokenReference } from '../tokens/token-reference';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SupportingText } from './supporting-text';

const meta: Meta<typeof SupportingText> = {
  title: 'Components/SupportingText',
  component: SupportingText,
  tags: ['autodocs'],
  args: { children: 'Use your work email.' },
  argTypes: {
    size: {
      control: 'select', options: ['sm', 'md', 'lg'], description: 'Supporting text size.',
      table: { type: { summary: "'sm' | 'md' | 'lg'" }, defaultValue: { summary: 'md' } },
    },
    invalid: {
      control: 'boolean', description: 'Use the error treatment unless disabled is true.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    disabled: {
      control: 'boolean', description: 'Use the disabled treatment, overriding invalid and variant.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    variant: {
      control: 'select', options: ['default', 'error', 'success', 'disabled'],
      description: 'Text and icon treatment when neither disabled nor invalid overrides it.',
      table: { type: { summary: "'default' | 'error' | 'success' | 'disabled'" }, defaultValue: { summary: 'default' } },
    },
    startIcon: {
      control: 'boolean', description: 'Show a decorative leading icon chosen from the resolved treatment.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    endIcon: {
      control: 'boolean', description: 'Show a decorative trailing icon chosen from the resolved treatment.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    children: {
      control: 'text', description: 'Supporting text content.',
      table: { type: { summary: 'ReactNode' } },
    },
    id: {
      control: false, description: 'ID referenced by a control through aria-describedby.',
      table: { type: { summary: 'string' } },
    },
    className: {
      control: false, description: 'Additional CSS class names on the paragraph.',
      table: { type: { summary: 'string' } },
    },
  },
  parameters: {
    docs: { description: { component: 'SupportingText accepts native paragraph props and forwards its ref to the paragraph. Treatment precedence is disabled, then invalid (error), then variant. Connect help or error text to its control with id and aria-describedby; styling alone does not establish that relationship.' } },
  },
};

export default meta;
type Story = StoryObj<typeof SupportingText>;

export const Default: Story = {};
export const Invalid: Story = {
  args: { invalid: true, children: 'Enter a valid email address.' },
};
export const Disabled: Story = { args: { disabled: true } };
export const Success: Story = { args: { variant: 'success', startIcon: true, children: 'Changes saved.' } };
export const WithIcons: Story = {
  argTypes: {
    variant: { control: false },
    startIcon: { control: false },
    endIcon: { control: false },
    children: { control: false },
  },
  render: (args) => (
    <div style={{ display: 'grid', gap: 12, maxWidth: 240 }}>
      <SupportingText {...args} variant="default" startIcon>Only visible to your team.</SupportingText>
      <SupportingText {...args} variant="error" startIcon>Enter a valid email address before continuing.</SupportingText>
      <SupportingText {...args} variant="success" endIcon>Your email is verified.</SupportingText>
    </div>
  ),
  parameters: {
    docs: { description: { story: 'A fixed icon and variant comparison. Variant, icon, and children controls are disabled because each specimen sets them explicitly; size, invalid, and disabled apply to all examples.' } },
  },
};

export const Sizes: Story = {
  argTypes: {
    size: { control: false },
    children: { control: false },
  },
  render: (args) => (
    <div style={{ display: 'grid', gap: 12 }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <SupportingText {...args} key={size} size={size}>{size} supporting text</SupportingText>
      ))}
    </div>
  ),
  parameters: {
    docs: { description: { story: 'A fixed size comparison. Size and children are disabled because each example sets them explicitly; the other SupportingText controls apply to all three examples.' } },
  },
};

export const Tokens: Story = {
  render: () => <TokenReference owner="supporting-text" />,
  parameters: {
    controls: { disable: true },
    docs: { description: { story: 'Reference-only view of SupportingText design tokens. This story renders TokenReference rather than SupportingText, so component controls do not apply.' } },
  },
};
