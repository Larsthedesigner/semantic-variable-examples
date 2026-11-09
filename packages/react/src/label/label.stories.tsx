import { TokenReference } from '../tokens/token-reference';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Label } from './label';
import { SupportingText } from '../supporting-text/supporting-text';

const meta: Meta<typeof Label> = {
  title: 'Components/Label',
  component: Label,
  tags: ['autodocs'],
  args: { children: 'Email' },
  argTypes: {
    size: {
      control: 'select', options: ['sm', 'md', 'lg'], description: 'Label text size.',
      table: { type: { summary: "'sm' | 'md' | 'lg'" }, defaultValue: { summary: 'md' } },
    },
    required: {
      control: 'boolean', description: 'Show a visual required marker and suppress the optional indicator. Also set required on the associated control.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    optional: {
      control: 'boolean', description: 'Show an optional indicator when required is false.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    textCase: {
      control: 'select', options: ['sentence', 'uppercase'], description: 'Text casing treatment.',
      table: { type: { summary: "'sentence' | 'uppercase'" }, defaultValue: { summary: 'sentence' } },
    },
    invalid: {
      control: 'boolean', description: 'Apply invalid styling; does not set validity on the associated control.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    disabled: {
      control: 'boolean', description: 'Apply disabled styling; does not disable the associated control.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    htmlFor: {
      control: false, description: 'ID of the associated control. Alternatively, nest the control inside the label.',
      table: { type: { summary: 'string' } },
    },
    children: {
      control: 'text', description: 'Visible label content.',
      table: { type: { summary: 'ReactNode' } },
    },
    className: {
      control: false, description: 'Additional CSS class names on the label.',
      table: { type: { summary: 'string' } },
    },
  },
  parameters: {
    docs: { description: { component: 'Label accepts native label props and forwards its ref to the label element. Required, invalid, and disabled are visual indicators; configure the associated control separately. With Control demonstrates this association.' } },
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
  argTypes: {
    size: { control: false },
    children: { control: false },
  },
  render: (args) => (
    <div style={{ display: 'grid', gap: 12 }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Label {...args} key={size} size={size}>{size} label</Label>
      ))}
    </div>
  ),
  parameters: {
    docs: { description: { story: 'A fixed size comparison. Size and children are disabled because each example sets them explicitly; the other Label controls apply to all three examples.' } },
  },
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

export const Tokens: Story = {
  render: () => <TokenReference owner="label" />,
  parameters: {
    controls: { disable: true },
    docs: { description: { story: 'Reference-only view of Label design tokens. This story renders TokenReference rather than a Label, so component controls do not apply.' } },
  },
};
