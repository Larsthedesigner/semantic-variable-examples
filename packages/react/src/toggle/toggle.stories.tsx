import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Toggle } from './toggle';

const meta: Meta<typeof Toggle> = {
  title: 'Components/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  args: { children: 'Bold', iconStartIcon: 'format_bold', size: 'md' },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    pressed: { control: 'boolean' },
    defaultPressed: { control: 'boolean' },
    disabled: { control: 'boolean' },
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
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Toggle key={size} {...args} size={size}>{size}</Toggle>
      ))}
    </div>
  ),
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

export const Controlled: Story = { render: () => <ControlledExample /> };
export const Themes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      {(['light', 'dark', 'high-contrast'] as const).map((theme) => (
        <section key={theme} className={theme === 'light' ? undefined : theme} style={{
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
};
