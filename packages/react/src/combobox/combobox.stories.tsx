import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn, userEvent } from 'storybook/test';
import { Combobox } from './combobox';
import type { ComboboxProps } from './combobox';

const options = [
  { value: 'ca', label: 'Canada' },
  { value: 'cl', label: 'Chile' },
  { value: 'cn', label: 'China', disabled: true },
  { value: 'jp', label: 'Japan' },
];

type MultipleComboboxProps = Extract<ComboboxProps, { multiple: true }>;

function MultipleSelectionExample({ onValueChange }: Pick<MultipleComboboxProps, 'onValueChange'>) {
  const [value, setValue] = useState(['ca']);
  const [inputValue, setInputValue] = useState('');
  return (
    <form aria-label="Selected countries">
      <Combobox
        aria-label="Countries"
        name="country"
        multiple
        options={options}
        value={value}
        inputValue={inputValue}
        onInputValueChange={setInputValue}
        onValueChange={nextValue => {
          setValue(nextValue);
          onValueChange?.(nextValue);
        }}
        placeholder="Search countries"
      />
    </form>
  );
}

const meta = {
  title: 'Components/Combobox',
  component: Combobox,
  tags: ['autodocs'],
  args: {
    'aria-label': 'Country',
    options,
    placeholder: 'Search countries',
    emptyMessage: 'No countries found.',
    size: 'md',
    loading: false,
    invalid: false,
    disabled: false,
    onValueChange: fn(),
  },
  argTypes: {
    options: { control: false },
    onValueChange: { control: false },
    onInputValueChange: { control: false },
    onChange: { control: false },
    emptyMessage: { control: 'text' },
  },
} satisfies Meta<typeof Combobox>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, args }) => {
    const input = canvas.getByRole('combobox', { name: 'Country' });
    await userEvent.type(input, 'can');
    const option = canvas.getByRole('option', { name: 'Canada' });
    await expect(canvas.getAllByRole('option')).toHaveLength(1);
    await userEvent.click(option);
    await expect(input).toHaveValue('Canada');
    await expect(args.onValueChange).toHaveBeenCalledWith('ca');
  },
};

export const KeyboardSelection: Story = {
  play: async ({ canvas }) => {
    const input = canvas.getByRole('combobox', { name: 'Country' });
    await userEvent.click(input);
    await userEvent.keyboard('{ArrowDown}');
    await expect(input).toHaveAttribute('aria-activedescendant', expect.stringContaining('-option-0'));
    await userEvent.keyboard('{Enter}');
    await expect(input).toHaveValue('Canada');
    await expect(input).toHaveAttribute('aria-expanded', 'false');
  },
};

export const Loading: Story = {
  args: { loading: true },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('combobox', { name: 'Country' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('Loading options');
    await expect(canvas.getByRole('listbox', { name: 'Country options' })).toHaveAttribute('aria-busy', 'true');
  },
};

export const NoResults: Story = {
  args: { defaultInputValue: 'nowhere' },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('combobox', { name: 'Country' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('No countries found.');
    await expect(canvas.getAllByRole('option')).toHaveLength(0);
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('combobox', { name: 'Country' })).toBeDisabled();
  },
};

export const MultipleSelection: Story = {
  render: args => <MultipleSelectionExample onValueChange={args.onValueChange} />,
  parameters: {
    docs: {
      description: {
        story: 'Select multiple options without losing the search query workflow. Selected values appear as removable chips, remain selected in the list, and submit as repeated values under the form field name. Backspace removes the last chip when the query is empty.',
      },
    },
  },
  play: async ({ canvas, args }) => {
    const input = canvas.getByRole('combobox', { name: 'Countries' });
    await expect(canvas.getByRole('button', { name: 'Remove Canada' })).toBeVisible();
    await userEvent.click(input);
    await expect(input).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(canvas.getByRole('option', { name: 'Chile' }));
    await expect(canvas.getByRole('button', { name: 'Remove Chile' })).toBeVisible();
    await expect(canvas.getByRole('option', { name: 'Chile' })).toHaveAttribute('aria-selected', 'true');
    await expect(input).toHaveValue('');
    await expect(input).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByRole('form', { name: 'Selected countries' })).toHaveFormValues({
      country: ['ca', 'cl'],
    });
    await expect(args.onValueChange).toHaveBeenCalledWith(['ca', 'cl']);
    await userEvent.keyboard('{Backspace}');
    await expect(canvas.queryByRole('button', { name: 'Remove Chile' })).not.toBeInTheDocument();
  },
};
