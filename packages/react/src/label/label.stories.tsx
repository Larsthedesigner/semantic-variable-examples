import { TokenReference } from '../tokens/token-reference';
import type { Meta, StoryObj } from '@storybook/react';
import { Label } from './label';
import { SupportingText } from '../supporting-text/supporting-text';

const meta: Meta<typeof Label> = {
  title: 'Components/Label',
  component: Label,
  tags: ['autodocs'],
  args: { children: 'Email' },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    required: { control: 'boolean' },
    optional: { control: 'boolean' },
    textCase: { control: 'select', options: ['sentence', 'uppercase'] },
    invalid: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {};
export const Required: Story = { args: { required: true } };
export const Optional: Story = { args: { optional: true } };
export const Uppercase: Story = { args: { textCase: 'uppercase', optional: true } };
export const Invalid: Story = { args: { invalid: true, required: true } };
export const Disabled: Story = { args: { disabled: true, required: true } };

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12 }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Label key={size} size={size} required>{size} label</Label>
      ))}
    </div>
  ),
};

export const WithControl: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 8, maxWidth: 320 }}>
      <Label {...args} htmlFor="example-email" />
      <input
        id="example-email"
        type="email"
        required={args.required}
        disabled={args.disabled}
        aria-invalid={args.invalid || undefined}
        aria-describedby="example-email-description"
      />
      <SupportingText
        id="example-email-description"
        size={args.size}
        invalid={args.invalid}
        disabled={args.disabled}
      >
        {args.invalid ? 'Enter a valid email address.' : 'Use your work email.'}
      </SupportingText>
    </div>
  ),
};

export const Tokens: Story = { render: () => <TokenReference owner="label" /> };
