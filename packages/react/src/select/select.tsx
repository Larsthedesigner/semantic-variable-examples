import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef } from 'react';

export interface SelectProps extends Omit<
  ComponentPropsWithoutRef<'select'>,
  'size' | 'multiple' | 'value' | 'defaultValue'
> {
  /** Visual size of the control. */
  size?: 'sm' | 'md' | 'lg';
  /** Select a single option with an empty value until the user chooses one. */
  placeholder?: string;
  /** Mark the select invalid and set aria-invalid unless explicitly overridden. */
  invalid?: boolean;
  /** Selected option value. Selects are single-value controls. */
  value?: string;
  /** Initial selected option value. */
  defaultValue?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  {
    size = 'md',
    placeholder,
    invalid,
    className,
    value,
    defaultValue,
    children,
    'aria-invalid': ariaInvalid,
    ...props
  },
  ref,
) {
  return (
    <select
      data-size={size}
      {...props}
      ref={ref}
      value={value}
      defaultValue={defaultValue ?? (value === undefined && placeholder !== undefined ? '' : undefined)}
      aria-invalid={ariaInvalid ?? (invalid || undefined)}
      className={['svx-text-control', 'svx-select', 'svx-focus-ring', className].filter(Boolean).join(' ')}
    >
      {placeholder !== undefined && <option value="" disabled hidden>{placeholder}</option>}
      {children}
    </select>
  );
});
