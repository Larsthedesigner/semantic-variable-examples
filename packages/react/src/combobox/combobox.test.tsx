// @vitest-environment jsdom
import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Combobox } from './combobox';

const options = [
  { value: 'ca', label: 'Canada' },
  { value: 'cl', label: 'Chile' },
  { value: 'cn', label: 'China', disabled: true },
  { value: 'jp', label: 'Japan' },
];

describe('Combobox', () => {
  it('filters options by editable text and commits the selected value to a form', () => {
    const onValueChange = vi.fn();
    render(
      <form aria-label="Country form">
        <Combobox name="country" aria-label="Country" options={options} onValueChange={onValueChange} />
      </form>,
    );

    const input = screen.getByRole('combobox', { name: 'Country' });
    fireEvent.change(input, { target: { value: 'can' } });

    const listbox = screen.getByRole('listbox', { name: 'Country options' });
    expect(within(listbox).getAllByRole('option')).toHaveLength(1);
    expect(within(listbox).getByRole('option', { name: 'Canada' })).toBeInTheDocument();

    fireEvent.click(within(listbox).getByRole('option', { name: 'Canada' }));
    expect(input).toHaveValue('Canada');
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByRole('form', { name: 'Country form' })).toHaveFormValues({ country: 'ca' });
    expect(onValueChange).toHaveBeenLastCalledWith('ca');
  });

  it('supports arrow navigation, skips disabled options and selects with Enter', () => {
    render(<Combobox aria-label="Country" options={options} />);
    const input = screen.getByRole('combobox', { name: 'Country' });

    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(input).toHaveAttribute('aria-expanded', 'true');
    expect(input).toHaveAttribute('aria-activedescendant', expect.stringContaining('-option-0'));

    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(input).toHaveAttribute('aria-activedescendant', expect.stringContaining('-option-1'));
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(input).toHaveAttribute('aria-activedescendant', expect.stringContaining('-option-3'));
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(input).toHaveValue('Japan');
    expect(input).toHaveAttribute('aria-expanded', 'false');
    expect(input).not.toHaveAttribute('aria-activedescendant');
  });

  it('supports Home and End navigation across enabled options', () => {
    render(<Combobox aria-label="Country" options={options} />);
    const input = screen.getByRole('combobox', { name: 'Country' });

    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'End' });
    expect(input).toHaveAttribute('aria-activedescendant', expect.stringContaining('-option-3'));
    fireEvent.keyDown(input, { key: 'Home' });
    expect(input).toHaveAttribute('aria-activedescendant', expect.stringContaining('-option-0'));
  });

  it('dismisses on Escape or Tab without selecting or discarding query text', () => {
    render(<Combobox aria-label="Country" options={options} />);
    const input = screen.getByRole('combobox', { name: 'Country' });
    fireEvent.change(input, { target: { value: 'can' } });
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(input).toHaveValue('can');
    expect(input).toHaveAttribute('aria-expanded', 'false');

    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Tab' });
    expect(input).toHaveValue('can');
    expect(input).toHaveAttribute('aria-expanded', 'false');
  });

  it('clears a previously selected form value when the user edits its label', () => {
    const onValueChange = vi.fn();
    render(
      <form aria-label="Country form">
        <Combobox aria-label="Country" name="country" options={options} defaultValue="ca" onValueChange={onValueChange} />
      </form>,
    );
    const input = screen.getByRole('combobox', { name: 'Country' });
    expect(input).toHaveValue('Canada');

    fireEvent.change(input, { target: { value: 'Canad' } });
    expect(screen.getByRole('form', { name: 'Country form' })).toHaveFormValues({ country: '' });
    expect(onValueChange).toHaveBeenLastCalledWith('');
  });

  it('keeps controlled value and input state in the caller while reporting changes', () => {
    const onInputValueChange = vi.fn();
    const onValueChange = vi.fn();
    render(
      <Combobox
        aria-label="Country"
        options={options}
        value="ca"
        inputValue="Canada"
        onInputValueChange={onInputValueChange}
        onValueChange={onValueChange}
      />,
    );

    const input = screen.getByRole('combobox', { name: 'Country' });
    fireEvent.change(input, { target: { value: 'Can' } });
    expect(input).toHaveValue('Canada');
    expect(onInputValueChange).toHaveBeenCalledWith('Can');
    expect(onValueChange).toHaveBeenCalledWith('');
  });

  it('initializes the displayed label from a controlled single value', () => {
    render(<Combobox aria-label="Country" options={options} value="ca" onValueChange={() => {}} />);
    expect(screen.getByRole('combobox', { name: 'Country' })).toHaveValue('Canada');
  });

  it('announces loading and empty results, and marks the listbox busy', () => {
    const { rerender } = render(<Combobox aria-label="Country" options={options} loading />);
    const input = screen.getByRole('combobox', { name: 'Country' });
    fireEvent.focus(input);
    expect(screen.getByRole('status')).toHaveTextContent('Loading options');
    expect(screen.getByRole('listbox', { name: 'Country options' })).toHaveAttribute('aria-busy', 'true');

    rerender(<Combobox aria-label="Country" options={[]} defaultInputValue="nowhere" emptyMessage="No countries match." />);
    fireEvent.focus(screen.getByRole('combobox', { name: 'Country' }));
    expect(screen.getByRole('status')).toHaveTextContent('No countries match.');
  });

  it('exposes disabled and invalid input state', () => {
    render(<Combobox aria-label="Country" options={options} disabled invalid />);
    const input = screen.getByRole('combobox', { name: 'Country' });
    expect(input).toBeDisabled();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByRole('listbox', { hidden: true })).not.toBeVisible();
  });

  it('closes the popup and clears active state when disabled while open', () => {
    const { rerender } = render(<Combobox aria-label="Country" options={options} />);
    const input = screen.getByRole('combobox', { name: 'Country' });
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(input).toHaveAttribute('aria-expanded', 'true');
    expect(input).toHaveAttribute('aria-activedescendant');

    rerender(<Combobox aria-label="Country" options={options} disabled />);
    expect(input).toHaveAttribute('aria-expanded', 'false');
    expect(input).not.toHaveAttribute('aria-activedescendant');
    expect(screen.getByRole('listbox', { hidden: true })).not.toBeVisible();
  });

  it('validates required selection rather than accepting arbitrary query text', () => {
    render(
      <form aria-label="Country form">
        <Combobox aria-label="Country" options={options} name="country" required />
      </form>,
    );
    const input = screen.getByRole('combobox', { name: 'Country' });
    fireEvent.change(input, { target: { value: 'Canada' } });
    expect(input).toBeInvalid();

    fireEvent.click(screen.getByRole('option', { name: 'Canada' }));
    expect(input).toBeValid();
    expect(screen.getByRole('form', { name: 'Country form' })).toHaveFormValues({ country: 'ca' });
  });

  it('supports multiple controlled selections, toggles options, and submits repeated form values', () => {
    const onValueChange = vi.fn();
    render(
      <form aria-label="Country form">
        <Combobox
          aria-label="Countries"
          name="country"
          multiple
          options={options}
          value={['ca']}
          inputValue=""
          onInputValueChange={() => {}}
          onValueChange={onValueChange}
        />
      </form>,
    );

    const input = screen.getByRole('combobox', { name: 'Countries' });
    fireEvent.focus(input);
    const listbox = screen.getByRole('listbox', { name: 'Countries options' });
    expect(listbox).toHaveAttribute('aria-multiselectable', 'true');
    expect(screen.getByRole('option', { name: 'Canada' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('button', { name: 'Remove Canada' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('option', { name: 'Chile' }));
    expect(input).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('option', { name: 'Chile' })).toHaveAttribute('aria-selected', 'false');
    expect(onValueChange).toHaveBeenLastCalledWith(['ca', 'cl']);
    expect(screen.getByRole('form', { name: 'Country form' })).toHaveFormValues({ country: 'ca' });
  });

  it('updates uncontrolled multiple selection, clears the query, and allows chip and Backspace removal', () => {
    render(
      <form aria-label="Country form">
        <Combobox
          aria-label="Countries"
          name="country"
          multiple
          options={options}
          defaultValue={['ca']}
        />
      </form>,
    );
    const input = screen.getByRole('combobox', { name: 'Countries' });
    fireEvent.change(input, { target: { value: 'chi' } });
    fireEvent.click(screen.getByRole('option', { name: 'Chile' }));

    expect(input).toHaveValue('');
    expect(input).toHaveFocus();
    expect(screen.getByRole('option', { name: 'Chile' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('form', { name: 'Country form' })).toHaveFormValues({ country: ['ca', 'cl'] });

    fireEvent.keyDown(input, { key: 'Backspace' });
    expect(screen.queryByRole('button', { name: 'Remove Chile' })).not.toBeInTheDocument();
    expect(screen.getByRole('form', { name: 'Country form' })).toHaveFormValues({ country: 'ca' });
    fireEvent.click(screen.getByRole('button', { name: 'Remove Canada' }));
    expect(new FormData(screen.getByRole('form', { name: 'Country form' }) as HTMLFormElement).getAll('country')).toEqual([]);
  });

  it('toggles a multiple option with Enter and keeps the popup open', () => {
    render(<Combobox aria-label="Countries" multiple options={options} />);
    const input = screen.getByRole('combobox', { name: 'Countries' });
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(screen.getByRole('button', { name: 'Remove Chile' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Chile' })).toHaveAttribute('aria-selected', 'true');
    expect(input).toHaveAttribute('aria-expanded', 'true');
  });

  it('requires a selected option in multiple mode and does not clear selection while searching', () => {
    render(
      <form aria-label="Country form">
        <Combobox aria-label="Countries" name="country" multiple required options={options} />
      </form>,
    );
    const input = screen.getByRole('combobox', { name: 'Countries' });
    fireEvent.change(input, { target: { value: 'Can' } });
    expect(input).toBeInvalid();

    fireEvent.click(screen.getByRole('option', { name: 'Canada' }));
    expect(input).toBeValid();
    fireEvent.change(input, { target: { value: 'ch' } });
    expect(screen.getByRole('button', { name: 'Remove Canada' })).toBeInTheDocument();
    expect(input).not.toBeInvalid();
  });
});
