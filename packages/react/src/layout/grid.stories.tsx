import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Grid, layoutGaps } from './layout';
import type { GridProps } from './layout';
import { Block, LayoutPage, Specimen, useLayoutMeasurement } from './layout-story-helpers';

const meta = {
  title: 'Foundations/Layout/Grid', component: Grid, tags: ['autodocs'],
  args: { preset: 'cards' },
  argTypes: { preset: { control: 'select', options: ['cards', 'equal-2', 'equal-3'] }, gap: { control: 'select', options: layoutGaps }, asChild: { table: { disable: true } } },
} satisfies Meta<typeof Grid>;
export default meta;
type Story = StoryObj<GridProps>;
function GridExample({ preset, ...args }: GridProps) {
  const { ref, measurement } = useLayoutMeasurement(`${preset}-${args.gap}`);
  return <Specimen title={preset === 'cards' ? 'Adaptive cards' : preset === 'equal-2' ? 'Equal 2' : 'Equal 3'}
    description={preset === 'cards' ? 'Fits as many tracks as the 17.5rem minimum allows; one track below that minimum.' : 'Retains its column count at every width.'}
    code={`<Grid preset="${preset}"${args.gap ? ` gap="${args.gap}"` : ''}>…</Grid>`}>
    <div className="sbx-layout-readout"><span>Current columns <strong>{measurement.columns || '…'}</strong></span><span>Gap <strong>{measurement.gap || '…'}</strong></span></div>
    <div ref={ref}><Grid {...args} preset={preset}>{[1, 2, 3, 4].map(number => <Block key={number}><span className="sbx-layout-item-number">0{number}</span><span>Content item</span></Block>)}</Grid></div>
  </Specimen>;
}
export const Playground: Story = {
  render: args => <LayoutPage title="Grid" description="Use adaptive tracks for card collections; fixed equal tracks for intentionally persistent columns."><GridExample {...args} /></LayoutPage>,
};
function PresetComparison() {
  const [guides, setGuides] = useState(true);
  return <LayoutPage title="Grid presets" description="Compare the same four items and available width. Adaptive and fixed presets solve different problems.">
    <label className="sbx-layout-toggle"><input type="checkbox" checked={guides} onChange={event => setGuides(event.target.checked)} /> Show layout guides</label>
    <div className={`sbx-layout-sections${guides ? ' sbx-layout-guides' : ''}`}>{(['cards', 'equal-2', 'equal-3'] as const).map(preset => <GridExample key={preset} preset={preset} />)}</div>
  </LayoutPage>;
}
export const Presets: Story = { parameters: { controls: { disable: true } }, render: () => <PresetComparison /> };
