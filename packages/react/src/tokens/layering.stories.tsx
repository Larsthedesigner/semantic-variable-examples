import type { Meta, StoryObj } from '@storybook/react-vite';
import { TokenReference } from './token-reference';

const meta = {
  title: 'Foundations/Layering',
  component: TokenReference,
  args: { category: 'layering' },
  argTypes: {
    category: { table: { disable: true } },
    mode: { table: { disable: true } },
    owner: { table: { disable: true } },
  },
  parameters: {
    docs: {
      description: {
        component: 'Global z-index roles order sticky chrome, menus/popovers, modal backdrops/content, tooltips, and the reserved toast layer. Local control stacking and nested stacking contexts are outside this global contract.',
      },
    },
  },
} satisfies Meta<typeof TokenReference>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Semantics: Story = {};
