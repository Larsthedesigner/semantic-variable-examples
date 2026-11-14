// @vitest-environment jsdom
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Separator } from './separator';
import { tokenCatalog } from '../tokens/token-catalog';

describe('Separator', () => {
  it('exposes a horizontal semantic separator by default', () => {
    render(<Separator />);
    expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'horizontal');
  });

  it('supports a semantic vertical separator and forwards native props and refs', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Separator ref={ref} orientation="vertical" aria-label="Actions divider" id="divider" className="custom" />);
    const separator = screen.getByRole('separator', { name: 'Actions divider' });
    expect(ref.current).toBe(separator);
    expect(separator).toHaveAttribute('aria-orientation', 'vertical');
    expect(separator).toHaveAttribute('data-orientation', 'vertical');
    expect(separator).toHaveAttribute('id', 'divider');
    expect(separator).toHaveClass('svx-separator', 'custom');
  });

  it('hides decorative separators from the accessibility tree', () => {
    render(<Separator decorative orientation="vertical" data-testid="decorative" />);
    expect(screen.queryByRole('separator')).not.toBeInTheDocument();
    expect(screen.getByTestId('decorative')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByTestId('decorative')).toHaveAttribute('role', 'none');
  });

  it.each(['light', 'dark', 'high-contrast'] as const)('maps to the subtle border role in %s', (mode) => {
    const componentToken = tokenCatalog(mode, 'separator').find(token => token.name === '--component-separator-color');
    const systemToken = tokenCatalog(mode).find(token => token.name === '--system-border-subtle');
    expect(componentToken?.value).toBe(systemToken?.value);
  });
});
