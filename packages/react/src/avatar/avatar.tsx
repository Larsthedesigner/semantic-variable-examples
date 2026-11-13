import { forwardRef, useEffect, useState } from 'react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

export type AvatarSize = 'sm' | 'md' | 'lg';

export interface AvatarProps extends Omit<ComponentPropsWithoutRef<'span'>, 'children' | 'role'> {
  /** Accessible name of the person represented by this avatar. */
  name: string;
  /** Image URL. The initials fallback is shown when omitted or when loading fails. */
  src?: string;
  /** Custom fallback content; defaults to initials derived from name. */
  fallback?: ReactNode;
  /** Diameter of the avatar. */
  size?: AvatarSize;
}

function getInitials(name: string) {
  const initials = name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('');
  return initials || '?';
}

export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { name, src, fallback, size = 'md', className, 'aria-label': ariaLabel, ...props },
  ref,
) {
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [src]);

  if (!name.trim()) throw new RangeError('Avatar name must not be empty');

  return (
    <span
      {...props}
      ref={ref}
      role="img"
      aria-label={ariaLabel ?? name}
      className={['svx-avatar', `svx-avatar--${size}`, className].filter(Boolean).join(' ')}
      data-size={size}
    >
      {src && !imageFailed
        ? <img src={src} alt="" aria-hidden="true" onError={() => setImageFailed(true)} />
        : <span aria-hidden="true">{fallback ?? getInitials(name)}</span>}
    </span>
  );
});

Avatar.displayName = 'Avatar';
