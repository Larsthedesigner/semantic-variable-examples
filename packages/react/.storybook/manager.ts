import { addons } from 'storybook/manager-api';
import { GLOBALS_UPDATED, SET_GLOBALS } from 'storybook/internal/core-events';
import { themes } from 'storybook/theming';

addons.setConfig({ theme: themes.dark });

addons.register('svx/theme', (api) => {
  const updateTheme = ({ globals }: { globals: Record<string, unknown> }) => {
    api.setOptions({ theme: globals.theme === 'light' ? themes.light : themes.dark });
  };
  api.on(SET_GLOBALS, updateTheme);
  api.on(GLOBALS_UPDATED, updateTheme);
});
