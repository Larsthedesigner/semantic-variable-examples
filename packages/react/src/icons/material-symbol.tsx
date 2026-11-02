import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';

export const materialSymbolSizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
export type MaterialSymbolSize = (typeof materialSymbolSizes)[number];
export type MaterialSymbolWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700;

export interface MaterialSymbolProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Material Symbols ligature name, for example `add` or `arrow_downward`. */
  name: string;
  /** Fixed glyph size. When omitted, inherits a contextual size or defaults to 24px. */
  size?: MaterialSymbolSize;
  /** Material Symbols variable-font axes. */
  fill?: boolean;
  weight?: MaterialSymbolWeight;
}

const MaterialSymbol = forwardRef<HTMLSpanElement, MaterialSymbolProps>(function MaterialSymbol(
  {
    name,
    size,
    fill = false,
    weight = 400,
    className,
    'aria-label': ariaLabel,
    'aria-hidden': ariaHidden,
    role,
    ...props
  },
  ref,
) {
  const classes = [
    'svx-material-symbol',
    size && `svx-material-symbol--${size}`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <span
      {...props}
      ref={ref}
      className={classes}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden ?? (ariaLabel ? undefined : true)}
      role={role ?? (ariaLabel ? 'img' : undefined)}
      style={{
        ...props.style,
        fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' ${weight}`,
      }}
    >
      {name}
    </span>
  );
});

MaterialSymbol.displayName = 'MaterialSymbol';

export { MaterialSymbol };
