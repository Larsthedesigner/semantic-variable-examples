// @vitest-environment jsdom
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Badge } from './badge';
import { tokenCatalog } from '../tokens/token-catalog';

describe('Badge', () => {
  it('uses the neutral medium treatment by default and forwards native props and refs', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Badge ref={ref} id="status" title="Current status" className="custom">Open</Badge>);
    expect(ref.current).toBe(screen.getByText('Open'));
    expect(ref.current).toHaveAttribute('id', 'status');
    expect(ref.current).toHaveAttribute('title', 'Current status');
    expect(ref.current).toHaveAttribute('data-variant', 'neutral');
    expect(ref.current).toHaveAttribute('data-size', 'md');
    expect(ref.current).toHaveClass('svx-badge', 'svx-badge--md', 'custom');
  });

  it.each(['neutral', 'info', 'success', 'warning', 'error'] as const)(
    'supports the %s semantic status treatment',
    (variant) => {
      render(<Badge variant={variant}>Status</Badge>);
      expect(screen.getByText('Status')).toHaveAttribute('data-variant', variant);
    },
  );

  it.each(['sm', 'md', 'lg'] as const)('supports the %s size', (size) => {
    render(<Badge size={size}>Status</Badge>);
    expect(screen.getByText('Status')).toHaveClass(`svx-badge--${size}`);
  });

  it('renders child content without imposing a status or live-region role', () => {
    render(<Badge><strong>3</strong> new messages</Badge>);
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it.each(['light', 'dark', 'high-contrast'] as const)('resolves status mappings in %s', (mode) => {
    const badgeTokens = tokenCatalog(mode, 'badge');
    const systemTokens = tokenCatalog(mode);
    for (const token of badgeTokens) expect(token.value).not.toContain('var(');
    for (const variant of ['neutral', 'info', 'success', 'warning', 'error'] as const) {
      for (const role of ['surface', 'fg', 'border'] as const) {
        expect(badgeTokens.find(token => token.name === `--component-badge-${variant}-${role === 'fg' ? 'foreground' : role}`)?.value)
          .toBe(systemTokens.find(token => token.name === `--system-status-${variant}-${role}`)?.value);
      }
    }
  });
});
