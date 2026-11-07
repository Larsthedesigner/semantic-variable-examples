import type { Meta, StoryObj } from '@storybook/react-vite';
import { TokenReference } from './token-reference';

const meta = {
  title: 'Foundations/Radius', component: TokenReference,
  args: { category: 'radius', mode: 'light' },
  argTypes: {
    category: { table: { disable: true } }, owner: { table: { disable: true } },
    mode: { control: 'select', options: ['light', 'dark', 'high-contrast'] },
  },
} satisfies Meta<typeof TokenReference>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Semantics: Story = {};
