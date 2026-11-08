import { describe, expect, it } from 'vitest';
import styles from '../styles.css?raw';

describe('Button loading motion', () => {
  it('keeps the normal spinner animation but disables it for reduced motion', () => {
    const element = document.createElement('style');
    element.textContent = styles.replace(/^@import.*$/gm, '');
    document.head.appendChild(element);

    try {
      const rules = Array.from(element.sheet!.cssRules);
      const isSpinner = (rule: CSSRule): rule is CSSStyleRule =>
        rule.type === CSSRule.STYLE_RULE && (rule as CSSStyleRule).selectorText === '.svx-button__spinner';
      const normal = rules.find(isSpinner);
      const reducedMotion = rules.find((rule): rule is CSSMediaRule =>
        rule.type === CSSRule.MEDIA_RULE && (rule as CSSMediaRule).conditionText === '(prefers-reduced-motion: reduce)' &&
        Array.from((rule as CSSMediaRule).cssRules).some(isSpinner));
      const reduced = Array.from(reducedMotion?.cssRules ?? []).find(isSpinner);

      expect(normal?.style.getPropertyValue('animation')).toBe('svx-button-spin 0.8s linear infinite');
      expect(reduced?.style.getPropertyValue('animation')).toBe('none');
      expect(rules.indexOf(reducedMotion!)).toBeGreaterThan(rules.indexOf(normal!));
    } finally {
      element.remove();
    }
  });
});
