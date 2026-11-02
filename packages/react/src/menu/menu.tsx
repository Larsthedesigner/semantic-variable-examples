import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ElementRef } from 'react';

/**
 * Menu — a small, token-only wrapper around Radix's DropdownMenu primitive.
 * Radix owns positioning/portal/keyboard-nav behavior; this file only maps
 * its parts to semantic classes (see styles.css), the same variant-to-token
 * convention Button follows. `[data-highlighted]` (set by Radix on hover
 * *and* arrow-key navigation) drives the item hover state in CSS, so both
 * input modes share one rule with no JS state to track.
 */
export const Menu = DropdownMenuPrimitive.Root;
export const MenuTrigger = DropdownMenuPrimitive.Trigger;

export const MenuContent = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Content>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(function MenuContent({ className, sideOffset = 4, ...props }, ref) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={['svx-menu-content', className].filter(Boolean).join(' ')}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
});

export const MenuItem = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Item>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>
>(function MenuItem({ className, ...props }, ref) {
  return (
    <DropdownMenuPrimitive.Item
      ref={ref}
      className={['svx-menu-item', className].filter(Boolean).join(' ')}
      {...props}
    />
  );
});
