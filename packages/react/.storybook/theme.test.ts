import { describe, expect, it, vi } from 'vitest';
import portableTokens from '../../tokens/dist/css/index.css?raw';
import { GLOBALS_UPDATED, SET_GLOBALS } from 'storybook/internal/core-events';
import { themes } from 'storybook/theming';

const { listeners, setConfig, setOptions } = vi.hoisted(() => ({
  listeners: new Map<string, (event: { globals: Record<string, unknown> }) => void>(),
  setConfig: vi.fn(),
  setOptions: vi.fn(),
}));

vi.mock('storybook/manager-api', () => ({
  addons: {
    setConfig,
    register: (_id: string, register: (api: {
      on: (event: string, listener: (event: { globals: Record<string, unknown> }) => void) => void;
      setOptions: typeof setOptions;
    }) => void) => register({
      on: (event, listener) => { listeners.set(event, listener); },
      setOptions,
    }),
  },
}));

import './manager';
import preview from './preview';
import { applyPreviewTheme } from './theme';

describe('Storybook theme', () => {
  it('includes earlier WCAG rules so AA contrast is not excluded', () => {
    expect(preview.parameters?.a11y.config.runOnly).toEqual({
      type: 'tag',
      values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'],
    });
  });
  it('builds baseline token scopes so nested theme comparisons do not inherit another mode', () => {
    expect(portableTokens).toContain(':root, .light, .dark, .high-contrast {');
  });

  it('defaults the manager and previews to dark', () => {
    expect(setConfig).toHaveBeenCalledWith({ theme: themes.dark });
    expect(preview.initialGlobals).toEqual({ theme: 'dark' });
  });

  it('synchronizes the manager with a light-mode direct link on initialization', () => {
    expect(listeners.has(SET_GLOBALS)).toBe(true);
    listeners.get(SET_GLOBALS)!({ globals: { theme: 'light' } });
    expect(setOptions).toHaveBeenLastCalledWith({ theme: themes.light });
  });

  it('switches the manager to light and back to dark with the toolbar', () => {
    expect(listeners.has(GLOBALS_UPDATED)).toBe(true);
    listeners.get(GLOBALS_UPDATED)!({ globals: { theme: 'light' } });
    expect(setOptions).toHaveBeenLastCalledWith({ theme: themes.light });
    listeners.get(GLOBALS_UPDATED)!({ globals: { theme: 'dark' } });
    expect(setOptions).toHaveBeenLastCalledWith({ theme: themes.dark });
  });

  it('applies and removes the dark token scope as the preview theme changes', () => {
    applyPreviewTheme('dark');
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    expect(document.documentElement).toHaveClass('dark');
    applyPreviewTheme('light');
    expect(document.documentElement).toHaveAttribute('data-theme', 'light');
    expect(document.documentElement).not.toHaveClass('dark');
  });
});
