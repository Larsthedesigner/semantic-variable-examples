// @vitest-environment jsdom
import { composeStories } from '@storybook/react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import * as stories from './menu.stories';

const { Default, Controlled, DisabledTrigger } = composeStories(stories);

describe('Menu documentation', () => {
  it('forwards story trigger controls instead of hard-coding the example', () => {
    render(<Default triggerLabel="Document actions" triggerDisabled />);
    expect(screen.getByRole('button', { name: 'Document actions' })).toBeDisabled();
  });

  it('keeps trigger controls working in the controlled example', () => {
    render(<Controlled triggerLabel="Folder actions" triggerDisabled />);
    expect(screen.getByRole('button', { name: 'Folder actions' })).toBeDisabled();
    expect(screen.getByText('Controlled state: closed')).toBeInTheDocument();
  });

  it('allows the disabled example to be enabled through controls', () => {
    render(<DisabledTrigger triggerDisabled={false} />);
    expect(screen.getByRole('button', { name: 'Project actions' })).toBeEnabled();
  });
});
