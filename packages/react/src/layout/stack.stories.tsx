import type { Meta, StoryObj } from '@storybook/react';
import { Stack, layoutGaps } from './layout';
import { Block, LayoutPage, Specimen, useLayoutMeasurement } from './layout-story-helpers';
import { primitiveTokens, tokenCatalog } from '../tokens/token-catalog';

const meta = {
  title: 'Foundations/Layout/Stack', component: Stack, tags: ['autodocs'],
  args: { gap: 'lg' }, argTypes: { gap: { control: 'select', options: layoutGaps }, asChild: { table: { disable: true } } },
} satisfies Meta<typeof Stack>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {
  render: args => <LayoutPage title="Stack" description="Arrange related content vertically. The parent owns the gap; children retain their own margins.">
    <Specimen title="Vertical flow" code={`<Stack gap="${args.gap}">…</Stack>`}>
      <Stack {...args}><Block>First region</Block><Block>Second region</Block><Block>Third region</Block></Stack>
    </Specimen>
  </LayoutPage>,
};
function GapRow({ gap }: { gap: (typeof layoutGaps)[number] }) {
  const { ref, measurement } = useLayoutMeasurement(gap);
  const token = tokenCatalog('light').find(entry => entry.name === `--system-spacer-rem-${gap}`);
  return <div className="sbx-layout-gap-row">
    <div><strong>{gap}</strong><code>{token?.value ?? '0'}</code><small>Measured: {measurement.gap || '…'}</small></div>
    <div ref={ref} className="sbx-layout-gap-diagram sbx-layout-guides"><Stack gap={gap}><Block>Content</Block><Block>Content</Block></Stack></div>
    <code>{token?.name ?? 'No separation'}</code>
  </div>;
}
export const GapScale: Story = {
  parameters: { controls: { disable: true } },
  render: () => <LayoutPage title="Stack gap scale" description="Compare identical content blocks. The tinted space is the gap, not child padding. Rem values follow the root font size.">
    <div className="sbx-layout-gap-list">{layoutGaps.map(gap => <GapRow key={gap} gap={gap} />)}</div>
    <p className="sbx-layout-note">At a {parseFloat(primitiveTokens['--size-px-16'])}px root, 1rem is 16px. The measured gap reflects the current browser value.</p>
    <Specimen title="Nested spacing" description="Larger spacing separates groups; smaller spacing connects related content." code={'<Stack gap="xl">\n  <Stack gap="xs">…</Stack>\n  <Stack gap="xs">…</Stack>\n</Stack>'}>
      <Stack gap="xl">{['Workspace name', 'Contact email'].map(label => <Stack key={label} gap="xs"><strong>{label}</strong><Block>Example field</Block><span className="sbx-layout-note">Supporting information</span></Stack>)}</Stack>
    </Specimen>
  </LayoutPage>,
};
