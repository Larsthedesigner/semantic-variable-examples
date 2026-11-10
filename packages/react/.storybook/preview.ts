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
      // Axe tags are additive: wcag22aa alone excludes earlier AA rules,
      // including color-contrast (wcag2aa).
      config: {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] },
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
