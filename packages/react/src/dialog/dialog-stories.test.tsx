// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import { describe, expect, it } from 'vitest';
import * as stories from './dialog.stories';

const { Default, Open, WithoutScrim, Tokens } = composeStories(stories);

describe('Dialog documentation', () => {
  it('passes scrim and overlay class arguments to each dialog example', async () => {
    const { unmount } = render(<Default scrim={false} overlayClassName="custom-overlay" />);
    fireEvent.click(screen.getByRole('button', { name: 'Edit profile' }));
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    expect(document.querySelector('.custom-overlay')).toHaveAttribute('data-scrim', 'false');
    unmount();

    const open = render(<Open scrim={false} overlayClassName="custom-overlay" />);
    expect(document.querySelector('.custom-overlay')).toHaveAttribute('data-scrim', 'false');
    open.unmount();

    render(<WithoutScrim scrim overlayClassName="custom-overlay" />);
    expect(document.querySelector('.custom-overlay')).toHaveAttribute('data-scrim', 'true');
  });

  it('uses the selected mode in the token reference', () => {
    render(<Tokens mode="dark" />);
    expect(screen.getByText('10 tokens / dark mode')).toBeInTheDocument();
    expect(screen.getByText('#292930')).toBeInTheDocument();
  });
});
