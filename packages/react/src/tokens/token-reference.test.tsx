// @vitest-environment jsdom
import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TokenReference } from './token-reference';

describe('Foundation reference categories', () => {
  it.each(['light', 'dark', 'high-contrast'] as const)('shows fixed light and dark previews in %s mode', mode => {
    render(<TokenReference category="color" mode={mode} />);
    expect(screen.getAllByRole('columnheader').map(header => header.textContent)).toEqual([
      'CSS variable', 'Light mode', 'Dark mode', 'Usage', 'Mapping', 'Resolved value (light mode)',
    ]);
    const row = screen.getByText('--system-text-primary').closest('tr');
    if (!row) throw new Error('Missing primary text row');
    const cells = within(row).getAllByRole('cell');
    expect(cells).toHaveLength(6);
    expect(cells[0].querySelector('.sbx-swatch')).toBeNull();
    expect(cells[1].querySelector('.sbx-swatch__fill')).toHaveStyle({ background: '#18181d' });
    expect(cells[2].querySelector('.sbx-swatch__fill')).toHaveStyle({ background: '#fafafa' });
    expect(cells[3]).toHaveTextContent('highest content emphasis');
    expect(cells[4]).toHaveTextContent('var(--color-neutral-1200)');
    expect(cells[5]).toHaveTextContent('#18181d');
  });
  it('shows only app-wide color roles in Color Semantics', () => {
    render(<TokenReference category="color" />);
    expect(screen.getByRole('heading', { name: 'Semantic color reference' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Semantic color reference table' })).toHaveAttribute('tabindex', '0');
    for (const header of screen.getAllByRole('columnheader')) expect(header).toHaveAttribute('scope', 'col');
    const rows = within(screen.getByRole('table')).getAllByRole('row').slice(1);
    expect(rows).toHaveLength(129);
    for (const row of rows) {
      expect(within(row).getAllByRole('cell')[0].textContent).toMatch(/^--system-/);
      expect(row.textContent).not.toContain('--system-spacer-');
    }
  });

  it('shows only spacer roles and their mappings in Size Semantics', () => {
    render(<TokenReference category="spacer" mode="dark" />);
    expect(screen.getByRole('heading', { name: 'Spacer semantics' })).toBeInTheDocument();
    const rows = within(screen.getByRole('table')).getAllByRole('row').slice(1);
    expect(rows).toHaveLength(16);
    for (const row of rows) {
      const cells = within(row).getAllByRole('cell');
      expect(cells).toHaveLength(5);
      expect(cells[0].textContent).toMatch(/^--system-spacer-(px|rem)-/);
    }
    expect(screen.getByText('--system-spacer-rem-md')).toBeInTheDocument();
    expect(screen.getByText('var(--size-rem-12)')).toBeInTheDocument();
  });

  it('uses a checkerboard wrapper separate from the token fill', () => {
    render(<TokenReference category="color" />);
    const name = screen.getByText('--system-interactive-surface-hover');
    const wrapper = name.closest('tr')?.querySelector('.sbx-swatch--square');
    expect(wrapper).toHaveAttribute('aria-hidden', 'true');
    expect(wrapper?.querySelector('.sbx-swatch__fill')).toHaveStyle({
      background: 'color-mix(in srgb, #18181d 6%, transparent)',
    });
  });

  it('preserves the component token reference columns', () => {
    render(<TokenReference owner="switch" mode="dark" />);
    expect(screen.getAllByRole('columnheader').map(header => header.textContent)).toEqual([
      'Token / preview', 'Usage', 'Authored mapping', 'Resolved CSS value (dark)', 'Primitive dependencies',
    ]);
  });
});
