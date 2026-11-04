// @vitest-environment jsdom
import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TokenReference } from './token-reference';

describe('Foundation reference categories', () => {
  it.each(['light', 'dark', 'high-contrast'] as const)('shows fixed light and dark previews in %s mode', mode => {
    render(<TokenReference category="color" mode={mode} />);
    for (const table of screen.getAllByRole('table')) {
      expect(within(table).getAllByRole('columnheader').map(header => header.textContent)).toEqual([
        'CSS variable', 'Light mode', 'Dark mode', 'Usage', 'Mapping', 'Resolved value (light mode)',
      ]);
    }
    const row = screen.getByText('--system-text-primary').closest('tr');
    if (!row) throw new Error('Missing primary text row');
    const cells = within(row).getAllByRole('cell');
    expect(cells).toHaveLength(6);
    expect(cells[0].querySelector('.sbx-swatch')).toBeNull();
    expect(cells[1].querySelector('.sbx-swatch')).toHaveStyle({ background: '#18181d' });
    expect(cells[2].querySelector('.sbx-swatch')).toHaveStyle({ background: '#fafafa' });
    expect(cells[3]).toHaveTextContent('highest content emphasis');
    expect(cells[4]).toHaveTextContent('var(--color-neutral-1200)');
    expect(cells[5]).toHaveTextContent('#18181d');
  });
  it('shows only app-wide color roles in Color Semantics', () => {
    render(<TokenReference category="color" />);
    expect(screen.getByRole('heading', { name: 'Semantic color reference' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Semantic color reference table' })).toHaveAttribute('tabindex', '0');
    expect(screen.getAllByRole('table')).toHaveLength(1);
    expect(screen.queryByText('About these previews')).not.toBeInTheDocument();
    for (const header of screen.getAllByRole('columnheader')) expect(header).toHaveAttribute('scope', 'col');
    const rows = screen.getAllByRole('table').flatMap(table => within(table).getAllByRole('row').slice(1));
    expect(rows).toHaveLength(131);
    expect(new Set(rows.map(row => within(row).getAllByRole('cell')[0].textContent)).size).toBe(131);
    for (const row of rows) {
      expect(within(row).getAllByRole('cell')[0].textContent).toMatch(/^--system-/);
      expect(row.textContent).not.toContain('--system-spacer-');
      expect(row.textContent).not.toContain('--system-type-');
      expect(row.textContent).not.toContain('--system-animation-');
    }
  });

  it('filters every semantic type in one table and restores all tokens', () => {
    render(<TokenReference category="color" />);
    const buttons = within(screen.getByRole('group', { name: 'Filter color semantics' })).getAllByRole('button');
    expect(buttons).toHaveLength(12);
    const table = screen.getByRole('table');
    const names = new Set<string>();
    for (const button of buttons.slice(1)) {
      fireEvent.click(button);
      expect(button).toHaveAttribute('aria-pressed', 'true');
      expect(buttons.filter(item => item.getAttribute('aria-pressed') === 'true')).toHaveLength(1);
      expect(screen.getByRole('table')).toBe(table);
      const rows = within(table).getAllByRole('row').slice(1);
      expect(button.querySelector('span')).toHaveTextContent(String(rows.length));
      expect(screen.getByRole('status')).toHaveTextContent(`${rows.length} of 131 tokens`);
      for (const row of rows) names.add(within(row).getAllByRole('cell')[0].textContent ?? '');
    }
    expect(names.size).toBe(131);
    fireEvent.click(buttons[0]);
    expect(buttons[0]).toHaveAttribute('aria-pressed', 'true');
    expect(within(table).getAllByRole('row')).toHaveLength(132);
    expect(screen.getByText('131 tokens / 11 groups / Light + dark')).toBeInTheDocument();
  });

  it('keeps filters independent when multiple references are rendered', () => {
    render(<><TokenReference category="color" /><TokenReference category="color" /></>);
    fireEvent.click(screen.getAllByRole('button', { name: 'Surfaces 16' })[0]);
    const tables = screen.getAllByRole('table');
    expect(within(tables[0]).getAllByRole('row')).toHaveLength(17);
    expect(within(tables[1]).getAllByRole('row')).toHaveLength(132);
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

  it('shows the animation shorthand only in Motion Semantics', () => {
    render(<TokenReference category="animation" />);
    expect(screen.getByRole('heading', { name: 'Animation semantics' })).toBeInTheDocument();
    const rows = within(screen.getByRole('table')).getAllByRole('row').slice(1);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toHaveTextContent('--system-animation-loading-shimmer');
    expect(rows[0]).toHaveTextContent('svx-loading-shimmer 1400ms linear infinite');
    expect(screen.queryByText('--system-loading-surface')).not.toBeInTheDocument();
  });

  it('renders each color preview as one colored div without nested elements', () => {
    render(<TokenReference category="color" />);
    const name = screen.getByText('--system-interactive-surface-hover');
    const wrapper = name.closest('tr')?.querySelector('.sbx-swatch--square');
    expect(wrapper).toHaveAttribute('aria-hidden', 'true');
    expect(wrapper).toHaveStyle({
      background: 'color-mix(in srgb, #18181d 6%, transparent)',
    });
    for (const row of within(screen.getByRole('table')).getAllByRole('row').slice(1)) {
      for (const cell of within(row).getAllByRole('cell').slice(1, 3)) {
        expect(cell.children).toHaveLength(1);
        expect(cell.firstElementChild?.tagName).toBe('DIV');
        expect(cell.firstElementChild?.children).toHaveLength(0);
      }
    }
  });

  it('preserves the component token reference columns', () => {
    render(<TokenReference owner="switch" mode="dark" />);
    expect(screen.getAllByRole('columnheader').map(header => header.textContent)).toEqual([
      'Token / preview', 'Usage', 'Authored mapping', 'Resolved CSS value (dark)', 'Primitive dependencies',
    ]);
  });
});
