import type { Meta, StoryObj } from '@storybook/react-vite';
import { MaterialSymbol, materialSymbolSizes } from './material-symbol';

const meta: Meta<typeof MaterialSymbol> = {
  title: 'Foundations/Icons/Material Symbol',
  component: MaterialSymbol,
  tags: ['autodocs'],
  args: {
    name: 'add',
  },
  argTypes: {
    name: { control: 'text' },
    size: { control: 'select', options: materialSymbolSizes },
    fill: { control: 'boolean' },
    weight: { control: 'select', options: [100, 200, 300, 400, 500, 600, 700] },
  },
};

export default meta;
type Story = StoryObj<typeof MaterialSymbol>;

export const Default: Story = {};
export const Filled: Story = { args: { name: 'favorite', fill: true } };

export const SizeScale: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      {materialSymbolSizes.map((size) => (
        <div key={size} style={{ display: 'grid', justifyItems: 'center', gap: 8 }}>
          <MaterialSymbol name="star" size={size} />
          <span>{size}</span>
        </div>
      ))}
    </div>
  ),
};
