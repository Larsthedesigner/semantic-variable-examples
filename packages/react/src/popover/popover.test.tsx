// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

describe('Popover', () => {
  it('renders a labelled trigger and keeps anchored content closed by default', () => {
    render(
      <Popover>
        <PopoverTrigger>Show filters</PopoverTrigger>
        <PopoverContent aria-label="Project filters">Filter controls</PopoverContent>
      </Popover>,
    );

    expect(screen.getByRole('button', { name: 'Show filters' })).toHaveAttribute('aria-haspopup', 'dialog');
    expect(screen.getByRole('button', { name: 'Show filters' })).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('dialog', { name: 'Project filters' })).not.toBeInTheDocument();
  });
});
