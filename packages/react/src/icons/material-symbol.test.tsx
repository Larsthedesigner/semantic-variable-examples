// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { MaterialSymbol } from './material-symbol';

describe('MaterialSymbol', () => {
  it('renders a decorative ligature name by default', () => {
    render(<MaterialSymbol name="arrow_downward" data-testid="symbol" />);

    const symbol = screen.getByTestId('symbol');
    expect(symbol).toHaveTextContent('arrow_downward');
    expect(symbol).toHaveClass('svx-material-symbol');
    expect(symbol).toHaveAttribute('aria-hidden', 'true');
    expect(symbol).toHaveStyle({ fontVariationSettings: "'FILL' 0, 'wght' 400" });
  });

  it('supports fixed size presets and Material Symbols axes', () => {
    render(<MaterialSymbol name="favorite" size="lg" fill weight={500} data-testid="symbol" />);

    const symbol = screen.getByTestId('symbol');
    expect(symbol).toHaveClass('svx-material-symbol--lg');
    expect(symbol).toHaveStyle({ fontVariationSettings: "'FILL' 1, 'wght' 500" });
  });

  it('supports an accessible name when used as meaningful content', () => {
    render(<MaterialSymbol name="check" aria-label="Completed" />);

    expect(screen.getByRole('img', { name: 'Completed' })).toHaveTextContent('check');
  });

  it('forwards refs and allows aria-hidden to be overridden', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<MaterialSymbol ref={ref} name="add" aria-hidden={false} />);

    expect(ref.current).toBe(screen.getByText('add'));
    expect(ref.current).toHaveAttribute('aria-hidden', 'false');
  });
});
