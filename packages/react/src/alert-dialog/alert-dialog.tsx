import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ElementRef } from 'react';

export const AlertDialog = AlertDialogPrimitive.Root;
export const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
export const AlertDialogPortal = AlertDialogPrimitive.Portal;
export const AlertDialogCancel = AlertDialogPrimitive.Cancel;
export const AlertDialogAction = AlertDialogPrimitive.Action;

export const AlertDialogOverlay = forwardRef<
  ElementRef<typeof AlertDialogPrimitive.Overlay>,
  ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(function AlertDialogOverlay({ className, ...props }, ref) {
  return <AlertDialogPrimitive.Overlay {...props} ref={ref} className={['svx-alert-dialog-overlay', className].filter(Boolean).join(' ')} />;
});

export interface AlertDialogContentProps extends ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content> {
  overlayClassName?: string;
  /** Show the backdrop scrim. Modal behavior remains active when false. Defaults to true. */
  scrim?: boolean;
}

export const AlertDialogContent = forwardRef<
  ElementRef<typeof AlertDialogPrimitive.Content>,
  AlertDialogContentProps
>(function AlertDialogContent({ className, overlayClassName, scrim = true, ...props }, ref) {
  return (
    <AlertDialogPrimitive.Portal>
      <AlertDialogOverlay className={overlayClassName} data-scrim={scrim} />
      <AlertDialogPrimitive.Content {...props} ref={ref} className={['svx-alert-dialog-content', className].filter(Boolean).join(' ')} />
    </AlertDialogPrimitive.Portal>
  );
});

export const AlertDialogHeader = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<'div'>>(function AlertDialogHeader(
  { className, ...props }, ref,
) {
  return <div {...props} ref={ref} className={['svx-alert-dialog__header', className].filter(Boolean).join(' ')} />;
});

export const AlertDialogFooter = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<'div'>>(function AlertDialogFooter(
  { className, ...props }, ref,
) {
  return <div {...props} ref={ref} className={['svx-alert-dialog__footer', className].filter(Boolean).join(' ')} />;
});

export const AlertDialogTitle = forwardRef<
  ElementRef<typeof AlertDialogPrimitive.Title>,
  ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(function AlertDialogTitle({ className, ...props }, ref) {
  return <AlertDialogPrimitive.Title {...props} ref={ref} className={['svx-alert-dialog__title', className].filter(Boolean).join(' ')} />;
});

export const AlertDialogDescription = forwardRef<
  ElementRef<typeof AlertDialogPrimitive.Description>,
  ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(function AlertDialogDescription({ className, ...props }, ref) {
  return <AlertDialogPrimitive.Description {...props} ref={ref} className={['svx-alert-dialog__description', className].filter(Boolean).join(' ')} />;
});
