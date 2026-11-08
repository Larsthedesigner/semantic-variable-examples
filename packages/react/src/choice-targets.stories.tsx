import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Checkbox } from './checkbox/checkbox';
import { Radio } from './radio/radio';
import { Switch } from './switch/switch';
import { Label } from './label/label';
import { Field, FieldControl, FieldLabel } from './field/field';

const sizes = ['sm', 'md', 'lg'] as const;

const meta = {
  title: 'Accessibility/Choice target areas',
  parameters: {
    controls: { disable: true },
    docs: { description: { component: 'Fixed examples of adjacent standalone targets and label and Field compositions. This reference has no component props of its own.' } },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const MinimumTargets: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16, justifyItems: 'start' }}>
      {sizes.map(size => (
        <div key={size} style={{ display: 'flex', alignItems: 'center' }}>
          <Checkbox size={size} aria-label={`${size} checkbox`} />
          <Radio size={size} value={size} aria-label={`${size} radio`} />
          <Switch size={size} aria-label={`${size} switch`} />
        </div>
      ))}
      <Label><Checkbox size="sm" />Wrapped checkbox</Label>
      <Field size="sm">
        <FieldLabel>Field switch</FieldLabel>
        <FieldControl><Switch /></FieldControl>
      </Field>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const size of sizes) {
      for (const [role, name] of [['checkbox', 'checkbox'], ['radio', 'radio'], ['switch', 'switch']] as const) {
        const control = canvas.getByRole(role, { name: `${size} ${name}` });
        const rect = control.getBoundingClientRect();
        await expect(rect.width).toBeGreaterThanOrEqual(24);
        await expect(rect.height).toBeGreaterThanOrEqual(24);
        for (const [x, y] of [[rect.left + 1, rect.top + 1], [rect.right - 1, rect.bottom - 1]]) {
          await expect(control.ownerDocument.elementFromPoint(x, y)).toBe(control);
        }
        await userEvent.click(control);
        await expect(control).toBeChecked();
      }
    }
    await userEvent.click(canvas.getByText('Wrapped checkbox'));
    await expect(canvas.getByRole('checkbox', { name: 'Wrapped checkbox' })).toBeChecked();
    await userEvent.click(canvas.getByText('Field switch'));
    const fieldSwitch = canvas.getByRole('switch', { name: 'Field switch' });
    await expect(fieldSwitch).toBeChecked();
    await userEvent.tab({ shift: true });
    const wrapped = canvas.getByRole('checkbox', { name: 'Wrapped checkbox' });
    await expect(wrapped).toHaveFocus();
    for (const control of [wrapped, fieldSwitch]) {
      const rect = control.getBoundingClientRect();
      await expect(rect.width).toBeGreaterThanOrEqual(24);
      await expect(rect.height).toBeGreaterThanOrEqual(24);
    }
  },
};
