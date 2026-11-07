import type { Meta, StoryObj } from '@storybook/react-vite';
import { Inline, layoutBreakpoints, layoutGaps } from './layout';
import { Block, LayoutPage, Specimen } from './layout-story-helpers';

const meta = {
  title: 'Foundations/Layout/Inline', component: Inline, tags: ['autodocs'],
  args: { gap: 'sm', align: 'center', justify: 'start', stackBelow: 'sm' },
  argTypes: {
    gap: { control: 'select', options: layoutGaps },
    align: { control: 'select', options: ['start', 'center', 'end'] },
    justify: { control: 'select', options: ['start', 'center', 'end'] },
    stackBelow: { control: 'select', options: layoutBreakpoints },
  },
} satisfies Meta<typeof Inline>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {
  render: args => <LayoutPage title="Inline" description="Arrange items horizontally, then stack below a prescribed parent-width threshold. This is not content-driven wrapping.">
    <Specimen title="Parent-aware alignment" code={`<Inline gap="${args.gap}" align="${args.align}" justify="${args.justify}" stackBelow="${args.stackBelow}">…</Inline>`}
      note="The outer wrapper measures available width. At narrow widths, tracks stretch and preserve DOM order.">
      <Inline {...args}><Block>First item</Block><Block>Second item</Block><Block>Third item</Block></Inline>
    </Specimen>
  </LayoutPage>,
};
