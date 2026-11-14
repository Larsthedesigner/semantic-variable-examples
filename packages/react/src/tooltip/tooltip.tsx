import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ElementRef } from 'react';

export const TooltipProvider = TooltipPrimitive.Provider;
export const Tooltip = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;
export const TooltipPortal = TooltipPrimitive.Portal;
export const TooltipArrow = TooltipPrimitive.Arrow;

export type TooltipContentProps = ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>;

export const TooltipContent = forwardRef<
  ElementRef<typeof TooltipPrimitive.Content>,
  TooltipContentProps
>(function TooltipContent({ className, sideOffset = 4, collisionPadding = 8, ...props }, ref) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        {...props}
        ref={ref}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        className={['svx-tooltip-content', className].filter(Boolean).join(' ')}
      />
    </TooltipPrimitive.Portal>
  );
});

TooltipContent.displayName = 'TooltipContent';
