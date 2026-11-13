import { TokenReference } from '../tokens/token-reference';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Field, FieldLabel, FieldControl, FieldDescription, FieldError } from './field';
import { Button } from '../button/button';
import { Input } from '../input/input';
import { Textarea as TextareaControl } from '../textarea/textarea';

const meta: Meta<typeof Field> = {
  title: 'Components/Field',
  component: Field,
  tags: ['autodocs'],
  args: { required: false, disabled: false, invalid: false, size: 'md' },
  argTypes: {
    controlId: {
      control: 'text', description: 'ID assigned to the control, not the wrapper; generated when omitted.',
      table: { type: { summary: 'string' } },
    },
    size: {
      control: 'select', options: ['sm', 'md', 'lg'], description: 'Shared size for label and supporting text.',
      table: { type: { summary: "'sm' | 'md' | 'lg'" }, defaultValue: { summary: 'md' } },
    },
    required: {
      control: 'boolean', description: 'Set required on the associated native control and show its label marker.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    disabled: {
      control: 'boolean', description: 'Disable the associated control and apply disabled text treatment.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    invalid: {
      control: 'boolean', description: 'Set aria-invalid and show FieldError content.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
  },
  parameters: {
    docs: { description: { component: `Compose a Field from its exported parts. FieldControl wires the generated or supplied control ID, state, and registered descriptions to its single child.

| Part | Props | Defaults and behavior |
| --- | --- | --- |
| Field | Native div props; \`controlId?\`, \`size?\`, \`required?\`, \`disabled?\`, \`invalid?\` | Size defaults to \`md\`; state flags default to \`false\`. |
| FieldLabel | Native label props except \`htmlFor\`, \`size\`, \`required\`, \`disabled\`, \`invalid\` | Connected to FieldControl; inherits size and state. |
| FieldControl | \`children: ReactElement\` | Required single input, textarea, select, or prop/ref-forwarding control; forwards its ref to that control. |
| FieldDescription | SupportingText paragraph props except size/state/variant | Optional \`id\`, \`startIcon\`, and \`endIcon\`; registered as an accessible description. |
| FieldError | Same props as FieldDescription | Renders only while Field is invalid; defaults \`startIcon\` to \`true\`. |

FieldError does not choose validation timing or submit behavior. Manage validation in the form and focus or announce errors as appropriate.` } },
  },
  render: (args) => (
    <Field {...args} style={{ maxWidth: 320 }}>
      <FieldLabel>Email</FieldLabel>
      <FieldControl><Input type="email" placeholder="you@example.com" /></FieldControl>
      <FieldDescription>Use your work email.</FieldDescription>
      <FieldError>Enter a valid email address.</FieldError>
    </Field>
  ),
};

export default meta;
type Story = StoryObj<typeof Field>;

export const Default: Story = {};
export const Required: Story = { args: { required: true } };
export const Invalid: Story = { args: { invalid: true } };
export const Disabled: Story = { args: { disabled: true } };

function ValidationExample() {
  const [value, setValue] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const invalid = submitted && value.trim().length === 0;
  return (
    <form
      noValidate
      style={{ display: 'grid', gap: 16, maxWidth: 320 }}
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
    >
      <Field required invalid={invalid}>
        <FieldLabel>Name</FieldLabel>
        <FieldControl>
          <Input value={value} onChange={(event) => setValue(event.target.value)} />
        </FieldControl>
        <FieldDescription>Enter the name you would like us to use.</FieldDescription>
        <FieldError role="alert">Name is required.</FieldError>
      </Field>
      <Button type="submit">Validate</Button>
    </form>
  );
}

export const Validation: Story = { render: () => <ValidationExample /> };

export const Textarea: Story = {
  render: (args) => (
    <Field {...args} style={{ maxWidth: 320 }}>
      <FieldLabel>Message</FieldLabel>
      <FieldControl><TextareaControl rows={4} /></FieldControl>
      <FieldDescription>Tell us how we can help.</FieldDescription>
      <FieldError>Enter a message.</FieldError>
    </Field>
  ),
};

export const Tokens: Story = { render: () => <TokenReference owner="field" /> };
