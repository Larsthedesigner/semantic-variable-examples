import { DocsContainer, type DocsContainerProps } from '@storybook/addon-docs/blocks';
import { useEffect, useSyncExternalStore, type PropsWithChildren } from 'react';
import { GLOBALS_UPDATED, SET_GLOBALS } from 'storybook/internal/core-events';
import { themes } from 'storybook/theming';
import { applyPreviewTheme } from './theme';

export function ThemedDocsContainer({ context, children }: PropsWithChildren<DocsContainerProps>) {
  const { channel } = context;
  const theme = useSyncExternalStore(
    (notify) => {
      channel.on(SET_GLOBALS, notify);
      channel.on(GLOBALS_UPDATED, notify);
      return () => {
        channel.off(SET_GLOBALS, notify);
        channel.off(GLOBALS_UPDATED, notify);
      };
    },
    () => {
      const event: { globals?: Record<string, unknown> } | undefined =
        channel.last(GLOBALS_UPDATED)?.[0] ?? channel.last(SET_GLOBALS)?.[0];
      return event?.globals?.theme === 'light' ? 'light' : 'dark';
    },
  );

  useEffect(() => {
    applyPreviewTheme(theme);
  }, [theme]);

  return <DocsContainer context={context} theme={themes[theme]}>{children}</DocsContainer>;
}
