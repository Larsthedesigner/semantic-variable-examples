import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Introduction } from './introduction';

describe('Storybook introduction', () => {
  it('introduces the design system and explains its purpose', () => {
    render(<Introduction />);

    expect(screen.getByRole('heading', { level: 1, name: 'An exploratory design system' })).toBeInTheDocument();
    expect(screen.getByText('Example Design System')).toBeInTheDocument();
    expect(screen.getByText('Explore primitives, semantics, components, and their usage in an example design system.')).toBeInTheDocument();
  });

  it('describes Storybook and semantic design decisions in labeled sections', () => {
    render(<Introduction />);

    expect(screen.getByRole('region', { name: 'About Storybook' })).toHaveTextContent(
      'Storybook is a sandbox environment for exploring and developing UI components.',
    );
    expect(screen.getByRole('region', { name: 'Semantic driven design decisions' })).toHaveTextContent(
      'When usage is implied, engineers and AI can deterministically infer proper usage.',
    );
  });

  it('does not apply the dark theme by default', () => {
    render(<Introduction />);
    expect(screen.getByRole('main')).not.toHaveClass('dark');
  });

  it('applies the dark theme when requested', () => {
    render(<Introduction dark />);
    expect(screen.getByRole('main')).toHaveClass('dark');
  });
});
