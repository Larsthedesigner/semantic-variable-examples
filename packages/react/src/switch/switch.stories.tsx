import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Switch } from './switch';
import { Field, FieldLabel, FieldControl, FieldDescription, FieldError } from '../field/field';
import { Button } from '../button/button';

const meta: Meta<typeof Switch> = {
  title: 'Components/Switch',
  component: Switch,
  tags: ['autodocs'],
  args: { 'aria-label': 'Notifications', size: 'md' },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    checked: { control: 'boolean' },
    defaultChecked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {};
export const Checked: Story = { args: { defaultChecked: true } };
export const Disabled: Story = { args: { disabled: true } };
export const DisabledChecked: Story = { args: { disabled: true, defaultChecked: true } };
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Field key={size} size={size}>
          <FieldLabel>{size} notifications</FieldLabel>
          <FieldControl><Switch /></FieldControl>
          <FieldDescription>Size comes from Field.</FieldDescription>
        </Field>
      ))}
    </div>
  ),
};
export const Invalid: Story = {
  render: () => (
    <Field invalid required style={{ maxWidth: 320 }}>
      <FieldLabel>Notifications</FieldLabel>
      <FieldControl><Switch /></FieldControl>
      <FieldDescription>Receive notifications.</FieldDescription>
      <FieldError>Enable notifications to continue.</FieldError>
    </Field>
  ),
};

function ControlledExample() {
  const [checked, setChecked] = useState(false);
  return (
    <Field style={{ maxWidth: 320 }}>
      <FieldLabel>Notifications</FieldLabel>
      <FieldControl><Switch checked={checked} onCheckedChange={setChecked} /></FieldControl>
      <FieldDescription>Notifications are {checked ? 'on' : 'off'}.</FieldDescription>
    </Field>
  );
}

export const Controlled: Story = { render: () => <ControlledExample /> };
export const FormReset: Story = {
  render: () => (
    <form style={{ display: 'grid', gap: 16, justifyItems: 'start' }}>
      <Field>
        <FieldLabel>Notifications</FieldLabel>
        <FieldControl><Switch name="notifications" defaultChecked /></FieldControl>
        <FieldDescription>Turn off, then reset to restore the initial state.</FieldDescription>
      </Field>
      <Button type="reset">Reset</Button>
    </form>
  ),
};
export const Themes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      {(['light', 'dark', 'high-contrast'] as const).map((theme) => (
        <section key={theme} className={theme === 'light' ? undefined : theme} style={{
          background: 'var(--system-surface-default)', color: 'var(--system-text-primary)',
          padding: 16, display: 'flex', alignItems: 'center', gap: 16,
        }}>
          <span>{theme}</span>
          <Switch aria-label={`${theme} off`} />
          <Switch aria-label={`${theme} on`} defaultChecked />
          <Switch aria-label={`${theme} disabled off`} disabled />
          <Switch aria-label={`${theme} disabled on`} disabled defaultChecked />
        </section>
      ))}
    </div>
  ),
};
