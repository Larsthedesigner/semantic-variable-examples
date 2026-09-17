import type { Preview } from '@storybook/react';
import '../src/styles.css';

const preview: Preview = {
  parameters: {
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
      description: 'Global theme for components',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: ['light', 'dark'],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      document.documentElement.dataset.theme = context.globals.theme ?? 'light';
      return Story();
    },
  ],
};

export default preview;
