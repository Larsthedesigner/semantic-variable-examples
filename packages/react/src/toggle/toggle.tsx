import { forwardRef, useState } from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import { Button } from '../button/button';

export interface ToggleProps extends Omit<ComponentPropsWithoutRef<'button'>, 'aria-pressed'> {
  size?: 'sm' | 'md' | 'lg';
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  /** Material Symbols ligature name. */
  iconStartIcon?: string;
  /** Material Symbols ligature name. */
  iconEndIcon?: string;
}

export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(function Toggle(
  {
    pressed, defaultPressed = false, onPressedChange, size = 'md',
    type = 'button', disabled, onClick, className, ...props
  },
  ref,
) {
  const [uncontrolledPressed, setUncontrolledPressed] = useState(defaultPressed);
  const isPressed = pressed ?? uncontrolledPressed;

  return (
    <Button
      {...props}
      ref={ref}
      type={type}
      size={size}
      disabled={disabled}
      variant={isPressed ? 'soft' : 'ghost'}
      color={isPressed ? 'accent' : 'neutral'}
      className={['svx-toggle', className].filter(Boolean).join(' ')}
      aria-pressed={isPressed}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented || disabled) return;
        const nextPressed = !isPressed;
        if (pressed === undefined) setUncontrolledPressed(nextPressed);
        onPressedChange?.(nextPressed);
      }}
    />
  );
});
