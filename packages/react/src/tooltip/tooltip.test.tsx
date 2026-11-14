// @vitest-environment jsdom
import { createRef } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

function TooltipExample() {
  return (
    <TooltipProvider delayDuration={0} skipDelayDuration={0}>
      <Tooltip>
        <TooltipTrigger>Save changes</TooltipTrigger>
        <TooltipContent>Saves your updates</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

describe('Tooltip', () => {
  it('associates the tooltip description with its trigger when opened', async () => {
    const user = userEvent.setup();
    render(<TooltipExample />);
    const trigger = screen.getByRole('button', { name: 'Save changes' });

    await user.hover(trigger);

    const tooltip = await screen.findByRole('tooltip');
    expect(tooltip).toHaveTextContent('Saves your updates');
    expect(trigger).toHaveAttribute('aria-describedby', tooltip.id);
  }, 15_000);

  it('opens on keyboard focus and dismisses with Escape', async () => {
    const user = userEvent.setup();
    render(<TooltipExample />);
    const trigger = screen.getByRole('button', { name: 'Save changes' });

    await user.tab();
    expect(trigger).toHaveFocus();
    expect(await screen.findByRole('tooltip')).toBeVisible();

    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
  }, 15_000);

  it('forwards content props, class names, and refs', async () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(
      <TooltipProvider delayDuration={0}>
        <Tooltip defaultOpen>
          <TooltipTrigger>Help</TooltipTrigger>
          <TooltipContent ref={ref} className="custom" data-testid="tip">Helpful hint</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );
    const tooltip = await screen.findByTestId('tip');
    expect(ref.current).toBe(tooltip);
    expect(tooltip).toHaveClass('svx-tooltip-content', 'custom');
    expect(tooltip).toHaveTextContent('Helpful hint');
    expect(container).toBeInTheDocument();
  }, 15_000);
});
