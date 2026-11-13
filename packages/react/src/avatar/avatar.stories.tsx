import { TokenReference } from '../tokens/token-reference';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar } from './avatar';

const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  args: { name: 'Ada Lovelace', size: 'md' },
  argTypes: {
    name: {
      control: 'text', description: 'Required accessible name of the represented person.',
      table: { type: { summary: 'string' } },
    },
    src: {
      control: 'text', description: 'Image URL; initials or the custom fallback appear if omitted or loading fails.',
      table: { type: { summary: 'string' } },
    },
    size: {
      control: 'select', options: ['sm', 'md', 'lg'], description: 'Avatar diameter.',
      table: { type: { summary: "'sm' | 'md' | 'lg'" }, defaultValue: { summary: 'md' } },
    },
    fallback: {
      control: false, description: 'Custom fallback ReactNode. Defaults to initials derived from name.',
      table: { type: { summary: 'ReactNode' } },
    },
    className: { control: false, description: 'Additional class names on the avatar.', table: { type: { summary: 'string' } } },
    'aria-label': { control: false, description: 'Optional accessible-name override; defaults to name.', table: { type: { summary: 'string' } } },
  },
  parameters: {
    docs: { description: { component: 'Avatar accepts native span props and forwards its ref. The required name labels the avatar; an empty name throws. Images are decorative within the named avatar, and fallback initials use the first characters of up to two name parts.' } },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Default: Story = {};
export const WithInitials: Story = {};
export const WithImage: Story = {
  args: { src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 96 96'%3E%3Crect width='96' height='96' fill='%235b6b9a'/%3E%3Ccircle cx='48' cy='35' r='18' fill='%23f2cdbd'/%3E%3Cpath d='M15 96c3-22 15-34 33-34s30 12 33 34' fill='%23e4b46c'/%3E%3C/svg%3E" },
  parameters: {
    docs: { description: { story: 'Uses a self-contained SVG data URL for illustration; the initials fallback remains available if the image cannot load.' } },
  },
};
export const Sizes: Story = {
  argTypes: { size: { control: false }, name: { control: false }, src: { control: false } },
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Avatar {...args} key={size} name="Ada Lovelace" size={size} />
      ))}
    </div>
  ),
  parameters: {
    docs: { description: { story: 'Fixed size comparison; size, name, and image URL are disabled because each avatar sets them explicitly.' } },
  },
};
export const Tokens: Story = {
  render: () => <TokenReference owner="avatar" />,
  parameters: {
    controls: { disable: true },
    docs: { description: { story: 'Reference-only view of Avatar design tokens. This story renders TokenReference rather than Avatar, so component controls do not apply.' } },
  },
};
