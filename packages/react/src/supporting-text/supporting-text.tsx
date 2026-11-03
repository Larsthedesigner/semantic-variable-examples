import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import { MaterialSymbol } from '../icons/material-symbol';

export type SupportingTextVariant = 'default' | 'error' | 'success' | 'disabled';

const icons: Record<SupportingTextVariant, string> = {
  default: 'lock',
  error: 'error',
  success: 'check_circle',
  disabled: 'lock',
};

export interface SupportingTextProps extends ComponentPropsWithoutRef<'p'> {
  size?: 'sm' | 'md' | 'lg';
  invalid?: boolean;
  disabled?: boolean;
  variant?: SupportingTextVariant;
  startIcon?: boolean;
  endIcon?: boolean;
}

export const SupportingText = forwardRef<HTMLParagraphElement, SupportingTextProps>(
  function SupportingText(
    { size = 'md', invalid = false, disabled = false, variant = 'default', startIcon = false, endIcon = false, children, className, ...props },
    ref,
  ) {
    const resolvedVariant = disabled ? 'disabled' : invalid ? 'error' : variant;
    const icon = (
      <span className="svx-supporting-text__icon">
        <MaterialSymbol name={icons[resolvedVariant]} />
      </span>
    );
    return (
      <p
        {...props}
        ref={ref}
        className={['svx-supporting-text', `svx-supporting-text--${size}`, className].filter(Boolean).join(' ')}
        data-variant={resolvedVariant}
        data-invalid={invalid || undefined}
        data-disabled={disabled || undefined}
      >
        {startIcon && icon}
        <span className="svx-supporting-text__text">{children}</span>
        {endIcon && icon}
      </p>
    );
  },
);

SupportingText.displayName = 'SupportingText';
