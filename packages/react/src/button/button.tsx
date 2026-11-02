import { Slottable, Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';
import type { ElementType, MouseEventHandler, ReactElement, Ref } from 'react';
import { MaterialSymbol } from '../icons/material-symbol';
import type { PolymorphicProps } from '../polymorphic';

export const buttonColors = ['accent', 'neutral', 'error', 'success', 'warning', 'info'] as const;

/**
 * Variant classes map 1:1 to semantic tokens from @svx/tokens (see styles.css) —
 * never to raw color values — so theming stays centralized in the token layer.
 */
export const buttonVariants = cva('svx-button svx-focus-ring', {
  variants: {
    variant: {
      solid: 'svx-button--solid',
      soft: 'svx-button--soft',
      outline: 'svx-button--outline',
      ghost: 'svx-button--ghost',
    },
    color: {
      accent: 'svx-button--color-accent',
      neutral: 'svx-button--color-neutral',
      error: 'svx-button--color-error',
      success: 'svx-button--color-success',
      warning: 'svx-button--color-warning',
      info: 'svx-button--color-info',
    },
    size: {
      sm: 'svx-button--sm',
      md: 'svx-button--md',
      lg: 'svx-button--lg',
    },
  },
  defaultVariants: {
    variant: 'solid',
    color: 'accent',
    size: 'md',
  },
});

export type ButtonOwnProps = VariantProps<typeof buttonVariants> & {
  /** Render the child element directly, merging Button's props/behavior onto it (Radix Slot pattern). */
  asChild?: boolean;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  /** Material Symbols ligature name for the leading icon. */
  iconStartIcon?: string;
  /** Material Symbols ligature name for the trailing icon. */
  iconEndIcon?: string;
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
  {
    as,
    asChild,
    variant,
    color,
    size,
    loading = false,
    disabled = false,
    iconStartIcon,
    iconEndIcon,
    children,
    className,
    onClick,
    ...props
  }: ButtonProps<ElementType>,
  ref: Ref<Element>,
) {
  const Comp: ElementType = asChild ? Slot : (as ?? 'button');
  const isDisabled = disabled || loading;
  const isNativeButton = !asChild && (as === undefined || as === 'button');
  const preventDisabledClick: MouseEventHandler<HTMLElement> = (event) => {
    if (!isNativeButton && isDisabled) {
      event.preventDefault();
      event.stopPropagation();
    }
  };
  const classes = [buttonVariants({ variant, color, size }), className].filter(Boolean).join(' ');

  return (
    <Comp
      {...props}
      ref={ref}
      className={classes}
      disabled={isNativeButton ? isDisabled : undefined}
      aria-disabled={!isNativeButton && isDisabled ? true : undefined}
      aria-busy={loading ? true : undefined}
      tabIndex={!isNativeButton && isDisabled ? -1 : props.tabIndex}
      onClick={onClick}
      onClickCapture={preventDisabledClick}
    >
      {loading ? (
        <svg className="svx-button__spinner" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
        </svg>
      ) : (
        iconStartIcon && <MaterialSymbol className="svx-button__icon" name={iconStartIcon} />
      )}
      <Slottable>{children}</Slottable>
      {!loading && iconEndIcon && (
        <MaterialSymbol className="svx-button__icon" name={iconEndIcon} />
      )}
    </Comp>
  );
}) as ButtonComponent;

Button.displayName = 'Button';
