import type { ComponentPropsWithRef, ElementType, ReactElement, Ref } from 'react';

/**
 * Standard polymorphic-`as` typing: props (including `ref`) are inferred
 * from whatever element/component is passed via `as`, defaulting to
 * `TDefault`'s own element type.
 */
export type PolymorphicRef<TElement extends ElementType> = ComponentPropsWithRef<TElement>['ref'];

export type PolymorphicProps<TElement extends ElementType, TOwnProps> = TOwnProps & {
  as?: TElement;
} & Omit<ComponentPropsWithRef<TElement>, keyof TOwnProps | 'as' | 'ref'> & {
    ref?: PolymorphicRef<TElement>;
  };

/** Components with a div default only expose the wrapper ref in non-slot mode. */
export type DivAsChildComponent<TProps extends { asChild?: boolean }> = {
  (props: Omit<TProps, 'asChild'> & { asChild?: false; ref?: Ref<HTMLDivElement> }): ReactElement | null;
  (props: Omit<TProps, 'asChild'> & { asChild: true; ref?: never }): ReactElement | null;
  (props: Omit<TProps, 'asChild'> & { asChild?: boolean; ref?: never }): ReactElement | null;
};
