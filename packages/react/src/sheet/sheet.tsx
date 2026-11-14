import { forwardRef } from 'react';
import type { CSSProperties } from 'react';
import {
  Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger,
} from '../dialog/dialog';
import type { DialogContentProps } from '../dialog/dialog';

export const Sheet = Dialog;
export const SheetTrigger = DialogTrigger;
export const SheetPortal = DialogPortal;
export const SheetOverlay = DialogOverlay;
export const SheetClose = DialogClose;
export const SheetHeader = DialogHeader;
export const SheetFooter = DialogFooter;
export const SheetTitle = DialogTitle;
export const SheetDescription = DialogDescription;

export type SheetSide = 'top' | 'right' | 'bottom' | 'left';
export type SheetSize = 'sm' | 'md' | 'lg' | 'full';

export interface SheetContentProps extends Omit<DialogContentProps, 'data-side'> {
  /** Edge of the viewport where the sheet enters. Defaults to "right". */
  side?: SheetSide;
  /** Preset size for the sheet width/height. Defaults to "md". */
  size?: SheetSize;
  /** Optional custom CSS variable overrides for the width and height. */
  style?: CSSProperties & {
    '--svx-sheet-width'?: string;
    '--svx-sheet-height'?: string;
  };
}

export const SheetContent = forwardRef<HTMLDivElement, SheetContentProps>(function SheetContent(
  { side = 'right', size = 'md', className, style, ...props },
  ref,
) {
  return (
    <DialogContent
      {...props}
      ref={ref}
      data-side={side}
      data-size={size}
      style={style}
      className={['svx-sheet-content', className].filter(Boolean).join(' ')}
    />
  );
});
