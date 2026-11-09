import { TokenReference } from '../tokens/token-reference';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Textarea } from './textarea';
import { Field, FieldControl, FieldDescription, FieldLabel } from '../field/field';

const meta: Meta<typeof Textarea> = {
  title: 'Components/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  args: { 'aria-label': 'Message', placeholder: 'Write a message...', size: 'md', rows: 3 },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Visual size of the textarea.',
      table: { type: { summary: "'sm' | 'md' | 'lg'" }, defaultValue: { summary: 'md' } },
    },
    invalid: {
      control: 'boolean',
      description: 'Mark the textarea invalid and set aria-invalid unless explicitly overridden.',
      table: { type: { summary: 'boolean' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Disable interaction.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    readOnly: {
      control: 'boolean',
      description: 'Prevent editing while allowing the value to be focused and copied.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    rows: {
      control: 'number',
      description: 'Visible text rows.',
      table: { type: { summary: 'number' }, defaultValue: { summary: '3' } },
    },
    placeholder: {
      control: 'text',
      description: 'Hint displayed when the textarea has no value.',
      table: { type: { summary: 'string' } },
    },
    value: {
      control: false,
      description: 'Controlled textarea value. Use defaultValue for an uncontrolled textarea.',
      table: { type: { summary: 'string | number | readonly string[]' } },
    },
    defaultValue: {
      control: false,
      description: 'Initial value for an uncontrolled textarea.',
      table: { type: { summary: 'string | number | readonly string[]' } },
    },
    name: {
      control: false,
      description: 'Form field name used when submitting the textarea.',
      table: { type: { summary: 'string' } },
    },
    required: {
      control: 'boolean',
      description: 'Require a value before the form can be submitted.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
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
        component: 'Textarea accepts standard native textarea props in addition to the visual size and invalid props listed here. The accessible name in the example is supplied through aria-label.',
      },
    },
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
