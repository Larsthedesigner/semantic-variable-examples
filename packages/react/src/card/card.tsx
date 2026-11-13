import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { Inline, Stack } from '../layout/layout';
import type { DivAsChildComponent } from '../polymorphic';

export interface CardProps extends ComponentPropsWithoutRef<'div'> {
  /** Merge onto a non-interactive semantic element such as article or section. */
  asChild?: boolean;
}
const CardImplementation = forwardRef<HTMLDivElement, CardProps>(function Card(
  { asChild = false, className, ...props }, ref,
) {
  const Component = asChild ? Slot : 'div';
  return <Component {...props} ref={ref} className={['svx-card', className].filter(Boolean).join(' ')} />;
});
export const Card = CardImplementation as DivAsChildComponent<CardProps>;

export interface CardHeaderProps extends ComponentPropsWithoutRef<'div'> {
  actions?: ReactNode;
}
export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(function CardHeader(
  { actions, className, children, ...props }, ref,
) {
  return <div {...props} ref={ref} className={['svx-card__header', className].filter(Boolean).join(' ')}>
    <Stack gap="xs" className="svx-card__heading">{children}</Stack>
    {actions != null && <div className="svx-card__actions">{actions}</div>}
  </div>;
});

export interface CardTitleProps extends ComponentPropsWithoutRef<'h2'> {
  /** Choose document hierarchy; appearance follows the corresponding type bundle. */
  level: 2 | 3 | 4 | 5 | 6;
}
export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(function CardTitle(
  { level, className, ...props }, ref,
) {
  const Component = ({ 2: 'h2', 3: 'h3', 4: 'h4', 5: 'h5', 6: 'h6' } as const)[level];
  return <Component {...props} ref={ref} className={['svx-card__title', className].filter(Boolean).join(' ')} />;
});

export const CardDescription = forwardRef<HTMLParagraphElement, ComponentPropsWithoutRef<'p'>>(function CardDescription(
  { className, ...props }, ref,
) {
  return <p {...props} ref={ref} className={['svx-card__description', className].filter(Boolean).join(' ')} />;
});

export const CardBody = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<'div'>>(function CardBody(
  { className, ...props }, ref,
) {
  return <Stack {...props} ref={ref} gap="lg" className={['svx-card__body', className].filter(Boolean).join(' ')} />;
});

export const CardFooter = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<'div'>>(function CardFooter(
  { className, ...props }, ref,
) {
  return <Inline {...props} ref={ref} gap="sm" justify="end" stackBelow="sm"
    className={['svx-card__footer', className].filter(Boolean).join(' ')} />;
});
