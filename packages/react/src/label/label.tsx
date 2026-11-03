import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef } from 'react';

export interface LabelProps extends ComponentPropsWithoutRef<'label'> {
  size?: 'sm' | 'md' | 'lg';
  /** Visual indicator only; also set required on the associated control. */
  required?: boolean;
  optional?: boolean;
  textCase?: 'sentence' | 'uppercase';
  invalid?: boolean;
  disabled?: boolean;
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(function Label(
  { size = 'md', required = false, optional = false, textCase = 'sentence', invalid = false, disabled = false, className, children, ...props },
  ref,
) {
  return (
    <label
      {...props}
      ref={ref}
      className={['svx-label', `svx-label--${size}`, className].filter(Boolean).join(' ')}
      data-case={textCase}
      data-invalid={invalid || undefined}
      data-disabled={disabled || undefined}
    >
      <span className="svx-label__text">{children}</span>
      {required && <span className="svx-label__required" aria-hidden="true">*</span>}
      {!required && optional && <span className="svx-label__optional">(optional)</span>}
    </label>
  );
});

Label.displayName = 'Label';
