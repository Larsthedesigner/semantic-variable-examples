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
    name: {
      control: 'text', description: 'Required Material Symbols ligature name, such as add or arrow_downward.',
      table: { type: { summary: 'string' } },
    },
    size: {
      control: 'select', options: materialSymbolSizes,
      description: 'Fixed glyph size. When omitted, inherits contextual sizing or falls back to 24px.',
      table: { type: { summary: "'xs' | 'sm' | 'md' | 'lg' | 'xl'" }, defaultValue: { summary: 'contextual or 24px' } },
    },
    fill: {
      control: 'boolean', description: 'Use the filled glyph variant.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    weight: {
      control: 'select', options: [100, 200, 300, 400, 500, 600, 700], description: 'Variable-font stroke weight.',
      table: { type: { summary: '100 | 200 | 300 | 400 | 500 | 600 | 700' }, defaultValue: { summary: '400' } },
    },
    'aria-label': {
      control: 'text', description: 'Accessible name for a meaningful icon; also defaults role to img and removes automatic aria-hidden.',
      table: { type: { summary: 'string' } },
    },
    'aria-hidden': {
      control: false, description: 'Override visibility to assistive technology. Defaults to true without an aria-label and is otherwise unset.',
      table: { type: { summary: "boolean | 'true' | 'false'" }, defaultValue: { summary: 'true without aria-label' } },
    },
    role: {
      control: false, description: 'Override the span role. Defaults to img when aria-label is supplied and is otherwise unset.',
      table: { type: { summary: 'AriaRole' } },
    },
    className: {
      control: false, description: 'Additional CSS class names on the icon span.',
      table: { type: { summary: 'string' } },
    },
    style: {
      control: false, description: 'Native span styles. Font variation settings are managed by fill and weight.',
      table: { type: { summary: 'CSSProperties' } },
    },
  },
  parameters: {
    docs: { description: { component: 'MaterialSymbol accepts native span attributes except children; name supplies the glyph content. Icons are decorative and hidden from assistive technology by default. Supply aria-label for a standalone meaningful icon; for an icon-only button, put the accessible name on the button instead.' } },
  },
};

export default meta;
type Story = StoryObj<typeof MaterialSymbol>;

export const Default: Story = {};
export const Filled: Story = { args: { name: 'favorite', fill: true } };

export const SizeScale: Story = {
  argTypes: {
    size: { control: false },
  },
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      {materialSymbolSizes.map((size) => (
        <div key={size} style={{ display: 'grid', justifyItems: 'center', gap: 8 }}>
          <MaterialSymbol {...args} size={size} />
          <span>{size}</span>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: { description: { story: 'A fixed size comparison. Size is disabled because each icon sets its own size; name, fill, and weight controls apply to every icon.' } },
  },
};
