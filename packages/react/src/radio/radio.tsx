import { createContext, forwardRef, useContext, useId, useMemo } from 'react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

interface RadioContextValue {
  name: string;
  value?: string;
  defaultValue?: string;
  size: 'sm' | 'md' | 'lg';
  disabled: boolean;
  required: boolean;
  invalid: boolean;
  describedBy?: string;
  onValueChange?: (value: string) => void;
}
const RadioContext = createContext<RadioContextValue | null>(null);

export interface RadioGroupProps extends Omit<ComponentPropsWithoutRef<'fieldset'>, 'onChange'> {
  /** Native legend names the group. Each Radio also needs its own label. */
  legend: ReactNode;
  name?: string;
  value?: string;
  defaultValue?: string;
  size?: 'sm' | 'md' | 'lg';
  required?: boolean;
  invalid?: boolean;
  onChange?: ComponentPropsWithoutRef<'fieldset'>['onChange'];
  onValueChange?: (value: string) => void;
}

export const RadioGroup = forwardRef<HTMLFieldSetElement, RadioGroupProps>(function RadioGroup(
  { legend, name, value, defaultValue, size = 'md', disabled = false, required = false,
    invalid = false, 'aria-invalid': ariaInvalid, 'aria-describedby': describedBy,
    onValueChange, className, children, ...props }, ref,
) {
  const id = useId();
  const context = useMemo(() => ({
    name: name ?? id, value, defaultValue, size, disabled, required,
    invalid: ariaInvalid === undefined ? invalid : ariaInvalid !== false && ariaInvalid !== 'false',
    describedBy, onValueChange,
  }), [name, id, value, defaultValue, size, disabled, required, invalid, ariaInvalid, describedBy, onValueChange]);
  return (
    <RadioContext.Provider value={context}>
      <fieldset {...props} ref={ref} name={name} disabled={disabled} data-size={size}
        aria-invalid={ariaInvalid ?? (invalid || undefined)} aria-describedby={describedBy}
        className={['svx-radio-group', className].filter(Boolean).join(' ')}
      >
        <legend className="svx-radio-group__legend">{legend}</legend>
        <div className="svx-radio-group__options">{children}</div>
      </fieldset>
    </RadioContext.Provider>
  );
});

export interface RadioProps extends Omit<ComponentPropsWithoutRef<'input'>,
  'type' | 'size' | 'children' | 'role' | 'aria-checked' | 'readOnly'> {
  size?: 'sm' | 'md' | 'lg';
  'data-size'?: 'sm' | 'md' | 'lg';
  invalid?: boolean;
  value: string;
  onCheckedChange?: (checked: boolean) => void;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { size = 'md', 'data-size': fieldSize, invalid, 'aria-invalid': ariaInvalid,
    'aria-describedby': describedBy, name, checked, defaultChecked, disabled, required,
    value, onChange, onCheckedChange, className, ...props }, ref,
) {
  const group = useContext(RadioContext);
  const description = [...new Set([...(group?.describedBy?.split(/\s+/) ?? []), ...(describedBy?.split(/\s+/) ?? [])])].filter(Boolean).join(' ') || undefined;
  return (
    <span className="svx-choice-container" data-size={group?.size ?? fieldSize ?? size}>
      <input {...props} ref={ref} type="radio" value={value}
        name={group?.name ?? name}
        checked={group?.value !== undefined ? group.value === value : checked}
        defaultChecked={group?.value !== undefined ? undefined : group?.defaultValue !== undefined ? group.defaultValue === value : defaultChecked}
        disabled={group?.disabled || disabled} required={group?.required || required}
        aria-invalid={ariaInvalid ?? (group?.invalid ?? invalid) ?? undefined}
        aria-describedby={description}
        className={['svx-choice', 'svx-radio', 'svx-focus-ring', className].filter(Boolean).join(' ')}
        onChange={event => {
          onChange?.(event);
          if (!event.defaultPrevented) {
            onCheckedChange?.(event.target.checked);
            if (event.target.checked) group?.onValueChange?.(event.target.value);
          }
        }}
      />
      <span className="svx-choice__indicator" aria-hidden="true" />
    </span>
  );
});
