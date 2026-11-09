import { TokenReference } from '../tokens/token-reference';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from './input';
import { Field, FieldControl, FieldDescription, FieldLabel } from '../field/field';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  args: { 'aria-label': 'Email', placeholder: 'you@example.com', size: 'md', type: 'email' },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Visual size of the input.',
      table: { type: { summary: "'sm' | 'md' | 'lg'" }, defaultValue: { summary: 'md' } },
    },
    htmlSize: {
      control: 'number',
      description: 'Native character width, separate from the visual size.',
      table: { type: { summary: 'number' } },
    },
    invalid: {
      control: 'boolean',
      description: 'Mark the input invalid and set aria-invalid unless explicitly overridden.',
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
    type: {
      control: 'text',
      description: 'Native input type, such as text, email, or password.',
      table: { type: { summary: 'string' }, defaultValue: { summary: 'text' } },
    },
    placeholder: {
      control: 'text',
      description: 'Hint displayed when the input has no value.',
      table: { type: { summary: 'string' } },
    },
    value: {
      control: false,
      description: 'Controlled input value. Use defaultValue for an uncontrolled input.',
      table: { type: { summary: 'string | number | readonly string[]' } },
    },
    defaultValue: {
      control: false,
      description: 'Initial value for an uncontrolled input.',
      table: { type: { summary: 'string | number | readonly string[]' } },
    },
    name: {
      control: false,
      description: 'Form field name used when submitting the input.',
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
        component: 'Input accepts standard native input props in addition to the visual size, htmlSize, and invalid props listed here. The accessible name in the example is supplied through aria-label.',
      },
    },
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
