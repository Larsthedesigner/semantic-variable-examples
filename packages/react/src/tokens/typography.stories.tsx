import type { Meta, StoryObj } from '@storybook/react-vite';
import { TypographyPrimitives, TypographySemantics } from './typography-reference';

const meta: Meta<typeof TypographySemantics> = {
  title: 'Foundations/Typography',
  component: TypographySemantics,
  args: { mode: 'light' },
  argTypes: { mode: { control: 'select', options: ['light', 'dark', 'high-contrast'] } },
};
export default meta;
type Story = StoryObj<typeof TypographySemantics>;

export const Semantics: Story = {};
export const Primitives: Story = { render: () => <TypographyPrimitives /> };
