import { TokenReference } from '../tokens/token-reference';
import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './textarea';
import { Field, FieldControl, FieldDescription, FieldLabel } from '../field/field';

const meta: Meta<typeof Textarea> = {
  title: 'Components/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  args: { 'aria-label': 'Message', placeholder: 'Write a message...', size: 'md', rows: 3 },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    invalid: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {};
export const Invalid: Story = { args: { invalid: true } };
export const Disabled: Story = { args: { disabled: true } };
export const ReadOnly: Story = { args: { readOnly: true, defaultValue: 'This message can be selected and copied.' } };
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16, maxWidth: 320 }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Field key={size} size={size}>
          <FieldLabel>{size} textarea</FieldLabel>
          <FieldControl><Textarea placeholder="Write a message..." /></FieldControl>
          <FieldDescription>Resize vertically or set native rows.</FieldDescription>
        </Field>
      ))}
    </div>
  ),
};

export const Tokens: Story = { render: () => <TokenReference owner="input" /> };
