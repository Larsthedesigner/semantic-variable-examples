import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef } from 'react';

export interface TextareaProps extends ComponentPropsWithoutRef<'textarea'> {
  size?: 'sm' | 'md' | 'lg';
  invalid?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { size = 'md', rows = 3, invalid, className, 'aria-invalid': ariaInvalid, ...props },
  ref,
) {
  return (
    <textarea
      data-size={size}
      {...props}
      ref={ref}
      rows={rows}
      aria-invalid={ariaInvalid ?? (invalid || undefined)}
      className={['svx-text-control', 'svx-textarea', 'svx-focus-ring', className].filter(Boolean).join(' ')}
    />
  );
});
