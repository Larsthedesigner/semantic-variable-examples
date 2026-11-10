import { describe, expect, it } from 'vitest';
import { tokenCatalog } from './token-catalog';

type RGB = [number, number, number];
const tokens = Object.fromEntries(tokenCatalog('dark').map(token => [token.name, token.value]));
const color = (name: string) => tokens[`--system-${name}`];

function hex(value: string): RGB {
  if (!/^#[\da-f]{6}$/i.test(value)) throw new Error(`Expected six-digit hex: ${value}`);
  return [parseInt(value.slice(1, 3), 16), parseInt(value.slice(3, 5), 16), parseInt(value.slice(5, 7), 16)];
}

function composite(value: string, background: RGB): RGB {
  if (value.startsWith('#')) return hex(value);
  const mix = /^color-mix\(in srgb, (#[\da-f]{6}) (\d+)%, transparent\)$/i.exec(value);
  if (!mix) throw new Error(`Unsupported contrast-test color: ${value}`);
  const foreground = hex(mix[1]);
  const alpha = Number(mix[2]) / 100;
  return [
    foreground[0] * alpha + background[0] * (1 - alpha),
    foreground[1] * alpha + background[1] * (1 - alpha),
    foreground[2] * alpha + background[2] * (1 - alpha),
  ];
}

function luminance(rgb: RGB) {
  const channels = rgb.map(channel => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function contrast(foreground: string, background: RGB) {
  const a = luminance(composite(foreground, background));
  const b = luminance(background);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

describe('dark-mode contrast', () => {
  const families = ['interactive', 'status-neutral', 'status-error', 'status-success', 'status-warning', 'status-info'];
  const surfaces = ['default', 'raised', 'sunken'];

  it.each(families)('keeps %s text readable through composited states', family => {
    for (const surface of surfaces) {
      const background = hex(color(`surface-${surface}`));
      for (const base of ['transparent', 'surface', 'interactive-surface']) {
        if (family === 'interactive' && base === 'interactive-surface') continue;
        const resting = base === 'transparent' ? background : composite(color(`${family}-${base}`), background);
        for (const state of ['', '-hover', '-pressed', '-selected']) {
          const fill = state ? composite(color(`${family}-surface${state}`), resting) : resting;
          expect(contrast(color(`${family}-fg`), fill), `${family} ${surface} ${base}${state}`).toBeGreaterThanOrEqual(4.5);
        }
      }
    }
  });

  it('keeps selected Toggle text readable without changing solid-action foregrounds', () => {
    const resting = hex(color('interactive-surface-selected'));
    for (const state of ['', '-hover', '-pressed']) {
      const fill = state ? composite(color(`interactive-surface${state}`), resting) : resting;
      expect(contrast(color('interactive-surface-foreground'), fill), `toggle${state}`).toBeGreaterThanOrEqual(4.5);
    }
    for (const family of families) {
      for (const state of ['', '-hover', '-pressed', '-selected']) {
        expect(contrast(color(`${family}-on-solid`), hex(color(`${family}-solid${state}`))), `${family}${state}`).toBeGreaterThanOrEqual(4.5);
      }
    }
  });

  it('keeps the documented subtle error foreground readable on its surface', () => {
    expect(contrast(color('status-error-subtle-text'), hex(color('status-error-surface')))).toBeGreaterThanOrEqual(4.5);
  });

  it('keeps disabled content legible on all supported neutral surfaces', () => {
    for (const surface of [...surfaces, 'disabled']) {
      for (const foreground of ['text-disabled', 'icon-disabled']) {
        expect(contrast(color(foreground), hex(color(`surface-${surface}`))), `${foreground} ${surface}`).toBeGreaterThanOrEqual(3);
      }
    }
    expect(contrast(color('text-disabled'), hex(color('interactive-disabled')))).toBeGreaterThanOrEqual(3);
  });

  it('separates solid button boundaries from default and raised surfaces', () => {
    const border = tokenCatalog('dark', 'button').find(token => token.name === '--component-button-solid-border');
    expect(border).toBeDefined();
    for (const surface of ['default', 'raised']) {
      expect(contrast(border!.value, hex(color(`surface-${surface}`))), surface).toBeGreaterThanOrEqual(3);
    }
    for (const mode of ['light', 'high-contrast'] as const) {
      expect(tokenCatalog(mode, 'button').find(token => token.name === '--component-button-solid-border')?.value).toBe('transparent');
    }
  });

  it('keeps the menu outline distinct from both the highlighted and resting surfaces', () => {
    const resting = hex(color('surface-raised'));
    const highlighted = composite(color('interactive-surface-hover'), resting);
    for (const background of [resting, highlighted]) {
      expect(contrast(color('interactive-focus-ring'), background)).toBeGreaterThanOrEqual(3);
    }
  });
});
