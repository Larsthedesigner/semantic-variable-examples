import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Introduction } from './introduction';

describe('Storybook introduction', () => {
  it('explains the token layers and the local AI-assisted workflow', () => {
    render(<Introduction />);

    expect(screen.getByRole('heading', { name: 'Welcome to the design system' })).toBeInTheDocument();
    expect(screen.getByText('--size-px-12')).toBeInTheDocument();
    expect(screen.getByText('--system-spacer-px-md')).toBeInTheDocument();
    expect(screen.getByText('--component-button-padding-x-md')).toBeInTheDocument();
    expect(screen.getByText('svx-storybook')).toBeInTheDocument();
    expect(screen.getByText(/does not run tests/)).toBeInTheDocument();
  });

  it.each([
    ['Explore color semantics', './?path=/story/foundations-color--semantics'],
    ['Explore Button', './?path=/story/components-button--solid'],
    ['Explore layout foundations', './?path=/story/foundations-layout--overview'],
    ['Explore size semantics', './?path=/story/foundations-size--semantics'],
  ])('links %s to the Storybook manager', (label, href) => {
    render(<Introduction />);
    expect(screen.getByRole('link', { name: label })).toHaveAttribute('href', href);
    expect(screen.getByRole('link', { name: label })).toHaveAttribute('target', '_top');
  });

  it('applies the dark theme when requested', () => {
    render(<Introduction dark />);
    expect(screen.getByRole('main')).toHaveClass('dark');
  });
});
