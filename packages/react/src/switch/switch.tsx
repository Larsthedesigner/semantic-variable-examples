import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef } from 'react';

export interface SwitchProps extends Omit<
  ComponentPropsWithoutRef<'input'>,
  'type' | 'size' | 'children' | 'role' | 'aria-checked' | 'readOnly'
> {
  size?: 'sm' | 'md' | 'lg';
  /** Supplied by FieldControl when composed inside a Field. */
  'data-size'?: 'sm' | 'md' | 'lg';
  invalid?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  {
    size = 'md', 'data-size': fieldSize, invalid, 'aria-invalid': ariaInvalid,
    className, onChange, onCheckedChange, ...props
  },
  ref,
) {
  return (
    <span className="svx-switch-container" data-size={fieldSize ?? size}>
      <input
        {...props}
        ref={ref}
        type="checkbox"
        role="switch"
        aria-invalid={ariaInvalid ?? (invalid || undefined)}
        className={['svx-switch', 'svx-focus-ring', className].filter(Boolean).join(' ')}
        onChange={(event) => {
          onChange?.(event);
          if (!event.defaultPrevented) onCheckedChange?.(event.target.checked);
        }}
      />
      <span className="svx-switch__track" aria-hidden="true">
        <span className="svx-switch__thumb" />
      </span>
    </span>
  );
});
