import type { Preview } from '@storybook/react-vite';
import { ThemedDocsContainer } from './docs-container';
import { applyPreviewTheme } from './theme';
import '../src/styles.css';
import '../src/material-symbols.css';
import './storybook.css';

const preview: Preview = {
  initialGlobals: { theme: 'dark' },
  parameters: {
    docs: { container: ThemedDocsContainer },
    options: { storySort: { order: ['Introduction', '*'] } },
    controls: { expanded: true },
    a11y: {
      // WCAG 3.0 uses APCA contrast + a broader set of outcomes than 2.x's
      // success criteria; until tooling catches up, we lint against the
      // strictest available ruleset (WCAG 2.2 AA) as a conservative proxy.
      config: {
        runOnly: { type: 'tag', values: ['wcag22aa'] },
      },
    },
  },

  globalTypes: {
    theme: {
      description: 'Theme for Storybook, documentation, and components',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: ['dark', 'light'],
        dynamicTitle: true,
      },
    },
  },

  decorators: [
    (Story, context) => {
      applyPreviewTheme(context.globals.theme);
      return Story();
    },
  ],

  tags: ['autodocs'],
};

export default preview;
