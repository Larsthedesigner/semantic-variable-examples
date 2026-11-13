// @vitest-environment jsdom
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Container, Grid, Inline, Stack, layoutBreakpoints, layoutGaps } from './layout';
import { primitiveTokens, tokenCatalog } from '../tokens/token-catalog';
import queries from '../../../tokens/dist/css/layout-queries.css?raw';
import querySource from '../../../tokens/src/layout-queries.css?raw';

describe('Layout foundations', () => {
  it('keeps div refs for default layouts and types child refs in asChild mode', () => {
    const sectionRef = createRef<HTMLElement>();
    const defaults = [
      <Container ref={createRef<HTMLDivElement>()} />,
      <Stack ref={createRef<HTMLDivElement>()} />,
      <Grid ref={createRef<HTMLDivElement>()} />,
    ];
    const composition = <Stack asChild><section ref={sectionRef}>Content</section></Stack>;
    void defaults;
    render(composition);
    expect(sectionRef.current?.tagName).toBe('SECTION');
  });

  it('rejects wrapper refs when a layout renders its child element', () => {
    const divRef = createRef<HTMLDivElement>();
    // @ts-expect-error In asChild mode, put a correctly typed ref on the child.
    const invalid = <Container asChild ref={divRef}><main /></Container>;
    void invalid;
  });

  it('forwards refs, native attributes, and prescribed defaults without adding roles', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Stack ref={ref} data-testid="stack" className="custom" aria-label="Content"><span>Child</span></Stack>);
    const stack = screen.getByTestId('stack');
    expect(ref.current).toBe(stack);
    expect(stack).toHaveClass('svx-stack', 'custom');
    expect(stack).toHaveAttribute('data-gap', 'lg');
    expect(stack).not.toHaveAttribute('role');
    expect(stack).not.toHaveAttribute('style');
  });
  it('supports semantic child markup without an extra wrapper', () => {
    render(<Container asChild size="reading"><main data-testid="page">
      <Stack asChild gap="xl"><section aria-label="Projects">
        <Grid asChild preset="equal-2" gap="sm"><ul><li>One</li><li>Two</li></ul></Grid>
      </section></Stack>
    </main></Container>);
    expect(screen.getByRole('main')).toHaveClass('svx-container');
    expect(screen.getByRole('main')).toHaveAttribute('data-size', 'reading');
    expect(screen.getByRole('region')).toHaveClass('svx-stack');
    expect(screen.getByRole('list')).toHaveClass('svx-grid');
    expect(screen.getByRole('list')).toHaveAttribute('data-gap', 'sm');
  });
  it('supplies an explicit container-query wrapper and preserves child order', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Inline ref={ref} data-testid="inline" stackBelow="xs" gap="md" align="end" justify="end">
      <button>Cancel</button><button>Save</button>
    </Inline>);
    expect(ref.current).toBe(screen.getByTestId('inline'));
    const inner = ref.current?.firstElementChild;
    expect(inner).toHaveClass('svx-inline');
    expect(inner).toHaveAttribute('data-stack-below', 'xs');
    expect(inner).toHaveAttribute('data-align', 'end');
    expect(inner).toHaveAttribute('data-justify', 'end');
    expect(screen.getAllByRole('button').map(button => button.textContent)).toEqual(['Cancel', 'Save']);
  });
  it('provides every gap and breakpoint with a single source of threshold values', () => {
    expect(layoutGaps).toEqual(['none', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl']);
    expect(layoutBreakpoints.map(size => primitiveTokens[`--breakpoint-${size}`]))
      .toEqual(['480px', '768px', '992px', '1280px', '1440px', '1920px']);
    for (const size of layoutBreakpoints) {
      expect(querySource).toContain(`@container svx-below-${size}`);
      expect(queries).toContain(`@container (width < ${primitiveTokens[`--breakpoint-${size}`]})`);
      expect(queries).toContain(`.svx-inline-container > .svx-inline[data-stack-below='${size}']`);
    }
    expect(queries).toContain('@media (width >= 768px)');
    expect(queries).not.toMatch(/@(?:media|container) svx-/);
  });
  it.each(['light', 'dark', 'high-contrast'] as const)('resolves layout roles without changing color semantics in %s', mode => {
    const tokens = tokenCatalog(mode).filter(token => token.name.startsWith('--system-layout-'));
    expect(tokens).toHaveLength(8);
    expect(tokens.find(token => token.name.endsWith('size-fill'))?.value).toBe('100%');
    expect(tokens.find(token => token.name.endsWith('viewport-block-size'))?.value).toBe('100dvh');
    expect(tokens.find(token => token.name.endsWith('width-reading'))?.value).toBe('40rem');
    expect(tokenCatalog(mode, 'layout')).toHaveLength(8);
  });
});
