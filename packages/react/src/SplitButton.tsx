import { forwardRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Button } from './Button';
import type { ButtonOwnProps } from './Button';
import { Menu, MenuContent, MenuItem, MenuTrigger } from './Menu';

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

const ChevronDownIcon = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
    <path d="M2 3.5 5 6.5 8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * SplitButton — a primary action fused to a chevron-triggered Menu of
 * alternatives. Both halves are plain `Button`s (same variant/size/tokens),
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
          <Button
            variant={variant}
            size={size}
            disabled={disabled || actions.length === 0}
            aria-label="More actions"
            className="svx-split-button__trigger"
          >
            <ChevronDownIcon />
          </Button>
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
