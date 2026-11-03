import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef } from 'react';

export interface InputProps extends Omit<ComponentPropsWithoutRef<'input'>, 'size'> {
  size?: 'sm' | 'md' | 'lg';
  /** Visual size uses size; native character width uses htmlSize. */
  htmlSize?: number;
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { size = 'md', htmlSize, invalid, className, 'aria-invalid': ariaInvalid, ...props },
  ref,
) {
  return (
    <input
      data-size={size}
      {...props}
      ref={ref}
      size={htmlSize}
      aria-invalid={ariaInvalid ?? (invalid || undefined)}
      className={['svx-text-control', 'svx-input', 'svx-focus-ring', className].filter(Boolean).join(' ')}
    />
  );
});
