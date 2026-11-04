import { describe, expect, it } from 'vitest';
import { primitiveTokens, tokenCatalog, tokenUsage } from './token-catalog';
import semanticSource from '../../../tokens/src/semantic.css?raw';

function luminance(hex: string) {
  const channels = hex.slice(1).match(/../g);
  if (!channels || channels.length !== 3) throw new Error(`Expected six-digit hex: ${hex}`);
  const values = channels.map(channel => {
    const value = parseInt(channel, 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return values[0] * 0.2126 + values[1] * 0.7152 + values[2] * 0.0722;
}

describe('Token foundations', () => {
  it('uses the inline base-declaration comment for every system usage', () => {
    const base = semanticSource.slice(semanticSource.indexOf('@theme static {'), semanticSource.indexOf('\n}', semanticSource.indexOf('@theme static {')));
    const documented = [...base.matchAll(/^\s*(--system-[\w-]+):[^;]+;[ \t]*\/\* (.*?) \*\//gm)];
    expect(documented).toHaveLength(145);
    for (const [, name, usage] of documented) expect(tokenUsage(name)).toBe(usage);
    expect(() => tokenUsage('--system-undocumented')).toThrow('Missing usage description');
  });
  it.each(['neutral', 'blue', 'error', 'success', 'warning', 'info'])('has exactly 12 progressively darker %s stops', (family) => {
    const ramp = Object.entries(primitiveTokens).filter(([name]) => name.startsWith(`--color-${family}-`));
    expect(ramp.map(([name]) => name)).toEqual(Array.from({ length: 12 }, (_, index) => `--color-${family}-${(index + 1) * 100}`));
    const lightness = ramp.map(([, value]) => luminance(value));
    for (let index = 1; index < lightness.length; index++) expect(lightness[index]).toBeLessThan(lightness[index - 1]);
  });

  it('preserves Apple system blue exactly and removes magenta', () => {
    expect(primitiveTokens['--color-blue-800']).toBe('#007aff');
    expect(Object.keys(primitiveTokens).some(name => name.includes('magenta'))).toBe(false);
  });

  it('has identical px/rem step sets and equivalent baseline values', () => {
    const px = Object.keys(primitiveTokens).filter(name => /^--size-px-\d+$/.test(name));
    const rem = Object.keys(primitiveTokens).filter(name => /^--size-rem-\d+$/.test(name));
    expect(px).toHaveLength(14);
    expect(px.map(name => name.replace('-px-', '-rem-')).sort()).toEqual(rem.sort());
    for (const name of px) expect(parseFloat(primitiveTokens[name])).toBe(parseFloat(primitiveTokens[name.replace('-px-', '-rem-')]) * 16);
    expect(Object.keys(primitiveTokens).some(name => /^--size-\d+-/.test(name))).toBe(false);
  });

  it('includes intermediate and underlying primitive aliases for typography', () => {
    const font = tokenCatalog('light', 'input').find(token => token.name === '--component-input-text-md');
    expect(font?.primitives).toEqual(expect.arrayContaining([
      '--font-size-sm', '--size-rem-14', '--line-height-sm', '--size-rem-20', '--font-family-sans',
    ]));
  });

  it('routes component layout spacing through spacers without changing baseline values', () => {
    const expected: Record<string, Record<string, [string, string]>> = {
      button: {
        '--component-button-padding-x-sm': ['px-sm', '8px'],
        '--component-button-padding-x-md': ['px-md', '12px'],
        '--component-button-padding-x-lg': ['px-lg', '16px'],
        '--component-button-gap-sm': ['px-xs', '4px'],
        '--component-button-gap-md': ['px-sm', '8px'],
        '--component-button-gap-lg': ['px-md', '12px'],
      },
      input: {
        '--component-input-padding-x-sm': ['rem-sm', '0.5rem'],
        '--component-input-padding-x-md': ['rem-sm', '0.5rem'],
        '--component-input-padding-x-lg': ['rem-md', '0.75rem'],
        '--component-input-padding-y-sm': ['rem-2xs', '0.125rem'],
        '--component-input-padding-y-md': ['rem-xs', '0.25rem'],
      },
      label: { '--component-label-gap': ['rem-xs', '0.25rem'] },
      'supporting-text': { '--component-supporting-text-gap': ['rem-xs', '0.25rem'] },
      menu: {
        '--component-menu-padding': ['rem-xs', '0.25rem'],
        '--component-menu-item-padding-x': ['rem-md', '0.75rem'],
        '--component-menu-item-padding-y': ['rem-xs', '0.25rem'],
      },
    };
    for (const mode of ['light', 'dark', 'high-contrast'] as const) {
      for (const [owner, mappings] of Object.entries(expected)) {
        const catalog = tokenCatalog(mode, owner);
        for (const [name, [spacer, value]] of Object.entries(mappings)) {
          const token = catalog.find(entry => entry.name === name);
          expect(token?.expression).toBe(`var(--system-spacer-${spacer})`);
          expect(token?.value).toBe(value);
        }
      }
      expect(tokenCatalog(mode, 'field').find(token => token.name === '--component-field-gap')?.value).toBe('0.375rem');
      expect(tokenCatalog(mode, 'input').find(token => token.name === '--component-input-padding-y-lg')?.value).toBe('0.375rem');
      expect(tokenCatalog(mode, 'switch').find(token => token.name === '--component-switch-inset')?.expression).toBe('var(--size-px-2)');
    }
  });

  it.each(['light', 'dark', 'high-contrast'] as const)('documents and resolves every semantic token in %s', (mode) => {
    const catalog = tokenCatalog(mode);
    expect(catalog.length).toBe(145);
    for (const token of catalog) {
      expect(token.name).toMatch(/^--system-/);
      expect(token.value).not.toContain('var(');
      expect(token.expression).not.toContain('magenta');
      expect(token.usage.length).toBeGreaterThan(20);
      expect(token.usage).not.toContain('{status}');
      for (const [reference] of token.usage.matchAll(/--system-[\w-]+(?<!-)/g)) {
        expect(catalog.some(entry => entry.name === reference), `${token.name} usage references ${reference}`).toBe(true);
      }
      for (const primitive of token.primitives) expect(primitiveTokens[primitive]).toBeDefined();
    }
  });

  it('distinguishes foreground surface pairings and structural versus control boundaries', () => {
    expect(tokenUsage('--system-icon-deep')).toContain('intentionally receding');
    expect(tokenUsage('--system-icon-deep')).toContain('--system-icon-on-deep');
    expect(tokenUsage('--system-icon-on-deep')).toContain('--system-surface-deep');
    expect(tokenUsage('--system-text-inverse')).toContain('--system-surface-inverse');
    expect(tokenUsage('--system-interactive-surface-foreground')).toContain('--system-interactive-surface-selected');
    expect(tokenUsage('--system-border-subtle')).toContain('Do not substitute');
    expect(tokenUsage('--system-status-secondary')).toContain('status labels');
  });

  it.each(['error', 'success', 'warning', 'info', 'neutral'])('documents concrete %s status elements and companion roles', family => {
    expect(tokenUsage(`--system-status-${family}-fg`)).toContain('neutral content surfaces');
    expect(tokenUsage(`--system-status-${family}-fg`)).toContain(`--system-status-${family}-on-solid`);
    expect(tokenUsage(`--system-status-${family}-interactive-surface`)).toContain('filter chips');
    expect(tokenUsage(`--system-status-${family}-surface-selected`)).toContain('translucent');
    expect(tokenUsage(`--system-status-${family}-border-strong`).includes('invalid input')).toBe(family === 'error');
  });

  it.each(['light', 'dark', 'high-contrast'] as const)('has exact T-shirt spacer mappings in %s', (mode) => {
    const spacers = tokenCatalog(mode).filter(token => token.name.startsWith('--system-spacer-'));
    expect(spacers).toHaveLength(16);
    for (const [size, step] of Object.entries({ '2xs': 2, xs: 4, sm: 8, md: 12, lg: 16, xl: 24, '2xl': 32, '3xl': 40 })) {
      for (const unit of ['rem', 'px']) {
        const token = spacers.find(entry => entry.name === `--system-spacer-${unit}-${size}`);
        expect(token?.expression).toBe(`var(--size-${unit}-${step})`);
        expect(token?.value).toBe(`${unit === 'rem' ? step / 16 : step}${unit}`);
      }
    }
  });

  it('documents root-relative versus fixed CSS-pixel spacer behavior and intended consumers', () => {
    for (const size of ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl']) {
      expect(tokenUsage(`--system-spacer-rem-${size}`)).toContain('root font size');
      const fixedUsage = tokenUsage(`--system-spacer-px-${size}`);
      expect(fixedUsage).toContain('CSS-pixel');
      expect(fixedUsage).toContain('Unchanged by root font-size changes, but enlarged by page zoom');
    }
    expect(tokenUsage('--system-spacer-rem-xs')).toContain('supporting text and icon');
    expect(tokenUsage('--system-spacer-rem-md')).toContain('menu items');
    expect(tokenUsage('--system-spacer-px-md')).toContain('medium button');
    expect(tokenUsage('--system-spacer-rem-3xl')).toContain('responsive layout rules');
  });

  it('keeps component-owned roles out of app semantics and resolves owner catalogs', () => {
    const system = tokenCatalog('light');
    expect(system.some(token => /^--system-(switch|field|input|label|supporting|control-thumb|status-status-breakdown|surface-tooltip)/.test(token.name))).toBe(false);
    for (const mode of ['light', 'dark', 'high-contrast'] as const) {
      for (const owner of ['button', 'field', 'input', 'label', 'switch', 'supporting-text', 'status', 'tooltip', 'shared-controls']) {
        const tokens = tokenCatalog(mode, owner);
        expect(tokens.length).toBeGreaterThan(0);
        for (const token of tokens) expect(token.value).not.toContain('var(');
      }
    }
  });

  it.each(['light', 'dark', 'high-contrast'] as const)('keeps solid action text at least 4.5:1 in %s', (mode) => {
    const tokens = Object.fromEntries(tokenCatalog(mode).map(token => [token.name, token.value]));
    for (const family of ['interactive', 'status-error', 'status-success', 'status-warning', 'status-info', 'status-neutral']) {
      for (const state of ['', '-hover', '-pressed']) {
        const bg = luminance(tokens[`--system-${family}-solid${state}`]);
        const fg = luminance(tokens[`--system-${family}-on-solid`]);
        expect((Math.max(bg, fg) + 0.05) / (Math.min(bg, fg) + 0.05), `${mode} ${family}${state}`).toBeGreaterThanOrEqual(4.5);
      }
    }
  });
});
