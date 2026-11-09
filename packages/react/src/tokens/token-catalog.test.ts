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
  it.each(['light', 'dark', 'high-contrast'] as const)('maps component shapes through shared radius semantics in %s', mode => {
    const radii = tokenCatalog(mode).filter(token => token.name.startsWith('--system-radius-'));
    expect(Object.fromEntries(radii.map(token => [token.name.replace('--system-radius-', ''), token.value]))).toEqual({
      none: '0', xs: '0.125rem', sm: '0.25rem', md: '0.5rem', lg: '0.625rem',
      xl: '1rem', '2xl': '1.5rem', full: '50%', pill: '9999px',
    });
    for (const owner of ['button', 'input', 'card', 'selection-controls', 'switch', 'skeleton']) {
      const tokens = tokenCatalog(mode, owner).filter(token => token.name.includes('radius'));
      expect(tokens.length).toBeGreaterThan(0);
      for (const token of tokens) {
        expect(token.expression).toMatch(/^var\(--system-radius-[\w-]+\)$/);
        expect(token.value).not.toContain('var(');
      }
    }
  });
  it.each(['light', 'dark', 'high-contrast'] as const)('resolves dialog and popover component tokens in %s', mode => {
    for (const [owner, expectedSurface] of [
      ['dialog', '--component-dialog-surface'],
      ['popover', '--component-popover-surface'],
    ]) {
      const tokens = tokenCatalog(mode, owner);
      expect(tokens.length).toBeGreaterThan(0);
      for (const token of tokens) expect(token.value).not.toContain('var(');
      expect(tokens.find(token => token.name === expectedSurface)?.expression).toBe('var(--system-surface-overlay)');
      expect(tokens.find(token => token.name === expectedSurface)?.value)
        .toBe(tokenCatalog(mode).find(token => token.name === '--system-surface-overlay')?.value);
    }
    const scrim = tokenCatalog(mode).find(token => token.name === '--system-scrim');
    const overlay = tokenCatalog(mode, 'dialog').find(token => token.name === '--component-dialog-overlay');
    expect(scrim?.value).toBe('color-mix(in srgb, #000000 48%, transparent)');
    expect(overlay?.expression).toBe('var(--system-scrim)');
    expect(overlay?.value).toBe(scrim?.value);
  });
  it.each(['light', 'dark', 'high-contrast'] as const)('resolves shared selection-control tokens in %s', mode => {
    const catalog = tokenCatalog(mode, 'selection-controls');
    expect(catalog).toHaveLength(11);
    for (const token of catalog) expect(token.value).not.toContain('var(');
    expect(catalog.find(token => token.name === '--component-choice-size-md')?.value).toBe('1rem');
    expect(catalog.find(token => token.name === '--component-choice-gap')?.value).toBe('0.5rem');
    expect(catalog.find(token => token.name === '--component-choice-selected')?.value)
      .toBe(tokenCatalog(mode).find(token => token.name === '--system-interactive-solid')?.value);
  });
  it('uses the inline base-declaration comment for every system usage', () => {
    const base = semanticSource.slice(semanticSource.indexOf('@theme static {'), semanticSource.indexOf('\n}', semanticSource.indexOf('@theme static {')));
    const documented = [...base.matchAll(/^\s*(--system-[\w-]+):[^;]+;[ \t]*\/\* (.*?) \*\//gm)];
    expect(documented).toHaveLength(208);
    for (const [, name, usage] of documented) expect(tokenUsage(name)).toBe(usage);
    expect(() => tokenUsage('--system-undocumented')).toThrow('Missing usage description');
  });
  it.each(['neutral', 'blue', 'error', 'success', 'warning', 'info'])('has exactly 12 progressively darker %s stops', (family) => {
    const ramp = Object.entries(primitiveTokens).filter(([name]) => name.startsWith(`--color-${family}-`));
    expect(ramp.map(([name]) => name)).toEqual(Array.from({ length: 12 }, (_, index) => `--color-${family}-${(index + 1) * 100}`));
    const lightness = ramp.map(([, value]) => luminance(value));
    for (let index = 1; index < lightness.length; index++) expect(lightness[index]).toBeLessThan(lightness[index - 1]);
  });

  it('keeps light neutrals achromatic and progressively increases blue tint in darker stops', () => {
    for (const stop of [100, 200, 300, 400, 500, 600]) {
      const hex = primitiveTokens[`--color-neutral-${stop}`];
      expect(hex.slice(1, 3)).toBe(hex.slice(3, 5));
      expect(hex.slice(3, 5)).toBe(hex.slice(5, 7));
    }
    let previousBlueBias = 0;
    for (const stop of [700, 800, 900, 1000, 1100, 1200]) {
      const hex = primitiveTokens[`--color-neutral-${stop}`];
      const [red, green, blue] = [1, 3, 5].map(offset => parseInt(hex.slice(offset, offset + 2), 16));
      expect(blue).toBeGreaterThan(green);
      expect(green).toBeGreaterThan(red);
      const blueBias = (blue - red) / (blue + red);
      expect(blueBias).toBeGreaterThan(previousBlueBias);
      previousBlueBias = blueBias;
    }
  });

  it('keeps error pink-red and success vivid green without changing their status identities', () => {
    expect(primitiveTokens['--color-error-700']).toBe('#ff456b');
    expect(primitiveTokens['--color-success-700']).toBe('#39bb3d');
    for (let stop = 100; stop <= 1200; stop += 100) {
      const channels = (family: string) => [1, 3, 5].map(offset =>
        parseInt(primitiveTokens[`--color-${family}-${stop}`].slice(offset, offset + 2), 16));
      const [errorRed, errorGreen, errorBlue] = channels('error');
      expect(errorRed).toBeGreaterThan(errorBlue);
      expect(errorBlue).toBeGreaterThan(errorGreen);
      const [successRed, successGreen, successBlue] = channels('success');
      expect(successGreen).toBeGreaterThan(successRed);
      expect(successGreen).toBeGreaterThan(successBlue);
    }
  });

  it('keeps warning golden and info cyan-blue across all stops', () => {
    expect(primitiveTokens['--color-warning-600']).toBe('#ffb20a');
    expect(primitiveTokens['--color-info-700']).toBe('#159bc4');
    for (let stop = 100; stop <= 1200; stop += 100) {
      const channels = (family: string) => [1, 3, 5].map(offset =>
        parseInt(primitiveTokens[`--color-${family}-${stop}`].slice(offset, offset + 2), 16));
      const [warningRed, warningGreen, warningBlue] = channels('warning');
      expect(warningRed).toBeGreaterThan(warningGreen);
      expect(warningGreen).toBeGreaterThan(warningBlue);
      const [infoRed, infoGreen, infoBlue] = channels('info');
      expect(infoBlue).toBeGreaterThan(infoGreen);
      expect(infoGreen).toBeGreaterThan(infoRed);
    }
  });

  it('preserves the blue seed exactly and removes magenta', () => {
    expect(primitiveTokens['--color-blue-800']).toBe('#0166cc');
    expect(Object.keys(primitiveTokens).some(name => name.includes('magenta'))).toBe(false);
  });

  it('derives all blue stops from the seed using the documented sRGB tint and shade weights', () => {
    const seed = [1, 102, 204];
    const hex = (channels: number[]) => `#${channels.map(channel => Math.round(channel).toString(16).padStart(2, '0')).join('')}`;
    for (const [index, white] of [0.96, 0.92, 0.84, 0.72, 0.56, 0.38, 0.20].entries()) {
      expect(primitiveTokens[`--color-blue-${(index + 1) * 100}`])
        .toBe(hex(seed.map(channel => channel * (1 - white) + 255 * white)));
    }
    for (const [index, retained] of [0.80, 0.62, 0.44, 0.28].entries()) {
      expect(primitiveTokens[`--color-blue-${900 + index * 100}`])
        .toBe(hex(seed.map(channel => channel * retained)));
    }
  });

  it.each(['light', 'dark', 'high-contrast'] as const)('propagates the blue ramp to semantic roles in %s', mode => {
    const blueRoles = tokenCatalog(mode).filter(token => /^var\(--color-blue-\d+\)$/.test(token.expression));
    expect(blueRoles.length).toBeGreaterThan(0);
    for (const token of blueRoles) {
      expect(token.value).toBe(primitiveTokens[token.expression.slice(4, -1)]);
    }
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
    expect(catalog.length).toBe(208);
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

  it.each(['light', 'dark', 'high-contrast'] as const)('provides 14 complete typography bundles in %s', mode => {
    const catalog = tokenCatalog(mode);
    const types = catalog.filter(token => token.name.startsWith('--system-type-'));
    expect(types).toHaveLength(42);
    const expected = {
      h1: ['700', '2rem', '1.25'],
      h2: ['600', '1.5rem', 'calc(32 / 24)'],
      h3: ['600', '1.25rem', '1.4'],
      h4: ['600', '1.125rem', 'calc(28 / 18)'],
      h5: ['600', '1rem', '1.5'],
      h6: ['600', '0.875rem', 'calc(20 / 14)'],
      body: ['400', '1rem', '1.5'],
      'body-secondary': ['400', '1rem', '1.5'],
      'body-sm': ['400', '0.875rem', 'calc(20 / 14)'],
      'label-sm': ['500', '0.75rem', 'calc(16 / 12)'],
      'label-md': ['500', '0.875rem', 'calc(20 / 14)'],
      'label-lg': ['500', '1rem', '1.5'],
      caption: ['400', '0.75rem', 'calc(16 / 12)'],
      code: ['400', '0.875rem', 'calc(20 / 14)'],
    };
    for (const [type, [weight, size, ratio]] of Object.entries(expected)) {
      const font = types.find(token => token.name === `--system-type-${type}-font`);
      expect(font?.value).toBe(`${weight} ${size}/${ratio} ${primitiveTokens[type === 'code' ? '--font-family-mono' : '--font-family-sans']}`);
      expect(types.find(token => token.name === `--system-type-${type}-tracking`)).toBeDefined();
      const foreground = type.includes('secondary') || type === 'caption' ? '--system-text-secondary' : '--system-text-primary';
      expect(types.find(token => token.name === `--system-type-${type}-color`)?.value).toBe(catalog.find(token => token.name === foreground)?.value);
    }
  });

  it('uses Inter and removes unused body variants without breaking form typography mappings', () => {
    expect(primitiveTokens['--font-family-sans']).toMatch(/^'Inter Variable',/);
    const system = tokenCatalog('light');
    expect(system.some(token => token.name.startsWith('--system-type-body-sm-secondary-'))).toBe(false);
    for (const [size, role] of [['sm', 'label-sm'], ['md', 'label-md'], ['lg', 'label-lg']]) {
      const label = tokenCatalog('light', 'label');
      expect(label.find(token => token.name === `--component-label-${size}`)?.expression).toBe(`var(--system-type-${role}-font)`);
      expect(label.find(token => token.name === `--component-label-tracking-${size}`)?.expression).toBe(`var(--system-type-${role}-tracking)`);
    }
    for (const [size, role] of [['sm', 'caption'], ['md', 'caption'], ['lg', 'body-sm']]) {
      const supporting = tokenCatalog('light', 'supporting-text');
      expect(supporting.find(token => token.name === `--component-supporting-text-${size}`)?.expression).toBe(`var(--system-type-${role}-font)`);
      expect(supporting.find(token => token.name === `--component-supporting-text-tracking-${size}`)?.expression).toBe(`var(--system-type-${role}-tracking)`);
    }
  });

  it.each(['light', 'dark', 'high-contrast'] as const)('keeps secondary text readable and deliberately emphasized in %s', mode => {
    const tokens = Object.fromEntries(tokenCatalog(mode).map(token => [token.name, token.value]));
    const secondary = luminance(tokens['--system-text-secondary']);
    for (const surface of ['default', 'sunken', 'sunken-soft', 'raised', 'overlay', 'panel']) {
      const background = luminance(tokens[`--system-surface-${surface}`]);
      expect((Math.max(secondary, background) + 0.05) / (Math.min(secondary, background) + 0.05), `${mode} ${surface}`).toBeGreaterThanOrEqual(4.5);
    }
    if (mode === 'light') expect(tokens['--system-text-secondary']).toBe(primitiveTokens['--color-neutral-900']);
    if (mode === 'dark') expect(tokens['--system-text-secondary']).toBe(primitiveTokens['--color-neutral-600']);
    if (mode === 'high-contrast') expect(tokens['--system-text-secondary']).toBe(tokens['--system-text-primary']);
  });

  it('keeps component-owned roles out of app semantics and resolves owner catalogs', () => {
    const system = tokenCatalog('light');
    expect(system.some(token => /^--system-(switch|field|input|label|supporting|control-thumb|status-status-breakdown|surface-tooltip)/.test(token.name))).toBe(false);
    for (const mode of ['light', 'dark', 'high-contrast'] as const) {
      for (const owner of ['button', 'field', 'input', 'label', 'switch', 'skeleton', 'supporting-text', 'status', 'tooltip', 'shared-controls']) {
        const tokens = tokenCatalog(mode, owner);
        expect(tokens.length).toBeGreaterThan(0);
        for (const token of tokens) expect(token.value).not.toContain('var(');
      }
    }
  });

  it.each(['light', 'dark', 'high-contrast'] as const)('resolves reusable loading colors and animation in %s', mode => {
    const tokens = Object.fromEntries(tokenCatalog(mode).map(token => [token.name, token.value]));
    expect(tokens['--system-animation-loading-shimmer']).toBe('svx-loading-shimmer 1400ms linear infinite');
    expect(tokens['--system-loading-surface']).toBe(primitiveTokens[`--color-neutral-${mode === 'dark' ? 1000 : mode === 'high-contrast' ? 500 : 300}`]);
    expect(tokens['--system-loading-shimmer']).toContain(mode === 'dark' ? '12%' : '65%');
    const component = tokenCatalog(mode, 'skeleton');
    expect(component.find(token => token.name === '--component-skeleton-animation')?.value).toBe(tokens['--system-animation-loading-shimmer']);
    expect(component.find(token => token.name === '--component-skeleton-surface')?.value).toBe(tokens['--system-loading-surface']);
    expect(semanticSource).toContain('@keyframes svx-loading-shimmer');
    expect(semanticSource).toContain('--system-animation-loading-shimmer: none;');
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
