// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { describe, expect, it } from 'vitest';
import { Field, FieldControl, FieldDescription, FieldError, FieldLabel } from '../field/field';
import { Select } from './select';

describe('Select', () => {
  it('forwards native select props and ref and renders grouped options', () => {
    const ref = createRef<HTMLSelectElement>();
    render(
      <Select ref={ref} aria-label="Country" name="country" required defaultValue="ca" className="custom">
        <option value="">Choose a country</option>
        <optgroup label="North America">
          <option value="ca">Canada</option>
          <option value="us">United States</option>
        </optgroup>
      </Select>,
    );
    const select = screen.getByRole('combobox', { name: 'Country' });
    expect(select).toHaveClass('svx-select', 'svx-text-control', 'svx-focus-ring', 'custom');
    expect(select).toHaveAttribute('name', 'country');
    expect(select).toHaveAttribute('data-size', 'md');
    expect(select).toBeRequired();
    expect(select).toHaveValue('ca');
    expect(screen.getByRole('group', { name: 'North America' })).toContainElement(
      screen.getByRole('option', { name: 'Canada' }),
    );
    expect(ref.current).toBe(select);
  });

  it('provides a placeholder and supports native option selection', async () => {
    const user = userEvent.setup();
    render(
      <Select aria-label="Country" placeholder="Choose a country" required>
        <option value="ca">Canada</option>
        <option value="us">United States</option>
      </Select>,
    );
    const select = screen.getByRole('combobox', { name: 'Country' });
    expect(select).toHaveValue('');
    expect(select).toBeInvalid();
    expect(screen.getByText('Choose a country')).toBeDisabled();

    await user.selectOptions(select, 'ca');
    expect(select).toHaveValue('ca');
    expect(select).toBeValid();
  });

  it.each(['sm', 'md', 'lg'] as const)('supports %s visual sizing', (size) => {
    render(<Select aria-label="Country" size={size}><option value="ca">Canada</option></Select>);
    expect(screen.getByRole('combobox')).toHaveAttribute('data-size', size);
  });

  it('supports invalid state and explicit aria-invalid precedence', () => {
    const { rerender } = render(<Select aria-label="Country" invalid><option value="ca">Canada</option></Select>);
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true');
    rerender(<Select aria-label="Country" invalid aria-invalid={false}><option value="ca">Canada</option></Select>);
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'false');
    rerender(<Select aria-label="Country" aria-invalid="spelling"><option value="ca">Canada</option></Select>);
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'spelling');
  });

  it('supports controlled single-value selection', async () => {
    const user = userEvent.setup();
    function Example() {
      const [value, setValue] = useState('ca');
      return (
        <Select aria-label="Country" value={value} onChange={(event) => setValue(event.target.value)}>
          <option value="ca">Canada</option>
          <option value="us">United States</option>
        </Select>
      );
    }

    render(<Example />);
    const select = screen.getByRole('combobox', { name: 'Country' });
    await user.selectOptions(select, 'us');
    expect(select).toHaveValue('us');
  });

  it('integrates with Field labels, state, and descriptions', () => {
    render(
      <Field size="lg" required disabled invalid>
        <FieldLabel>Country</FieldLabel>
        <FieldControl><Select size="sm" required disabled invalid><option value="ca">Canada</option></Select></FieldControl>
        <FieldDescription>Select your country of residence.</FieldDescription>
        <FieldError>Choose a valid country.</FieldError>
      </Field>,
    );
    const select = screen.getByRole('combobox', { name: 'Country' });
    expect(select).toHaveAttribute('data-size', 'lg');
    expect(select).toHaveAttribute('aria-invalid', 'true');
    expect(select).toBeDisabled();
    expect(select).toBeRequired();
    expect(select).toHaveAccessibleDescription('Select your country of residence. Choose a valid country.');
  });
});
