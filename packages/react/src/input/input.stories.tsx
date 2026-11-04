import { TokenReference } from '../tokens/token-reference';
import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './input';
import { Field, FieldControl, FieldDescription, FieldLabel } from '../field/field';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  args: { 'aria-label': 'Email', placeholder: 'you@example.com', size: 'md', type: 'email' },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    invalid: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {};
export const Invalid: Story = { args: { invalid: true } };
export const Disabled: Story = { args: { disabled: true } };
export const ReadOnly: Story = { args: { readOnly: true, defaultValue: 'alex@example.com' } };
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16, maxWidth: 320 }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Field key={size} size={size}>
          <FieldLabel>{size} input</FieldLabel>
          <FieldControl><Input placeholder="Enter text" /></FieldControl>
          <FieldDescription>Size is supplied by Field.</FieldDescription>
        </Field>
      ))}
    </div>
  ),
};

export const Tokens: Story = { render: () => <TokenReference owner="input" /> };
