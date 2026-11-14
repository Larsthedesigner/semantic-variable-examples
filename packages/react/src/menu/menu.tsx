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
export const MenuGroup = DropdownMenuPrimitive.Group;
export const MenuRadioGroup = DropdownMenuPrimitive.RadioGroup;
export const MenuSub = DropdownMenuPrimitive.Sub;
export const MenuPortal = DropdownMenuPrimitive.Portal;

export const MenuLabel = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Label>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label>
>(function MenuLabel({ className, ...props }, ref) {
  return (
    <DropdownMenuPrimitive.Label
      ref={ref}
      className={['svx-menu-label', className].filter(Boolean).join(' ')}
      {...props}
    />
  );
});

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

export const MenuCheckboxItem = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(function MenuCheckboxItem({ className, children, checked, ...props }, ref) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      ref={ref}
      checked={checked}
      className={['svx-menu-item', 'svx-menu-item--checkable', className].filter(Boolean).join(' ')}
      {...props}
    >
      <span className="svx-menu-item__indicator" aria-hidden="true">
        <DropdownMenuPrimitive.ItemIndicator>
          {checked === 'indeterminate' ? '−' : '✓'}
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
});

export const MenuRadioItem = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(function MenuRadioItem({ className, children, ...props }, ref) {
  return (
    <DropdownMenuPrimitive.RadioItem
      ref={ref}
      className={['svx-menu-item', 'svx-menu-item--checkable', className].filter(Boolean).join(' ')}
      {...props}
    >
      <span className="svx-menu-item__indicator" aria-hidden="true">
        <DropdownMenuPrimitive.ItemIndicator>●</DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  );
});

export const MenuSeparator = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Separator>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(function MenuSeparator({ className, ...props }, ref) {
  return (
    <DropdownMenuPrimitive.Separator
      ref={ref}
      className={['svx-menu-separator', className].filter(Boolean).join(' ')}
      {...props}
    />
  );
});

export const MenuSubTrigger = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger>
>(function MenuSubTrigger({ className, children, ...props }, ref) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      ref={ref}
      className={['svx-menu-item', 'svx-menu-sub-trigger', className].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
      <span className="svx-menu-sub-trigger__indicator" aria-hidden="true">›</span>
    </DropdownMenuPrimitive.SubTrigger>
  );
});

export const MenuSubContent = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(function MenuSubContent({ className, sideOffset = 2, ...props }, ref) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.SubContent
        ref={ref}
        sideOffset={sideOffset}
        className={['svx-menu-content', className].filter(Boolean).join(' ')}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
});
