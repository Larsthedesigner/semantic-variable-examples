import { describe, expect, it } from 'vitest';
import styles from '../styles.css?raw';

describe('Select indicator styles', () => {
  it('reserves space for an inset indicator and places it at the inline end', () => {
    expect(styles).toContain('padding-inline-end: calc(2 * var(--system-spacer-rem-sm) + var(--size-px-8));');
    expect(styles).toContain('right calc(var(--system-spacer-rem-sm) + var(--size-px-4)) center,');
    expect(styles).toContain('.svx-text-control.svx-select:dir(rtl) {');
    expect(styles).toContain('left calc(var(--system-spacer-rem-sm) + var(--size-px-4)) center;');
  });

  it('restores the native indicator in forced colors', () => {
    expect(styles).toContain(`@media (forced-colors: active) {
  .svx-text-control.svx-select {
    appearance: auto;
    background-image: none;
  }
}`);
  });
});
