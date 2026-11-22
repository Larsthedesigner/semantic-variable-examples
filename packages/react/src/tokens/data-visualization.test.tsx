import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DataVisualization } from './data-visualization.stories';

describe('data-visualization reference', () => {
  it.each(['light', 'dark', 'high-contrast'] as const)('shows labels and a data alternative in %s mode', mode => {
    const { container } = render(<DataVisualization mode={mode} />);
    expect(container.firstElementChild).toHaveClass(mode);
    expect(screen.getByRole('img', {
      name: 'Sample work items by stage: Discovery 18, Planning 12, In progress 26, Complete 31.',
    })).toBeInTheDocument();

    fireEvent.click(screen.getByText('View data table'));
    const table = screen.getByRole('table', { name: 'Sample work items by stage' });
    expect(within(table).getByRole('rowheader', { name: 'Discovery' })).toBeInTheDocument();
    expect(within(table).getByRole('cell', { name: '31' })).toBeInTheDocument();
  });

  it('documents all semantic scale roles without exposing palette primitives', () => {
    render(<DataVisualization />);
    expect(screen.getByText('Series 1')).toBeInTheDocument();
    expect(screen.getByText('Step 6')).toBeInTheDocument();
    expect(screen.getByText('neutral')).toBeInTheDocument();
    expect(screen.getByText('--system-data-viz-reference-line')).toBeInTheDocument();
    expect(screen.queryByText(/--color-data-viz/)).not.toBeInTheDocument();
  });
});
