import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';
import type { ElementType, ReactElement, Ref } from 'react';
import type { PolymorphicProps } from './polymorphic';

/**
 * Variant classes map 1:1 to semantic tokens from @svx/tokens (see styles.css) —
 * never to raw color values — so theming stays centralized in the token layer.
 */
export const buttonVariants = cva('svx-button', {
  variants: {
    variant: {
      solid: 'svx-button--solid',
      outline: 'svx-button--outline',
      ghost: 'svx-button--ghost',
      danger: 'svx-button--danger',
    },
    size: {
      sm: 'svx-button--sm',
      md: 'svx-button--md',
      lg: 'svx-button--lg',
    },
  },
  defaultVariants: {
    variant: 'solid',
    size: 'md',
  },
});

export type ButtonOwnProps = VariantProps<typeof buttonVariants> & {
  /** Render the child element directly, merging Button's props/behavior onto it (Radix Slot pattern). */
  asChild?: boolean;
  className?: string;
};

export type ButtonProps<TElement extends ElementType = 'button'> = PolymorphicProps<
  TElement,
  ButtonOwnProps
>;

type ButtonComponent = (<TElement extends ElementType = 'button'>(
  props: ButtonProps<TElement>,
) => ReactElement | null) & { displayName?: string };

/**
 * Polymorphic, ShadCN-style Button: `as` swaps the rendered element/component,
 * `asChild` merges Button behavior onto a single child via Radix Slot, and
 * every visual variant resolves to a semantic design token (see styles.css).
 */
export const Button = forwardRef(function Button(
  { as, asChild, variant, size, className, ...props }: ButtonProps<ElementType>,
  ref: Ref<Element>,
) {
  const Comp: ElementType = asChild ? Slot : (as ?? 'button');
  const classes = [buttonVariants({ variant, size }), className].filter(Boolean).join(' ');

  return <Comp ref={ref} className={classes} {...props} />;
}) as ButtonComponent;

Button.displayName = 'Button';
