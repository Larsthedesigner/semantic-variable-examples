import { forwardRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Button } from '../button/button';
import type { ButtonOwnProps } from '../button/button';
import { IconButton } from '../icon-button/icon-button';
import { Menu, MenuContent, MenuItem, MenuTrigger } from '../menu/menu';

export interface SplitButtonAction {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SplitButtonProps
  extends Pick<ButtonOwnProps, 'variant' | 'size'>,
    Omit<React.ComponentPropsWithoutRef<'div'>, 'onClick' | 'children'> {
  /** Stable primary label — menu selection never swaps it (no legacy label-swap path). */
  children: ReactNode;
  /** Menu actions — alternatives only, must not duplicate the primary action. */
  actions: SplitButtonAction[];
  /** Runs for both the primary button and any menu action. */
  onClick: (action: SplitButtonAction) => void;
  disabled?: boolean;
  /** Identity passed to `onClick` for the main button. */
  primaryValue?: string;
  wrapperClassName?: string;
}

/**
 * SplitButton — a primary action fused to a chevron-triggered Menu of
 * alternatives. Button and IconButton share the same variant/size/tokens,
 * joined by layout-only modifier classes (radius + divider) in styles.css —
 * no new color or state tokens, only new *arrangements* of existing ones.
 */
export const SplitButton = forwardRef<HTMLDivElement, SplitButtonProps>(function SplitButton(
  { children, actions, onClick, variant = 'solid', size = 'md', disabled, primaryValue = '__primary__', wrapperClassName, ...props },
  ref,
) {
  const [open, setOpen] = useState(false);

  return (
    <div ref={ref} role="group" className={['svx-split-button', wrapperClassName].filter(Boolean).join(' ')} {...props}>
      <Button
        variant={variant}
        size={size}
        disabled={disabled}
        className="svx-split-button__primary"
        onClick={() => onClick({ value: primaryValue, label: String(children) })}
      >
        {children}
      </Button>

      <Menu modal={false} open={open} onOpenChange={disabled ? undefined : setOpen}>
        <MenuTrigger asChild disabled={disabled || actions.length === 0}>
          <IconButton
            variant={variant}
            size={size}
            disabled={disabled || actions.length === 0}
            label="More actions"
            icon="arrow_drop_down"
            className="svx-split-button__trigger"
          />
        </MenuTrigger>

        <MenuContent align="end">
          {actions.map((action) => (
            <MenuItem
              key={action.value}
              disabled={action.disabled}
              onSelect={() => onClick(action)}
            >
              {action.label}
            </MenuItem>
          ))}
        </MenuContent>
      </Menu>
    </div>
  );
});

SplitButton.displayName = 'SplitButton';
