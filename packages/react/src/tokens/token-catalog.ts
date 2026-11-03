import primitivesSource from '../../../tokens/src/primitives.css?raw';
import semanticSource from '../../../tokens/src/semantic.css?raw';
import buttonSource from '../../../tokens/src/components/button.css?raw';
import fieldSource from '../../../tokens/src/components/field.css?raw';
import inputSource from '../../../tokens/src/components/input.css?raw';
import labelSource from '../../../tokens/src/components/label.css?raw';
import menuSource from '../../../tokens/src/components/menu.css?raw';
import sharedSource from '../../../tokens/src/components/shared-controls.css?raw';
import statusSource from '../../../tokens/src/components/status.css?raw';
import supportingSource from '../../../tokens/src/components/supporting-text.css?raw';
import switchSource from '../../../tokens/src/components/switch.css?raw';
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
  button: buttonSource, field: fieldSource, input: inputSource, label: labelSource,
  menu: menuSource,
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

const usages: Record<string, string> = {
  'surface-sunken': 'Fill recessed regions such as control tracks, wells, and code blocks.',
  'surface-sunken-soft': 'Fill subtly recessed sections where the standard sunken surface is too strong.',
  'surface-default': 'Fill flat primary content regions and containers with no elevation.',
  'surface-raised': 'Fill elevated cards and panels; use shadow to reinforce elevation.',
  'surface-overlay': 'Fill floating dialogs, popovers, and menus; this is not the backdrop scrim.',
  'surface-panel': 'Fill persistent side panels, detail panes, and structural application chrome.',
  'surface-tooltip': 'Fill brief tooltip bubbles; pair with a foreground suitable for the dark surface.',
  'surface-white': 'Keep a surface white in every mode only when the content requires that invariant.',
  'surface-disabled': 'Fill disabled controls; pair with disabled foreground and border roles.',
  'surface-inverse': 'Fill an inverted badge or callout that contrasts with the surrounding theme.',
  'surface-deep': 'Fill always-dark immersive regions; pair with on-deep foreground roles.',
  'surface-white-hover': 'Concrete hover fill on a white surface when an overlay cannot be composed.',
  'surface-white-pressed': 'Concrete pointer-down fill on a white surface when an overlay cannot be composed.',
  'text-primary': 'Render body text and headings requiring the highest content emphasis.',
  'text-secondary': 'Render subtitles, metadata, supporting text, and secondary labels.',
  'text-muted': 'Render tertiary information; do not use for essential content without checking contrast.',
  'text-disabled': 'Render text in disabled controls, not ordinary secondary content.',
  'text-placeholder': 'Render input placeholder hints; never replace the accessible label.',
  'text-inverse': 'Render content on an inverse surface; verify the foreground/background pairing.',
  'text-on-accent': 'Render text on an accent fill; verify the actual fill provides sufficient contrast.',
  'text-on-deep': 'Render text on always-dark immersive surfaces.',
  'border-default': 'Separate standard containers and regions with a visible boundary.',
  'border-subtle': 'Draw low-emphasis dividers and boundaries.',
  'border-strong': 'Emphasize selected regions or substantial section boundaries.',
  'border-control': 'Draw the resting boundary of form controls and switch tracks.',
  'border-control-hover': 'Draw the hovered boundary of an enabled form control.',
  'border-disabled': 'Draw the boundary of a disabled control.',
  'border-focus': 'Identify keyboard focus; do not use as the normal control boundary.',
  'interactive-solid': 'Fill primary solid actions; pair with interactive-on-solid.',
  'interactive-solid-hover': 'Replace a solid action fill during pointer hover.',
  'interactive-solid-pressed': 'Replace a solid action fill during temporary pointer-down activation.',
  'interactive-solid-selected': 'Fill a persistently selected solid action; distinct from temporary pointer-down.',
  'interactive-on-solid': 'Render text or icons on a solid interactive fill.',
  'interactive-surface': 'Fill soft interactive controls at rest.',
  'interactive-surface-hover': 'Composite a translucent hover layer over the existing interactive surface.',
  'interactive-surface-pressed': 'Composite a translucent pointer-down layer over the existing interactive surface.',
  'interactive-surface-selected': 'Replace the base fill for persistently selected rows, chips, or toggles.',
  'interactive-surface-foreground': 'Render text or icons on soft or selected interactive surfaces.',
  'interactive-fg': 'Render links, ghost-action labels, and interactive icons on ordinary surfaces.',
  'interactive-fg-variant': 'Render stronger interactive foregrounds on tinted surfaces.',
  'interactive-hover': 'Alias for the interactive hover overlay; not a solid brand fill.',
  'interactive-pressed': 'Render a solid action during temporary pointer-down activation.',
  'interactive-disabled': 'Fill disabled interactive elements; pair with disabled content roles.',
  'interactive-border-default': 'Draw resting boundaries on outlined actions and selectable containers.',
  'interactive-border-strong': 'Emphasize hovered or active outlined interactive containers.',
  'interactive-focus-ring': 'Draw the shared keyboard-focus indicator around interactive controls.',
  'field-gap': 'Space the label, control, helper text, and error vertically within one Field.',
};

