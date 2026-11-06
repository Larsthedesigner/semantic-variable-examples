import primitivesSource from '../../../tokens/src/primitives.css?raw';
import semanticSource from '../../../tokens/src/semantic.css?raw';
import buttonSource from '../../../tokens/src/components/button.css?raw';
import fieldSource from '../../../tokens/src/components/field.css?raw';
import inputSource from '../../../tokens/src/components/input.css?raw';
import labelSource from '../../../tokens/src/components/label.css?raw';
import layoutSource from '../../../tokens/src/components/layout.css?raw';
import menuSource from '../../../tokens/src/components/menu.css?raw';
import sharedSource from '../../../tokens/src/components/shared-controls.css?raw';
import statusSource from '../../../tokens/src/components/status.css?raw';
import supportingSource from '../../../tokens/src/components/supporting-text.css?raw';
import switchSource from '../../../tokens/src/components/switch.css?raw';
import skeletonSource from '../../../tokens/src/components/skeleton.css?raw';
import selectionSource from '../../../tokens/src/components/selection-controls.css?raw';
import tooltipSource from '../../../tokens/src/components/tooltip.css?raw';

export type TokenMode = 'light' | 'dark' | 'high-contrast';
type TokenMap = Record<string, string>;

function declarations(source: string): TokenMap {
  return Object.fromEntries([...source.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)]
    .map((match) => [match[1], match[2].trim().replace(/\s+/g, ' ')]));
}

function block(source: string, selector: string) {
  const css = source.replace(/\/\*[\s\S]*?\*\//g, '');
  const start = css.indexOf(`${selector} {`);
  if (start === -1) throw new Error(`Missing token block: ${selector}`);
  const contentStart = css.indexOf('{', start) + 1;
  return declarations(css.slice(contentStart, css.indexOf('}', contentStart)));
}

export const primitiveTokens = block(primitivesSource, '@theme static');
const semanticBase = block(semanticSource, '@theme static');
const componentSources: Record<string, string> = {
  button: buttonSource, field: fieldSource, input: inputSource, label: labelSource, layout: layoutSource,
  menu: menuSource, skeleton: skeletonSource, 'selection-controls': selectionSource,
  'shared-controls': sharedSource, status: statusSource,
  'supporting-text': supportingSource, switch: switchSource, tooltip: tooltipSource,
};
function componentValues(mode: TokenMode, owner?: string) {
  return Object.assign({}, ...Object.entries(componentSources)
    .filter(([name]) => !owner || name === owner)
    .map(([, source]) => ({
      ...block(source, '@theme static'),
      ...(mode !== 'light' && source.includes(`.${mode} {`) ? block(source, `.${mode}`) : {}),
    }))) as TokenMap;
}
const overrides = {
  light: {},
  dark: block(semanticSource, '.dark'),
  'high-contrast': block(semanticSource, '.high-contrast'),
};

export function tokenCatalog(mode: TokenMode, owner?: string) {
  const semantics = { ...semanticBase, ...overrides[mode] };
  const lookup = { ...primitiveTokens, ...semantics, ...componentValues(mode) };
  function resolve(name: string, path: string[] = []): string {
    if (path.includes(name)) throw new Error(`Token cycle: ${[...path, name].join(' -> ')}`);
    const value = lookup[name];
    if (value === undefined) throw new Error(`Missing token: ${name}`);
    return value.replace(/var\((--[\w-]+)\)/g, (_, reference: string) =>
      resolve(reference, [...path, name]));
  }
  function primitiveReferences(name: string, path: string[] = []): string[] {
    if (path.includes(name)) throw new Error(`Token cycle: ${name}`);
    if (!(name in lookup)) throw new Error(`Missing token: ${name}`);
    return [...new Set([
      ...(name in primitiveTokens ? [name] : []),
      ...[...lookup[name].matchAll(/var\((--[\w-]+)\)/g)]
        .flatMap((match) => primitiveReferences(match[1], [...path, name])),
    ])];
  }
  const entries = owner ? componentValues(mode, owner) : semantics;
  return Object.entries(entries).filter(([name]) => owner || name.startsWith('--system-')).map(([name, expression]) => ({
    name, expression, value: resolve(name), primitives: primitiveReferences(name),
    usage: owner ? `Configure ${owner} ${name.replace(/^--component-/, '').replace(/-/g, ' ')}; colors follow theme roles and dimensions follow primitive scales.` : tokenUsage(name),
  }));
}

const semanticUsages = Object.fromEntries(
  [...semanticSource.matchAll(/^\s*(--system-[\w-]+):[^;]+;[ \t]*\/\* (.*?) \*\//gm)]
    .map(([, name, usage]) => [name, usage]),
);

export function tokenUsage(name: string): string {
  const usage = semanticUsages[name];
  if (!usage) throw new Error(`Missing usage description: ${name}`);
  return usage;
}
