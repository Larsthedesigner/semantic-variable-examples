import type { Meta, StoryObj } from '@storybook/react-vite';
import { Introduction } from './introduction';

const meta = {
  title: 'Introduction/Content',
  tags: ['!dev', '!autodocs'],
  parameters: { controls: { disable: true } },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Welcome: Story = {
  render: (_args, { globals }) => <Introduction dark={globals.theme === 'dark'} />,
};
