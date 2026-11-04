import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef } from 'react';

type SkeletonShape =
  | { variant?: 'text'; lines?: number }
  | { variant: 'circle' | 'rectangle'; lines?: never };

export type SkeletonProps = Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'dangerouslySetInnerHTML'> & SkeletonShape & {
  size?: 'sm' | 'md' | 'lg';
};

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
  { variant = 'text', lines = 1, size = 'md', className, ...props },
  ref,
) {
  if (!Number.isInteger(lines) || lines < 1) throw new RangeError('Skeleton lines must be a positive integer');
  return (
    <div
      {...props}
      ref={ref}
      aria-hidden="true"
      inert
      className={['svx-skeleton', `svx-skeleton--${variant}`, `svx-skeleton--${size}`, variant !== 'text' && 'svx-loading-shimmer', className].filter(Boolean).join(' ')}
    >
      {variant === 'text' && Array.from({ length: lines }, (_, index) => (
        <div className="svx-skeleton__line svx-loading-shimmer" key={index} />
      ))}
    </div>
  );
});

Skeleton.displayName = 'Skeleton';
