import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import type { DivAsChildComponent } from '../polymorphic';

export const layoutGaps = ['none', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] as const;
export type LayoutGap = (typeof layoutGaps)[number];
export const layoutBreakpoints = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;
export type LayoutBreakpoint = (typeof layoutBreakpoints)[number];

interface LayoutProps extends ComponentPropsWithoutRef<'div'> {
  /** Merge layout onto a single child element without adding a wrapper. */
  asChild?: boolean;
}
export interface StackProps extends LayoutProps {
  gap?: LayoutGap;
}
const StackImplementation = forwardRef<HTMLDivElement, StackProps>(function Stack(
  { gap = 'lg', asChild = false, className, ...props }, ref,
) {
  const Component = asChild ? Slot : 'div';
  return <Component {...props} ref={ref} data-gap={gap}
    className={['svx-stack', className].filter(Boolean).join(' ')} />;
});
export const Stack = StackImplementation as DivAsChildComponent<StackProps>;

export interface InlineProps extends ComponentPropsWithoutRef<'div'> {
  gap?: LayoutGap;
  align?: 'start' | 'center' | 'end';
  justify?: 'start' | 'center' | 'end';
  /** Stack below this outer wrapper's width; never uses viewport width. */
  stackBelow?: LayoutBreakpoint;
}
export const Inline = forwardRef<HTMLDivElement, InlineProps>(function Inline(
  { gap = 'sm', align = 'center', justify = 'start', stackBelow = 'sm', className, children, ...props }, ref,
) {
  return <div {...props} ref={ref}
    className={['svx-inline-container', className].filter(Boolean).join(' ')}>
    <div className="svx-inline" data-gap={gap} data-align={align} data-justify={justify} data-stack-below={stackBelow}>
      {children}
    </div>
  </div>;
});

export interface GridProps extends LayoutProps {
  preset?: 'cards' | 'equal-2' | 'equal-3';
  gap?: LayoutGap;
}
const GridImplementation = forwardRef<HTMLDivElement, GridProps>(function Grid(
  { preset = 'cards', gap, asChild = false, className, ...props }, ref,
) {
  const Component = asChild ? Slot : 'div';
  return <Component {...props} ref={ref} data-preset={preset} data-gap={gap}
    className={['svx-grid', className].filter(Boolean).join(' ')} />;
});
export const Grid = GridImplementation as DivAsChildComponent<GridProps>;

export interface ContainerProps extends LayoutProps {
  size?: 'reading' | 'content' | 'wide';
  gutter?: 'responsive' | 'fluid' | 'none';
}
const ContainerImplementation = forwardRef<HTMLDivElement, ContainerProps>(function Container(
  { size = 'content', gutter = 'responsive', asChild = false, className, ...props }, ref,
) {
  const Component = asChild ? Slot : 'div';
  return <Component {...props} ref={ref} data-size={size} data-gutter={gutter}
    className={['svx-container', className].filter(Boolean).join(' ')} />;
});
export const Container = ContainerImplementation as DivAsChildComponent<ContainerProps>;
