import { TokenReference } from '../tokens/token-reference';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { Field, FieldControl, FieldDescription, FieldLabel } from '../field/field';
import { Select } from './select';

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  args: {
    'aria-label': 'Country',
    placeholder: 'Choose a country',
    size: 'md',
    onChange: fn(),
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Visual size of the select control.',
      table: { type: { summary: "'sm' | 'md' | 'lg'" }, defaultValue: { summary: 'md' } },
    },
    placeholder: {
      control: 'text',
      description: 'Disabled empty-value option shown before a choice is made.',
      table: { type: { summary: 'string' } },
    },
    invalid: {
      control: 'boolean',
      description: 'Mark the select invalid and set aria-invalid unless explicitly overridden.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Disable interaction.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    required: {
      control: 'boolean',
      description: 'Require a non-empty selection before form submission.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    value: {
      control: false,
      description: 'Controlled selected option value. Pair with onChange.',
      table: { type: { summary: 'string' } },
    },
    defaultValue: {
      control: false,
      description: 'Initial selected option value for an uncontrolled select.',
      table: { type: { summary: 'string' } },
    },
    children: {
      control: false,
      description: 'Native option and optgroup elements.',
      table: { type: { summary: 'ReactNode' } },
    },
    name: {
      control: false,
      description: 'Form field name used when submitting the select.',
      table: { type: { summary: 'string' } },
    },
    onChange: {
      control: false,
      description: 'Native select change handler.',
      table: { type: { summary: 'ChangeEventHandler<HTMLSelectElement>' } },
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
        component: 'Select wraps a native single-value select. Add options and optgroups as children; the browser provides native keyboard, form, and platform selection behavior. When placeholder is provided without a value or defaultValue, the empty placeholder option is selected initially. Visual sizing reuses the Input component tokens.',
      },
    },
  },
  render: (args) => (
    <Select {...args} style={{ maxWidth: 320 }}>
      <option value="ca">Canada</option>
      <optgroup label="Europe">
        <option value="de">Germany</option>
        <option value="fr">France</option>
      </optgroup>
    </Select>
  ),
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
  play: async ({ canvas, args }) => {
    const select = canvas.getByRole('combobox', { name: 'Country' });
    await userEvent.selectOptions(select, 'de');
    await expect(select).toHaveValue('de');
    await expect(args.onChange).toHaveBeenCalled();
  },
};

export const Required: Story = { args: { required: true } };
export const Invalid: Story = { args: { invalid: true } };
export const Disabled: Story = { args: { disabled: true } };

export const FieldIntegration: Story = {
  args: {
    size: "lg"
  },

  render: () => (
    <Field required style={{ maxWidth: 320 }}>
      <FieldLabel>Country</FieldLabel>
      <FieldControl>
        <Select placeholder="Choose a country">
          <option value="ca">Canada</option>
          <optgroup label="Europe">
            <option value="de">Germany</option>
            <option value="fr">France</option>
          </optgroup>
        </Select>
      </FieldControl>
      <FieldDescription>Select your country of residence.</FieldDescription>
    </Field>
  )
};

export const Tokens: Story = { render: () => <TokenReference owner="input" /> };
