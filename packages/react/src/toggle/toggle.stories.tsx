import { TokenReference } from '../tokens/token-reference';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Toggle } from './toggle';

const meta: Meta<typeof Toggle> = {
  title: 'Components/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  args: { children: 'Bold', iconStartIcon: 'format_bold', size: 'md' },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Toggle size.',
      table: { type: { summary: "'sm' | 'md' | 'lg'" }, defaultValue: { summary: 'md' } },
    },
    pressed: {
      control: 'boolean',
      description: 'Controlled pressed state. Use defaultPressed for an uncontrolled toggle.',
      table: { type: { summary: 'boolean' } },
    },
    defaultPressed: {
      control: 'boolean',
      description: 'Initial pressed state for an uncontrolled toggle.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    onPressedChange: {
      control: false,
      description: 'Called with the new pressed state after an unprevented click.',
      table: { type: { summary: '(pressed: boolean) => void' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Disable interaction.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    iconStartIcon: {
      control: 'text',
      description: 'Material Symbols ligature name for a leading icon.',
      table: { type: { summary: 'string' } },
    },
    iconEndIcon: {
      control: 'text',
      description: 'Material Symbols ligature name for a trailing icon.',
      table: { type: { summary: 'string' } },
    },
    children: {
      control: 'text',
      description: 'Toggle content.',
      table: { type: { summary: 'ReactNode' } },
    },
    type: {
      control: 'select',
      options: ['button', 'submit', 'reset'],
      description: 'Native button type.',
      table: { type: { summary: "'button' | 'submit' | 'reset'" }, defaultValue: { summary: 'button' } },
    },
    className: {
      control: false,
      description: 'Additional CSS class names.',
      table: { type: { summary: 'string' } },
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Toggle accepts native button props except aria-pressed, which is managed by the pressed state. Its visual treatment and color reflect whether it is pressed.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Toggle>;

export const Default: Story = {};
export const Pressed: Story = { args: { defaultPressed: true } };
export const Disabled: Story = { args: { disabled: true, defaultPressed: true } };
export const IconOnly: Story = {
  args: { children: undefined, 'aria-label': 'Bold' },
};
export const Sizes: Story = {
  argTypes: {
    size: { control: false },
    children: { control: false },
  },
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Toggle key={size} {...args} size={size}>{size}</Toggle>
      ))}
    </div>
  ),
  parameters: {
    docs: { description: { story: 'A fixed size comparison. Size and children are disabled because each example sets them explicitly; the other Toggle controls apply to all three examples.' } },
  },
};

function ControlledExample() {
  const [pressed, setPressed] = useState(false);
  return (
    <div style={{ display: 'grid', gap: 16, justifyItems: 'start' }}>
      <Toggle pressed={pressed} onPressedChange={setPressed} iconStartIcon="format_bold">Bold</Toggle>
      <p style={{ fontWeight: pressed ? 700 : 400 }}>Example text reflects the pressed state.</p>
    </div>
  );
}

export const Controlled: Story = {
  render: () => <ControlledExample />,
  parameters: {
    controls: { disable: true },
    docs: { description: { story: 'The example manages the controlled pressed state internally, so Toggle component controls do not apply.' } },
  },
};
export const Themes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      {(['light', 'dark', 'high-contrast'] as const).map((theme) => (
        <section key={theme} className={theme} style={{
          background: 'var(--system-surface-default)', color: 'var(--system-text-primary)',
          padding: 16, display: 'flex', alignItems: 'center', gap: 16,
        }}>
          <span>{theme}</span>
          <Toggle>Bold</Toggle>
          <Toggle defaultPressed>Italic</Toggle>
          <Toggle disabled>Underline</Toggle>
          <Toggle disabled defaultPressed>Strikethrough</Toggle>
        </section>
      ))}
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: { description: { story: 'A fixed theme and state comparison. Each Toggle is configured explicitly, so component controls do not apply.' } },
  },
};

export const Tokens: Story = {
  render: () => <TokenReference owner="button" />,
  parameters: {
    controls: { disable: true },
    docs: { description: { story: 'Reference-only view of Toggle design tokens. This story renders TokenReference rather than a Toggle, so component controls do not apply.' } },
  },
};
