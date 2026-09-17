import type { ComponentPropsWithRef, ElementType } from 'react';

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
