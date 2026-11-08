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
