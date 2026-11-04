// @vitest-environment jsdom
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Skeleton } from './skeleton';

describe('Skeleton', () => {
  it('renders one decorative text line by default without announcing a loading status', () => {
    render(<Skeleton data-testid="skeleton" aria-hidden={false} />);
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveAttribute('aria-hidden', 'true');
    expect(skeleton).toHaveAttribute('inert');
    expect(skeleton).toHaveClass('svx-skeleton--text', 'svx-skeleton--md');
    expect(skeleton.querySelectorAll('.svx-skeleton__line')).toHaveLength(1);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
  it('renders a deterministic multiline placeholder and forwards refs and attributes', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Skeleton ref={ref} lines={3} size="lg" className="custom" data-testid="skeleton" style={{ width: 240 }} />);
    expect(ref.current).toBe(screen.getByTestId('skeleton'));
    expect(ref.current).toHaveClass('custom', 'svx-skeleton--lg');
    expect(ref.current).toHaveStyle({ width: '240px' });
    expect(ref.current?.querySelectorAll('.svx-skeleton__line')).toHaveLength(3);
  });
  it.each(['circle', 'rectangle'] as const)('renders %s with no nested placeholder lines', variant => {
    render(<Skeleton variant={variant} size="sm" data-testid="skeleton" />);
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveClass(`svx-skeleton--${variant}`, 'svx-loading-shimmer');
    expect(skeleton.children).toHaveLength(0);
  });
  it.each([0, -1, 1.5, NaN, Infinity])('rejects invalid line count %s explicitly', lines => {
    expect(() => render(<Skeleton lines={lines} />)).toThrow('Skeleton lines must be a positive integer');
  });
});
