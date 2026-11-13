import type { Meta, StoryObj } from '@storybook/react-vite';
import { Container } from './layout';
import type { ContainerProps } from './layout';
import { Block, LayoutPage, Specimen, useLayoutMeasurement } from './layout-story-helpers';

const meta = {
  title: 'Foundations/Layout/Container', component: Container, tags: ['autodocs'],
  args: { size: 'content', gutter: 'responsive' },
  argTypes: { size: { control: 'select', options: ['reading', 'content', 'wide'] }, gutter: { control: 'select', options: ['responsive', 'fluid', 'none'] }, asChild: { table: { disable: true } } },
} satisfies Meta<typeof Container>;
export default meta;
type Story = StoryObj<ContainerProps>;
function ContainerExample(args: ContainerProps) {
  const { ref, measurement } = useLayoutMeasurement(`${args.size}-${args.gutter}`);
  return <Specimen title={`${args.size} width · ${args.gutter} gutters`}
    code={`<Container size="${args.size}" gutter="${args.gutter}">…</Container>`}
    note="The maximum outer width includes padding. At narrow widths, all presets may fill the same parent.">
    <div className="sbx-layout-readout"><span>Maximum <strong>{measurement.max || '…'}</strong></span>
      <span>Rendered <strong>{measurement.width || '…'}</strong></span><span>Each gutter <strong>{measurement.padding || '…'}</strong></span></div>
    <div ref={ref} className="sbx-layout-parent">
      <Container {...args} className="sbx-layout-container"><Block>Content region</Block></Container>
    </div>
    <div className="sbx-layout-legend"><span>Outer space: neutral canvas</span><span>Gutters: tinted bands</span><span>Content: outlined block</span></div>
  </Specimen>;
}
export const Playground: Story = {
  render: args => <LayoutPage title="Container" description="Center content, bound its outer width, and apply page gutters. Use the viewport toolbar to change responsive or fluid gutters."><ContainerExample {...args} /></LayoutPage>,
};
export const WidthPresets: Story = {
  parameters: { controls: { disable: true } },
  render: () => <LayoutPage title="Container widths" description="Reading, content, and wide are content constraints, not breakpoints. Compare their caps using a wide iframe viewport.">
    {(['reading', 'content', 'wide'] as const).map(size => <ContainerExample key={size} size={size} gutter="responsive" />)}
    <ContainerExample size="content" gutter="fluid" />
  </LayoutPage>,
};