const stateUsages: Record<string, string> = {
  solid: 'Solid status fill; pair with the matching on-solid foreground.',
  'solid-hover': 'Solid status fill during pointer hover.',
  'solid-pressed': 'Solid status fill during temporary pointer-down activation.',
  'solid-selected': 'Solid status fill for persistent selection.',
  'on-solid': 'Text and icons on the matching solid status fill.',
  surface: 'Soft status-tinted background for badges, messages, and containers.',
  'surface-hover': 'Translucent status hover overlay; composite over an existing surface.',
  'surface-pressed': 'Translucent status pointer-down overlay; composite over an existing surface.',
  'surface-selected': 'Persistent selected status treatment; preserve any authored transparency.',
  'interactive-surface': 'Status-tinted base surface for interactive status controls.',
  fg: 'Status text and icons on ordinary or appropriately paired soft surfaces.',
  'subtle-text': 'Stronger status text on a matching soft background; verify contrast in each mode.',
  border: 'Standard boundary for a status-tinted container.',
  'border-strong': 'Emphasized status boundary, including validation-error control boundaries.',
};

export function tokenUsage(name: string): string {
  const role = name.replace(/^--system-/, '');
  if (role.startsWith('spacer-')) {
    const [, unit, size] = role.split('-');
    return `Use ${size} spacing for layout gaps, padding, and margins. ${unit === 'rem' ? 'Scales with the root font size; preferred for application layout.' : 'Pixel-exact spacing; use only when fixed geometry is required.'}`;
  }
  if (usages[role]) return usages[role];
  const status = role.match(/^status-(error|success|warning|info|neutral)-(.+)$/);
  if (status && stateUsages[status[2]]) return `${status[1]}: ${stateUsages[status[2]]}`;
  if (role.startsWith('status-status-breakdown-')) {
    return `Identify the ${role.slice('status-status-breakdown-'.length).replace(/-/g, ' ')} workflow state in status breakdowns; also provide a text label.`;
  }
  if (role.startsWith('status-')) {
    return tokenUsage(`--system-text-${role.slice(7).replace(/^text-/, '')}`);
  }
  if (role.startsWith('icon-')) {
    const purpose = role.slice(5);
    return `Render ${purpose.replace(/-/g, ' ')} icons; preserve the semantic surface/state pairing and provide an accessible name for actionable icons.`;
  }
  if (role.startsWith('deep-')) return `Composite the ${role.slice(5)} state tint over an always-dark deep surface.`;
  if (role.startsWith('control-thumb-')) return `Set the movable control thumb's ${role.slice(14).replace(/-/g, ' ')}; do not substitute text colors.`;
  if (role.startsWith('switch-')) return `Set the Switch ${role.slice(7).replace(/-/g, ' ')} dimension; preserve the track/thumb geometry.`;
  if (/^(label|supporting-text)-/.test(role)) return `Set the ${role.replace(/-/g, ' ')} font shorthand (weight, size, line height, family); use on the matching form-text size.`;
  if (role.startsWith('supporting-icon-')) return `Set the ${role.slice(16)} supporting-text icon size; align its slot to the first text line.`;
  if (role.startsWith('input-text-')) return `Set the ${role.slice(11)} Input/Textarea font shorthand (weight, size, line height, family).`;
  if (role.startsWith('input-')) return `Set ${role.slice(6).replace(/-/g, ' ')} for Input and Textarea geometry; height is a minimum, padding x/y means horizontal/vertical inset.`;
  if (role === 'text-inline-gap') return 'Space inline text, indicators, and supporting-text icons.';
  if (name.startsWith('--component-')) return `Compatibility role: set ${name.slice(12).replace(/-/g, ' ')}; prefer a system role when one exists.`;
  if (name.startsWith('--space-')) return 'Compatibility spacing role for control padding and layout gaps.';
  if (name.startsWith('--radius-')) return 'Compatibility corner radius for standard controls.';
  if (name.startsWith('--interactive-focus-ring-')) return `Set focus-ring ${name.endsWith('width') ? 'band thickness' : 'surface-colored separation'}; pair with the shared focus color.`;
  if (name === '--motion-interactive') return 'Duration in milliseconds for short interactive state transitions.';
  throw new Error(`Missing usage description: ${name}`);
}
