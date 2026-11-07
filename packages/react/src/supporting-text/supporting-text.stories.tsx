import { TokenReference } from '../tokens/token-reference';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SupportingText } from './supporting-text';

const meta: Meta<typeof SupportingText> = {
  title: 'Components/SupportingText',
  component: SupportingText,
  tags: ['autodocs'],
  args: { children: 'Use your work email.' },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    invalid: { control: 'boolean' },
    disabled: { control: 'boolean' },
    variant: { control: 'select', options: ['default', 'error', 'success', 'disabled'] },
    startIcon: { control: 'boolean' },
    endIcon: { control: 'boolean' },
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
  render: () => (
    <div style={{ display: 'grid', gap: 12, maxWidth: 240 }}>
      <SupportingText startIcon>Only visible to your team.</SupportingText>
      <SupportingText variant="error" startIcon>Enter a valid email address before continuing.</SupportingText>
      <SupportingText variant="success" endIcon>Your email is verified.</SupportingText>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12 }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <SupportingText key={size} size={size}>{size} supporting text</SupportingText>
      ))}
    </div>
  ),
};

export const Tokens: Story = { render: () => <TokenReference owner="supporting-text" /> };
