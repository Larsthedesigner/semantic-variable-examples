import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef } from 'react';

export type BadgeVariant = 'neutral' | 'info' | 'success' | 'warning' | 'error';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps extends ComponentPropsWithoutRef<'span'> {
  /** Semantic status or category treatment. */
  variant?: BadgeVariant;
  /** Compactness of the badge. */
  size?: BadgeSize;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { variant = 'neutral', size = 'md', className, ...props },
  ref,
) {
  return (
    <span
      {...props}
      ref={ref}
      className={['svx-badge', `svx-badge--${size}`, className].filter(Boolean).join(' ')}
      data-variant={variant}
      data-size={size}
    />
  );
});

Badge.displayName = 'Badge';
