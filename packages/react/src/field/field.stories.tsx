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
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
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
