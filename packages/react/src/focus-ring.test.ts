import { describe, expect, it } from 'vitest';
import styles from './styles.css?raw';

describe('shared focus ring styles', () => {
  it('outlines highlighted menu items for keyboard and pointer navigation', () => {
    expect(styles).toContain(`.svx-menu-item[data-highlighted] {
  background-color: var(--system-interactive-surface-hover);
  outline: var(--interactive-focus-ring-width) solid var(--system-interactive-focus-ring);
  outline-offset: calc(-1 * var(--interactive-focus-ring-width));
}`);
    expect(styles).toContain('.svx-menu-item[data-highlighted] { outline-color: Highlight; }');
    expect(styles).toContain('.svx-menu-item[data-disabled] { color: GrayText; }');
  });

  it('keeps the normal shadow and provides a token-sized system outline in forced colors', () => {
    const element = document.createElement('style');
    element.textContent = styles.replace(/^@import.*$/gm, '');
    document.head.appendChild(element);

    try {
      const rules = Array.from(element.sheet!.cssRules);
      const normal = rules.find((rule): rule is CSSStyleRule =>
        rule.type === CSSRule.STYLE_RULE && (rule as CSSStyleRule).selectorText === '.svx-focus-ring:focus-visible');
      const forcedColors = rules.find((rule): rule is CSSMediaRule =>
        rule.type === CSSRule.MEDIA_RULE && (rule as CSSMediaRule).conditionText === '(forced-colors: active)' &&
        Array.from((rule as CSSMediaRule).cssRules).some(child =>
          child.type === CSSRule.STYLE_RULE && (child as CSSStyleRule).selectorText === '.svx-focus-ring:focus-visible'));
      const fallback = Array.from(forcedColors?.cssRules ?? []).find((rule): rule is CSSStyleRule =>
        rule.type === CSSRule.STYLE_RULE && (rule as CSSStyleRule).selectorText === '.svx-focus-ring:focus-visible');

      expect(normal?.style.getPropertyValue('outline')).toBe('none');
      expect(normal?.style.getPropertyValue('box-shadow')).toContain('var(--system-interactive-focus-ring)');
      expect(fallback?.style.getPropertyValue('outline')).toBe('var(--interactive-focus-ring-width) solid Highlight');
      expect(fallback?.style.getPropertyValue('outline-offset')).toBe('var(--interactive-focus-ring-offset)');
      expect(fallback?.style.getPropertyValue('box-shadow')).toBe('none');
      expect(rules.indexOf(forcedColors!)).toBeGreaterThan(rules.indexOf(normal!));
    } finally {
      element.remove();
    }
  });
});
