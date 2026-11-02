import { forwardRef } from 'react';
import { Button } from '../button/button';
import type { ButtonProps } from '../button/button';

export type IconButtonProps = Omit<
  ButtonProps<'button'>,
  'aria-label' | 'as' | 'asChild' | 'children' | 'iconStartIcon' | 'iconEndIcon'
> & {
  /** Accessible name announced by assistive technology. */
  label: string;
  /** Decorative Material Symbols ligature name; label provides the accessible name. */
  icon: string;
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { icon, label, className, type = 'button', ...props },
  ref,
) {
  return (
    <Button
      {...props}
      ref={ref}
      type={type}
      aria-label={label}
      iconStartIcon={icon}
      className={['svx-icon-button', className].filter(Boolean).join(' ')}
    />
  );
});

IconButton.displayName = 'IconButton';
