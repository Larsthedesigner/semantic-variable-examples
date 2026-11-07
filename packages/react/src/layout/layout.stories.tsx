import { useId, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Container, Grid, Inline, Stack, layoutBreakpoints } from './layout';
import { Block, LayoutPage, Specimen, useLayoutMeasurement } from './layout-story-helpers';
import { Button } from '../button/button';
import { primitiveTokens } from '../tokens/token-catalog';
import { TokenReference } from '../tokens/token-reference';

const meta = { title: 'Foundations/Layout', parameters: { controls: { disable: true } } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
const thresholds = layoutBreakpoints.map(size => ({ size, width: parseInt(primitiveTokens[`--breakpoint-${size}`]) }));

export const Overview: Story = {
  render: () => <LayoutPage title="Layout foundations" description="Four primitives, one spacing vocabulary. Arrange content without assigning a surface, typography, or interaction.">
    <div className="sbx-layout-overview">{[
      ['Stack', 'Vertical flow', 'Related content and form sections.'],
      ['Inline', 'Row to stack', 'Actions respond to their parent width.'],
      ['Grid', 'Repeated content', 'Adaptive cards or fixed equal tracks.'],
      ['Container', 'Width and gutters', 'Bound page content and center it.'],
    ].map(([name, purpose, description]) => <section key={name}><h2>{name}</h2><strong>{purpose}</strong><p>{description}</p></section>)}</div>
    <p className="sbx-layout-note">Neutral blocks represent content. Tinted bands expose spacing. Dashed outlines mark boundaries. All diagram styling is documentation-only.</p>
  </LayoutPage>,
};

function Playground() {
  const [width, setWidth] = useState(768);
  const [draft, setDraft] = useState('768');
  const [guides, setGuides] = useState(false);
  const id = useId();
  const { ref, measurement } = useLayoutMeasurement(width);
  const updateWidth = (next: number) => { setWidth(next); setDraft(String(next)); };
  const commitWidth = () => {
    const next = Number(draft);
    if (draft.trim() && Number.isFinite(next)) updateWidth(Math.max(240, Math.min(1920, Math.round(next))));
    else setDraft(String(width));
  };
  return <LayoutPage title="Responsive playground" description="Resize a parent container inside the page. Inline changes arrangement at sm; Grid chooses its column count intrinsically.">
    <div className="sbx-layout-toolbar">
      <label htmlFor={`${id}-number`}>Parent width <span className="sbx-layout-input-unit">
        <input id={`${id}-number`} type="number" min={240} max={1920} step={1} value={draft}
          onChange={event => setDraft(event.target.value)} onBlur={commitWidth}
          onKeyDown={event => { if (event.key === 'Enter') commitWidth(); }} />px
      </span></label>
      <label className="sbx-layout-slider" htmlFor={`${id}-range`}>Resize parent
        <input id={`${id}-range`} type="range" min={240} max={1920} value={width} onChange={event => updateWidth(Number(event.target.value))} />
      </label>
      <label><input type="checkbox" checked={guides} onChange={event => setGuides(event.target.checked)} /> Show layout guides</label>
    </div>
    <div className="sbx-filter-bar sbx-layout-presets" role="group" aria-label="Parent width presets">
      {[{ size: 'base', width: 320 }, ...thresholds].map(preset => <button key={preset.size} type="button"
        aria-pressed={width === preset.width} onClick={() => updateWidth(preset.width)}>
        {preset.size}<span>{preset.width}px</span>
      </button>)}
    </div>
    <div className="sbx-layout-readout" aria-label="Measured layout">
      <span>Parent <strong>{measurement.width || 'Measuring'}</strong></span>
      <span>Inline <strong>{measurement.flow === 'row' ? 'Stacked' : measurement.flow ? 'Horizontal' : 'Measuring'}</strong></span>
      <span>Grid <strong>{measurement.columns || '…'} {measurement.columns === 1 ? 'column' : 'columns'}</strong></span>
      <span>Threshold <strong>sm · 768px</strong></span>
    </div>
    <div className="sbx-layout-canvas" role="region" aria-label="Resizable parent preview" tabIndex={0}>
      <div ref={ref} className={`sbx-layout-frame${guides ? ' sbx-layout-guides' : ''}`} style={{ width }}>
        <Stack gap="xl">
          <Inline justify="end"><Button variant="outline">Cancel</Button><Button>Save changes</Button></Inline>
          <Grid>{['Overview', 'Projects', 'Activity', 'Members'].map((name, index) =>
            <Block key={name}><span className="sbx-layout-item-number">0{index + 1}</span><h3>{name}</h3><p>Workspace content</p></Block>)}</Grid>
        </Stack>
      </div>
    </div>
    <pre className="sbx-layout-code"><code>{'<Inline stackBelow="sm" justify="end">…</Inline>\n<Grid preset="cards">…</Grid>'}</code></pre>
    <p className="sbx-layout-note">The preview stays at its actual CSS-pixel width. Scroll inside the canvas when it is wider than this page. DOM reading and focus order do not change.</p>
  </LayoutPage>;
}
export const ResponsivePlayground: Story = { render: () => <Playground /> };

export const Breakpoints: Story = {
  render: () => <LayoutPage title="Responsive thresholds" description="Mobile-first width boundaries familiar from Webflow. T-shirt names describe thresholds, not devices.">
    <div className="sbx-layout-ruler" aria-hidden="true">
      {[{ size: 'base', width: 0 }, ...thresholds].map(preset => <div key={preset.size}><strong>{preset.size}</strong><span>{preset.width}px</span></div>)}
    </div>
    <div className="sbx-table-scroll"><table className="sbx-token-table" aria-label="Breakpoint ranges">
      <thead><tr><th scope="col">Name</th><th scope="col">Width range</th><th scope="col">Broad mode</th></tr></thead>
      <tbody><tr><th scope="row">base</th><td>width &lt; {thresholds[0].width}px</td><td>Compact</td></tr>
        {thresholds.map((preset, index) => <tr key={preset.size}><th scope="row">{preset.size}</th>
          <td>{preset.width}px ≤ width{thresholds[index + 1] ? ` < ${thresholds[index + 1].width}px` : ''}</td>
          <td>{index === 0 ? 'Compact' : index < 3 ? 'Regular' : 'Wide'}</td></tr>)}
      </tbody></table></div>
    <p className="sbx-layout-note">The ruler is schematic, not proportional. Inline measures its parent container; page gutters measure the iframe viewport. A breakpoint does not require every component to change.</p>
  </LayoutPage>,
};
export const StressCases: Story = {
  render: () => <LayoutPage title="Layout stress cases" description="Long text, narrow parent width, and right-to-left reading direction. Increase root font size to test scalable spacing.">
    <Specimen title="Narrow RTL composition" code={'<Stack gap="lg">…</Stack>'} note="Actions keep DOM order; text wraps without forcing the page wider.">
      <div className="sbx-layout-frame" style={{ maxWidth: 360 }} dir="rtl"><Stack gap="lg">
        <Inline><Button>Cancel this pending operation</Button><Button>Save all workspace changes</Button></Inline>
        <Grid><Block>A-very-long-unbroken-content-value-that-must-not-force-the-layout-wider-than-its-parent</Block><Block>Second item</Block></Grid>
        <Container size="reading"><Block>Nested parent fill with border-box gutters.</Block></Container>
      </Stack></div>
    </Specimen>
  </LayoutPage>,
};
export const SizingRelationships: Story = {
  render: () => <LayoutPage title="Sizing relationships" description="Parent fill, viewport size, and remaining track space are three different contracts.">
    <Specimen title="Parent fill · 100%" description="Measures the containing block's width." code="inline-size: var(--system-layout-size-fill);" note="Resize the parent to change this box.">
      <div className="sbx-layout-frame" style={{ width: 'min(100%, 400px)' }}><Block>100% of this parent</Block></div>
    </Specimen>
    <Specimen title="Viewport fit · dvh" description="Measures the iframe viewport's dynamic height." code="block-size: calc(var(--system-layout-viewport-block-size) * 0.2);" note="Change the iframe viewport height, not the parent width.">
      <div className="sbx-layout-block" style={{ blockSize: 'calc(var(--system-layout-viewport-block-size) * 0.2)' }}>20dvh</div>
    </Specimen>
    <Specimen title="Remaining track · 1fr" description="Shares space left after the intrinsic track and gap." code="grid-template-columns: auto minmax(0, 1fr);" note="Resize the parent; the flexible track takes the remainder.">
      <div style={{ display: 'grid', gridTemplateColumns: 'auto minmax(0, 1fr)', gap: 'var(--system-spacer-rem-sm)' }}>
        <Block>Sidebar</Block><Block>Remaining track</Block>
      </div>
    </Specimen>
  </LayoutPage>,
};
export const Semantics: Story = { render: () => <TokenReference category="layout" /> };
export const ComponentTokens: Story = { render: () => <TokenReference owner="layout" /> };
