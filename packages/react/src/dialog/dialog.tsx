import * as DialogPrimitive from '@radix-ui/react-dialog';
import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ElementRef } from 'react';

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogPortal = DialogPrimitive.Portal;
export const DialogClose = DialogPrimitive.Close;

export const DialogOverlay = forwardRef<
  ElementRef<typeof DialogPrimitive.Overlay>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(function DialogOverlay({ className, ...props }, ref) {
  return <DialogPrimitive.Overlay {...props} ref={ref} className={['svx-dialog-overlay', className].filter(Boolean).join(' ')} />;
});

export interface DialogContentProps extends ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  overlayClassName?: string;
  /** Show the backdrop scrim. Modal behavior remains active when false. Defaults to true. */
  scrim?: boolean;
}

export const DialogContent = forwardRef<
  ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(function DialogContent({ className, overlayClassName, scrim = true, ...props }, ref) {
  return (
    <DialogPrimitive.Portal>
      <DialogOverlay className={overlayClassName} data-scrim={scrim} />
      <DialogPrimitive.Content {...props} ref={ref} className={['svx-dialog-content', className].filter(Boolean).join(' ')} />
    </DialogPrimitive.Portal>
  );
});

export const DialogHeader = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<'div'>>(function DialogHeader(
  { className, ...props }, ref,
) {
  return <div {...props} ref={ref} className={['svx-dialog__header', className].filter(Boolean).join(' ')} />;
});

export const DialogFooter = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<'div'>>(function DialogFooter(
  { className, ...props }, ref,
) {
  return <div {...props} ref={ref} className={['svx-dialog__footer', className].filter(Boolean).join(' ')} />;
});

export const DialogTitle = forwardRef<
  ElementRef<typeof DialogPrimitive.Title>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(function DialogTitle({ className, ...props }, ref) {
  return <DialogPrimitive.Title {...props} ref={ref} className={['svx-dialog__title', className].filter(Boolean).join(' ')} />;
});

export const DialogDescription = forwardRef<
  ElementRef<typeof DialogPrimitive.Description>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(function DialogDescription({ className, ...props }, ref) {
  return <DialogPrimitive.Description {...props} ref={ref} className={['svx-dialog__description', className].filter(Boolean).join(' ')} />;
});
