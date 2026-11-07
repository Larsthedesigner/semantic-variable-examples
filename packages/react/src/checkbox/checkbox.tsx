import { forwardRef, useCallback, useLayoutEffect, useRef } from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import { MaterialSymbol } from '../icons/material-symbol';

export interface CheckboxProps extends Omit<ComponentPropsWithoutRef<'input'>,
  'type' | 'size' | 'children' | 'role' | 'aria-checked' | 'readOnly'> {
  size?: 'sm' | 'md' | 'lg';
  'data-size'?: 'sm' | 'md' | 'lg';
  invalid?: boolean;
  /** Controlled mixed-state indicator; checked still determines form submission. */
  indeterminate?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { size = 'md', 'data-size': fieldSize, invalid, indeterminate = false,
    'aria-invalid': ariaInvalid, className, onChange, onCheckedChange, ...props },
  ref,
) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const setRef = useCallback((input: HTMLInputElement | null) => {
    inputRef.current = input;
    if (typeof ref === 'function') return ref(input);
    if (ref) ref.current = input;
  }, [ref]);
  useLayoutEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate;
  });
  return (
    <span className="svx-choice-container" data-size={fieldSize ?? size}>
      <input {...props} ref={setRef} type="checkbox"
        aria-invalid={ariaInvalid ?? (invalid || undefined)}
        className={['svx-choice', 'svx-checkbox', 'svx-focus-ring', className].filter(Boolean).join(' ')}
        onChange={event => {
          onChange?.(event);
          if (!event.defaultPrevented) onCheckedChange?.(event.target.checked);
          // The mixed indicator is owned by the caller, not native activation.
          event.currentTarget.indeterminate = indeterminate;
        }}
      />
      <span className="svx-choice__indicator" aria-hidden="true">
        <MaterialSymbol name="check" className="svx-checkbox__check" />
        <MaterialSymbol name="remove" className="svx-checkbox__mixed" />
      </span>
    </span>
  );
});
