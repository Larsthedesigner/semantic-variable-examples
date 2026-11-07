// @vitest-environment jsdom
import { fireEvent, render, screen, within } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as layoutStories from './layout.stories';
import * as stackStories from './stack.stories';
import * as inlineStories from './inline.stories';
import * as gridStories from './grid.stories';
import * as containerStories from './container.stories';

const { ResponsivePlayground, Breakpoints } = composeStories(layoutStories);
const { Playground: StackPlayground } = composeStories(stackStories);
const { Playground: InlinePlayground } = composeStories(inlineStories);
const { Playground: GridPlayground } = composeStories(gridStories);
const { Playground: ContainerPlayground } = composeStories(containerStories);

beforeEach(() => {
  vi.stubGlobal('ResizeObserver', class {
    observe() {}
    disconnect() {}
  });
});
afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); });

describe('Layout documentation', () => {
  it('reports occupied tracks rather than collapsed auto-fit tracks and refreshes after width changes', () => {
    const original = window.getComputedStyle;
    vi.spyOn(window, 'getComputedStyle').mockImplementation(element => {
      const style = original(element);
      if (element.classList.contains('svx-grid')) {
        Object.defineProperty(style, 'gridTemplateColumns', { value: '300px 300px 300px 300px 0px 0px' });
      }
      return style;
    });
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
      return new DOMRect(0, 0, parseFloat(this.style.width) || 0, 100);
    });
    render(<ResponsivePlayground />);
    const readout = screen.getByLabelText('Measured layout');
    expect(readout).toHaveTextContent('Parent 768px');
    expect(readout).toHaveTextContent('Grid 4 columns');
    fireEvent.change(screen.getByRole('slider'), { target: { value: '1920' } });
    expect(readout).toHaveTextContent('Parent 1920px');
    expect(readout).toHaveTextContent('Grid 4 columns');
  });
  it('synchronizes numeric width, range, and named preset selection', () => {
    render(<ResponsivePlayground />);
    const number = screen.getByRole('spinbutton', { name: /Parent width/ });
    const slider = screen.getByRole('slider', { name: 'Resize parent' });
    const presets = within(screen.getByRole('group', { name: 'Parent width presets' }));
    expect(presets.getByRole('button', { name: 'sm 768px' })).toHaveAttribute('aria-pressed', 'true');
    fireEvent.change(number, { target: { value: '991' } });
    fireEvent.blur(number);
    expect(slider).toHaveValue('991');
    expect(presets.getAllByRole('button').every(button => button.getAttribute('aria-pressed') === 'false')).toBe(true);
    fireEvent.click(presets.getByRole('button', { name: 'md 992px' }));
    expect(number).toHaveValue(992);
    fireEvent.change(slider, { target: { value: '479' } });
    expect(number).toHaveValue(479);
    fireEvent.change(number, { target: { value: '2000' } });
    fireEvent.keyDown(number, { key: 'Enter' });
    expect(number).toHaveValue(1920);
    fireEvent.change(number, { target: { value: '' } });
    fireEvent.blur(number);
    expect(number).toHaveValue(1920);
    fireEvent.click(screen.getByRole('checkbox', { name: 'Show layout guides' }));
    expect(screen.getByRole('region', { name: 'Resizable parent preview' }).firstElementChild).toHaveClass('sbx-layout-guides');
  });
  it('documents exact non-overlapping breakpoint ranges', () => {
    render(<Breakpoints />);
    const rows = within(screen.getByRole('table', { name: 'Breakpoint ranges' })).getAllByRole('row').slice(1);
    expect(rows).toHaveLength(7);
    expect(rows[0]).toHaveTextContent('width < 480px');
    expect(rows[2]).toHaveTextContent('768px ≤ width < 992px');
    expect(rows[6]).toHaveTextContent('1920px ≤ width');
    expect(screen.getByText(/ruler is schematic/)).toBeInTheDocument();
  });
  it('wires each dedicated story to its actual component arguments', () => {
    const { container, unmount } = render(<StackPlayground gap="xl" />);
    expect(container.querySelector('.svx-stack')).toHaveAttribute('data-gap', 'xl');
    unmount();
    const inline = render(<InlinePlayground stackBelow="xs" align="end" />);
    expect(inline.container.querySelector('.svx-inline')).toHaveAttribute('data-stack-below', 'xs');
    inline.unmount();
    const grid = render(<GridPlayground preset="equal-3" gap="md" />);
    expect(grid.container.querySelector('.svx-grid')).toHaveAttribute('data-preset', 'equal-3');
    grid.unmount();
    const page = render(<ContainerPlayground size="reading" gutter="none" />);
    expect(page.container.querySelector('.svx-container')).toHaveAttribute('data-gutter', 'none');
  });
});
