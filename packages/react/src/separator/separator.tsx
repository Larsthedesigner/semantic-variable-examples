import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef } from 'react';

export type SeparatorOrientation = 'horizontal' | 'vertical';

export interface SeparatorProps extends Omit<ComponentPropsWithoutRef<'div'>, 'role' | 'aria-orientation'> {
  /** Draw a horizontal or vertical dividing line. */
  orientation?: SeparatorOrientation;
  /** Hide a purely visual separator from assistive technology. */
  decorative?: boolean;
}

export const Separator = forwardRef<HTMLDivElement, SeparatorProps>(function Separator(
  { orientation = 'horizontal', decorative = false, className, ...props },
  ref,
) {
  return (
    <div
      {...props}
      ref={ref}
      role={decorative ? 'none' : 'separator'}
      aria-orientation={decorative ? undefined : orientation}
      aria-hidden={decorative || undefined}
      data-orientation={orientation}
      className={['svx-separator', className].filter(Boolean).join(' ')}
    />
  );
});

Separator.displayName = 'Separator';
