// @vitest-environment jsdom
import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TypographyPrimitives, TypographySemantics } from './typography-reference';

describe('Typography references', () => {
  it.each(['light', 'dark', 'high-contrast'] as const)('documents complete bundles and renders specimens in %s', mode => {
    const { container } = render(<TypographySemantics mode={mode} />);
    expect(container.firstElementChild).toHaveClass(mode);
    expect(screen.getAllByRole('table')).toHaveLength(14);
    const rows = screen.getAllByRole('table').flatMap(table => within(table).getAllByRole('row').slice(1));
    expect(rows).toHaveLength(42);
    for (const row of rows) expect(within(row).getAllByRole('cell')[0]).toHaveTextContent(/^--system-type-/);
    const heading = screen.getByText('Workspace settings');
    expect(heading).toHaveStyle({
      font: 'var(--system-type-h1-font)',
      letterSpacing: 'var(--system-type-h1-tracking)',
      color: 'var(--system-type-h1-color)',
    });
    expect(screen.getByText('<h1>')).toBeInTheDocument();
    expect(screen.getByText('<code>')).toBeInTheDocument();
  });

  it('separates all typography primitive families and preserves existing control line heights', () => {
    render(<TypographyPrimitives />);
    expect(screen.getAllByRole('table')).toHaveLength(6);
    expect(screen.getByText('--font-family-mono')).toBeInTheDocument();
    expect(screen.getByText('--font-size-5xl')).toBeInTheDocument();
    expect(screen.getByText('--line-height-ratio-md')).toBeInTheDocument();
    expect(screen.getByText('--line-height-md')).toBeInTheDocument();
    expect(screen.getByText('--letter-spacing-tight')).toBeInTheDocument();
  });
});
